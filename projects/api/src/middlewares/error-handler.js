const ApiError = require("../utils/error");
const { errorLogger } = require("../services/logging");

module.exports = (err, req, res, next) => {
	if (err instanceof ApiError) {
		errorLogger(err.message);
		return res
			.status(err.status)
			.json({ message: err.message, errors: err.errors });
	}
	errorLogger("Unexpected error");
	return res.status(500).json({ message: "Unexpected error" });
};
