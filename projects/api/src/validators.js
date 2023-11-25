const ERROR_MESSAGES = require("./constants/error-messages");
const { FIELDS, FIELD_TYPES } = require("./constants/enums");

module.exports.validateName = (body, { min, max }) => {
	if (
		!body.hasOwnProperty(FIELDS.NAME) ||
		typeof body.name !== FIELD_TYPES.STRING
	) {
		throw new Error(ERROR_MESSAGES.NOT_VALID_NAME);
	}
	if (body.name.length < min || body.name.length > max) {
		throw new Error(ERROR_MESSAGES.NOT_VALID_NAME);
	}
};
