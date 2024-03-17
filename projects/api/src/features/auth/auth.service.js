const jwt = require("jsonwebtoken");
const TokensModel = require("../../models/tokens");

const { JWT_ACCESS_KEY, JWT_REFRESH_KEY, WEB_URL } = process.env;

const generateAccessToken = (data) =>
	jwt.sign(data, JWT_ACCESS_KEY, { expiresIn: "15m" });

const generateRefreshToken = (data) =>
	jwt.sign(data, JWT_REFRESH_KEY, { expiresIn: "30d" });

module.exports.getActivationLink = (id) => `${WEB_URL}/activate?id=${id}`;

module.exports.generateTokens = async (id) => {
	const accessToken = generateAccessToken({ id });
	const refreshToken = generateRefreshToken({ id });

	await TokensModel.saveToken(refreshToken, id);

	return {
		accessToken,
		refreshToken,
	};
};
