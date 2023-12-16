const ConfigModel = require("../../models/config");
const { listDto, listItemDto } = require("./list.dto");
const { getConfigs } = require("../config/config.service");

module.exports.getLists = async (lists) => {
	const configIds = lists.reduce((acc, list) => {
		if (list.config) {
			acc.push(list.config);
		}
		return acc;
	}, []);
	const configs = await ConfigModel.list(configIds);
	const configWithFields = await getConfigs(configs);
	const configMap = configWithFields.reduce((acc, item) => {
		acc[item.id.toString()] = item;
		return acc;
	}, {});

	return lists.map((item) =>
		item.children
			? listDto(item, configMap[item.config.toString()])
			: listItemDto(item),
	);
};
