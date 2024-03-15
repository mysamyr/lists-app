const STATUS_CODES = require("../constants/status-codes");
module.exports = class ApiError extends Error {
	constructor(status, message) {
		super(message);
		this.status = status;
	}

	static UnauthorizedError() {
		return new ApiError(STATUS_CODES.UNAUTHORIZED, "Authorisation Error");
	}

	static BadRequest(message) {
		return new ApiError(STATUS_CODES.BAD_REQUEST, message);
	}
};
