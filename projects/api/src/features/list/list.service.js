const ConfigModel = require("../../models/config");
const { listDto } = require("./list.dto");
const { getConfigData, getConfigsData } = require("../config/config.service");

module.exports.getListData = async (list) => {
	if (!list.config) {
		return list;
	}
	const configWithFields = await getConfigData(list.config);

	return listDto(list, configWithFields);
};

module.exports.getLists = async (lists) => {
	const configIds = lists.reduce((acc, list) => {
		if (list.config) {
			acc.push(list.config);
		}
		return acc;
	}, []);
	const configs = await ConfigModel.list(configIds);
	const configsData = await getConfigsData(configs);
	const configMap = configsData.reduce((acc, item) => {
		acc[item.id.toString()] = item;
		return acc;
	}, {});

	return lists.map((item) =>
		item.config ? listDto(item, configMap[item.config.toString()]) : item,
	);
};
