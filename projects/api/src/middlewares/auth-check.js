const jwt = require("jsonwebtoken");
const userModel = require("../models/user");
const { ForbiddenError, UnauthorizedError } = require("../utils/error");

module.exports = async (req, res, next) => {
	if (!req.headers.authorization) {
		throw UnauthorizedError();
	}
	const token = req.headers.authorization.split(" ")[1];
	if (!token) {
		throw UnauthorizedError();
	}
	try {
		const { id } = jwt.verify(token, process.env.JWT_ACCESS_KEY);
		req.userData = await userModel.getUserById(id);
	} catch {
		next(ForbiddenError());
	}
	next();
};
