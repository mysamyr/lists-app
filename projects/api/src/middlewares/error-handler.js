const ApiError = require("../utils/error");

module.exports = function (err, req, res, next) {
	// eslint-disable-next-line no-console
	console.log(err);
	if (err instanceof ApiError) {
		return res
			.status(err.status)
			.json({ message: err.message, errors: err.errors });
	}
	return res.status(500).json({ message: "Unexpected error" });
};
