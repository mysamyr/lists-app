const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidV4 } = require("uuid");
const UserModel = require("../../models/user");
const TokensModel = require("../../models/tokens");
const { getActivationLink, generateTokens } = require("./auth.service");
const { BadRequest, UnauthorizedError } = require("../../utils/error");
const { sendAuthorisationEmail } = require("../../services/email");
const {
	INCORRECT_ACTIVATION_LINK,
	ACTIVATE_ACCOUNT,
} = require("../../constants/error-messages");
const { USER_ROLES } = require("../../constants/enums");

module.exports.signup = async ({ email, password }) => {
	const existingUser = await UserModel.getUserByEmail(email);
	if (existingUser) {
		throw BadRequest("User already exists");
	}
	const passHash = await bcrypt.hash(password, +process.env.BCRYPT_SALT);

	const activationLink = uuidV4();

	await sendAuthorisationEmail({
		email,
		url: getActivationLink(activationLink),
	});

	await UserModel.createUser({ email, hash: passHash, activationLink });
};

module.exports.login = async ({ email, password }) => {
	const user = await UserModel.getUserByEmail(email);
	if (!user) {
		throw UnauthorizedError();
	}
	if (!(await bcrypt.compare(password, user.passwordHash))) {
		throw UnauthorizedError();
	}
	if (user.role === USER_ROLES.NEWBIE) {
		throw BadRequest(ACTIVATE_ACCOUNT);
	}

	return generateTokens(user.id);
};

module.exports.refresh = async (token) => {
	const userData = jwt.verify(token, process.env.JWT_REFRESH_KEY);
	if (!userData) {
		throw UnauthorizedError();
	}

	const dbToken = await TokensModel.getToken(token);
	if (!dbToken) {
		throw UnauthorizedError();
	}

	await TokensModel.dropToken(token);

	return generateTokens(userData.id);
};

module.exports.logout = async (token) => {
	await TokensModel.dropToken(token);
};

module.exports.activate = async (id) => {
	const user = await UserModel.getUserByActivationLink(id);

	if (!user) {
		throw BadRequest(INCORRECT_ACTIVATION_LINK);
	}

	await UserModel.updateUser(user.id, {
		role: USER_ROLES.USER,
		activationLink: null,
	});
};
