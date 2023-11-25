module.exports = class ApiError extends Error {
	constructor(status, message) {
		super(message);
		this.status = status;
	}

	static UnauthorizedError() {
		return new ApiError(401);
	}

	static BadRequest(message, error) {
		return new ApiError(400, message, error);
	}
};
