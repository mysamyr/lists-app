const FieldModel = require("../../models/field");
const { configDto } = require("./config.dto");
const { fieldDto } = require("../field/field.dto");
const ConfigModel = require("../../models/config");

module.exports.getConfigData = async (id) => {
	const config = await ConfigModel.getById(id);
	const fields = await FieldModel.list(config.fields);
	const fieldsMap = fields.reduce((acc, item) => {
		acc[item.id.toString()] = fieldDto(item);
		return acc;
	}, {});

	return configDto(config, fieldsMap);
};

module.exports.getConfigsData = async (configs) => {
	const fieldIds = configs.reduce((acc, { fields }) => {
		acc.push(...fields);
		return acc;
	}, []);
	const fields = await FieldModel.list(fieldIds);
	const fieldsMap = fields.reduce((acc, item) => {
		acc[item.id.toString()] = fieldDto(item);
		return acc;
	}, {});

	return configs.map((item) => configDto(item, fieldsMap));
};
