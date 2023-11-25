const ListModel = require("../../models/list");
const { BadRequest } = require("../../utils/error");
const listService = require("./list.service");
const { NO_ITEM, NOT_A_LIST } = require("../../constants/error-messages");
const { validateCreate, validateUpdate } = require("./list.validators");

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
		return parent;
	}
	const children = await ListModel.list(parent.children);

	return listService.getLists(children);
};

module.exports.create = async (id, body) => {
	// id is for items from 2-nd lvl
	if (id) {
		const parent = await ListModel.getById(id);
		if (parent && !parent.children) {
			throw BadRequest(NOT_A_LIST);
		}
		await validateCreate(body, parent);
		return ListModel.createListItem(parent.id, body);
	}
	await validateCreate(body);
	return ListModel.createEntry(body);
};

module.exports.update = async (id, body) => {
	const item = await ListModel.getById(id);
	if (!item) {
		throw BadRequest(NO_ITEM);
	}
	const parent = await ListModel.getParent(id);
	await validateUpdate(body, item, parent);
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
