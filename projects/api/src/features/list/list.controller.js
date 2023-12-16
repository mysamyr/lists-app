const ListModel = require("../../models/list");
const { BadRequest } = require("../../utils/error");
const { listItemDto } = require("./list.dto");
const listService = require("./list.service");
const { NO_ITEM, NOT_A_LIST } = require("../../constants/error-messages");

module.exports.getLists = async () => {
	const lists = await ListModel.getEntryLists();
	return listService.getLists(lists);
};

module.exports.getList = async (id) => {
	const parent = await ListModel.getById(id);
	if (!parent) {
		throw BadRequest(NO_ITEM);
	}
	if (!parent.children) {
		return listItemDto(parent);
	}
	const children = await ListModel.list(parent.children);

	return listService.getLists(children);
};

module.exports.create = async (id, body) => {
	// id is optional for 1-st lvl lists
	// todo validation
	if (id) {
		const parent = await ListModel.getById(id);
		if (parent && !parent.children) {
			throw BadRequest(NOT_A_LIST);
		}
		return ListModel.createListItem(parent.id, body);
	}
	return ListModel.createEntry(body);
};

module.exports.update = async (id, body) => {
	const item = await ListModel.getById(id);
	if (!item) {
		throw BadRequest(NO_ITEM);
	}
	await ListModel.update(id, body);
};

module.exports.delete = async (id) => {
	const item = await ListModel.getById(id);
	if (!item) {
		throw BadRequest(NO_ITEM);
	}
	if (!item.isEntry) {
		await ListModel.unlinkFromParent(id);
	}
	if (item.children) {
		await ListModel.delete(item);
	}
};
