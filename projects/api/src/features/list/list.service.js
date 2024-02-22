const ConfigModel = require("../../models/config");
const ListModel = require("../../models/list");
const { listDto } = require("./list.dto");
const { getConfigData, getConfigsData } = require("../config/config.service");
const { RENAME_LIST } = require("../../constants/error-messages");

module.exports.getListWithData = async (list) => {
	if (!list.config) {
		return list;
	}
	const configWithFields = await getConfigData(list.config);

	return listDto(list, configWithFields);
};

module.exports.getListsWithData = async (lists) => {
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

module.exports.checkForDuplicateName = async (listIds, name) => {
	const siblings = listIds
		? await ListModel.list(listIds)
		: await ListModel.getEntryLists();
	if (siblings.find((i) => i.name === name)) {
		// todo possible rename list instead of throwing error
		throw new Error(RENAME_LIST);
	}
};
