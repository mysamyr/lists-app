const ListModel = require("../../models/list");
const { BadRequest } = require("../../utils/error");
const listService = require("./list.service");
const {
	NO_ITEM,
	NOT_A_LIST,
	SAME_DESTINATION,
	SAME_ITEM,
	INSUFFICIENT_PERMISSION,
} = require("../../constants/error-messages");
const { validateCreate, validateUpdate } = require("./list.validators");

module.exports.getLists = async (userId) => {
	const lists = await ListModel.getEntryLists(userId);
	return listService.getListsWithData(lists);
};

module.exports.getListsTree = async (userId) => ListModel.getListsTree(userId);

module.exports.getListsChildren = async (id, userId) => {
	const parent = await ListModel.getById(id);
	if (!parent) {
		throw BadRequest(NO_ITEM);
	}
	if (parent.owner !== userId) {
		throw BadRequest(INSUFFICIENT_PERMISSION);
	}
	if (!parent.children) {
		return parent;
	}
	const children = await ListModel.list(parent.children);

	return listService.getListsWithData(children);
};

module.exports.create = async (id, body, userId) => {
	// id is for not entry items
	if (id) {
		const parent = await ListModel.getById(id);
		if (parent && !parent.children) {
			throw BadRequest(NOT_A_LIST);
		}
		if (parent.owner !== userId) {
			throw BadRequest(INSUFFICIENT_PERMISSION);
		}
		await validateCreate(body, parent);
		return ListModel.createListItem(parent.id, body, userId);
	}
	await validateCreate(body);
	return ListModel.createEntry(body, userId);
};

module.exports.update = async (id, body, userId) => {
	const item = await ListModel.getById(id);
	if (!item) {
		throw BadRequest(NO_ITEM);
	}
	if (item.owner !== userId) {
		throw BadRequest(INSUFFICIENT_PERMISSION);
	}
	const parent = await ListModel.getParent(id);
	await validateUpdate(body, item, parent);
	await ListModel.update(id, body);
};

module.exports.move = async (id, destination, userId) => {
	if (id === destination) {
		throw BadRequest(SAME_ITEM);
	}
	const item = await ListModel.getById(id);
	if (!item) {
		throw BadRequest(NO_ITEM);
	}
	if (item.owner !== userId) {
		throw BadRequest(INSUFFICIENT_PERMISSION);
	}
	if (destination) {
		// not to the entry
		const parent = await ListModel.getParent(id);
		if (parent && parent.id === destination) {
			throw BadRequest(SAME_DESTINATION);
		}
		const newParent = await ListModel.getById(destination);
		if (!newParent) {
			throw BadRequest(NO_ITEM);
		}

		await listService.checkForDuplicateName(newParent.children, item.name);
		if (!item.isEntry) {
			await ListModel.unlinkFromParent(id);
		} else {
			// from the entry
			await ListModel.update(id, { isEntry: false });
		}
		await ListModel.linkToParent(id, destination);
	} else {
		// to the entry
		if (item.isEntry) {
			throw BadRequest(SAME_DESTINATION);
		}
		await listService.checkForDuplicateName(null, item.name);
		await ListModel.unlinkFromParent(id);
		await ListModel.update(id, { isEntry: true });
	}
};

module.exports.delete = async (id, userId) => {
	const item = await ListModel.getById(id);
	if (!item) {
		throw BadRequest(NO_ITEM);
	}
	if (item.owner !== userId) {
		throw BadRequest(INSUFFICIENT_PERMISSION);
	}
	if (!item.isEntry) {
		await ListModel.unlinkFromParent(id);
	}
	if (item.children) {
		await ListModel.delete(item);
	}
};
