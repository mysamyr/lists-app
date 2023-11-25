const FieldModel = require("../../models/field");
const { configDto } = require("./config.dto");
const { fieldDto } = require("../field/field.dto");

module.exports.getConfigs = async (configs) => {
	const fieldIds = configs.reduce((acc, id) => {
		acc.push(...id.fields);
		return acc;
	}, []);
	const fields = await FieldModel.list(fieldIds);
	const fieldsMap = fields.reduce((acc, item) => {
		acc[item.id.toString()] = fieldDto(item);
		return acc;
	}, {});

	return configs.map((item) => configDto(item, fieldsMap));
};
