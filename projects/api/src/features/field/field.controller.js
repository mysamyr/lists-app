const FieldModel = require("../../models/field");
const ConfigModel = require("../../models/config");
const { BadRequest } = require("../../utils/error");
const { fieldDto } = require("./field.dto");
const {
	FIELD_EXISTS,
	NO_ITEM,
	ELEMENT_IS_BEING_USED,
} = require("../../constants/error-messages");

module.exports.list = async () => {
	const fields = await FieldModel.getAll();
	return fields.map(fieldDto);
};

module.exports.create = async (data) => {
	const isFieldExists = await FieldModel.getByName(data.name);
	if (isFieldExists) {
		throw BadRequest(FIELD_EXISTS);
	}
	// todo validation
	await FieldModel.create(data);
};

module.exports.delete = async (id) => {
	const field = await FieldModel.getById(id);
	if (!field) {
		throw BadRequest(NO_ITEM);
	}
	const isFieldUsedByConfig = await ConfigModel.getByFieldId(id);
	if (isFieldUsedByConfig) {
		throw BadRequest(ELEMENT_IS_BEING_USED);
	}
	// check if field is used somewhere
	await FieldModel.delete(id);
};
