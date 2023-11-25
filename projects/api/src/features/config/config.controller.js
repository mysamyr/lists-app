const ConfigModel = require("../../models/config");
const ListModel = require("../../models/list");
const { getConfigs } = require("./config.service");
const { BadRequest } = require("../../utils/error");
const {
	NO_ITEM,
	ELEMENT_IS_BEING_USED,
} = require("../../constants/error-messages");

module.exports.list = async () => {
	const configs = await ConfigModel.getAll();
	return getConfigs(configs);
};

module.exports.create = async (data) => {
	// todo validation
	await ConfigModel.create(data);
};

module.exports.delete = async (id) => {
	const config = await ConfigModel.getById(id);
	if (!config) {
		throw BadRequest(NO_ITEM);
	}
	const isConfigUsedByList = await ListModel.getByConfigId(id);
	if (isConfigUsedByList) {
		throw BadRequest(ELEMENT_IS_BEING_USED);
	}
	// check if field is used somewhere
	await ConfigModel.delete(id);
};
