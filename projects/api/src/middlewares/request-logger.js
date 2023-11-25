const { requestLogger } = require("../services/logging");

module.exports = (req, res, next) => {
	requestLogger(req);
	next();
};
