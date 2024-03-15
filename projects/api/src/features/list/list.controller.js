const ListModel = require("../../models/list");
const { BadRequest } = require("../../utils/error");
const listService = require("./list.service");
const {
	NO_ITEM,
	NOT_A_LIST,
	SAME_DESTINATION,
	SAME_ITEM,
} = require("../../constants/error-messages");
const { validateCreate, validateUpdate } = require("./list.validators");

module.exports.getLists = async () => {
	const lists = await ListModel.getEntryLists();
	return listService.getListsWithData(lists);
};

module.exports.getListsTree = async () => ListModel.getListsTree();

module.exports.getList = async (id) => {
	const parent = await ListModel.getById(id);
	if (!parent) {
		throw BadRequest(NO_ITEM);
	}
	if (!parent.children) {
		return parent;
	}
	const children = await ListModel.list(parent.children);

	return listService.getListsWithData(children);
};

module.exports.create = async (id, body) => {
	// id is for not entry items
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

module.exports.move = async (id, destination) => {
	if (id === destination) {
		throw BadRequest(SAME_ITEM);
	}
	const item = await ListModel.getById(id);
	if (!item) {
		throw BadRequest(NO_ITEM);
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
