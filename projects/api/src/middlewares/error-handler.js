const ApiError = require("../utils/error");
const { errorLogger } = require("../services/logging");
const STATUS_CODES = require("../constants/status-codes");

module.exports = (err, req, res, next) => {
	if (!err) {
		return res.status(STATUS_CODES.NOT_FOUND).send();
	}
	if (err instanceof ApiError) {
		errorLogger(err.message);
		return res.status(err.status).json({ message: err.message });
	}
	errorLogger("Unexpected error");
	return res
		.status(STATUS_CODES.INTERNAL_SERVER_ERROR)
		.json({ message: "Unexpected error" });
};
