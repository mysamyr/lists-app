const { ObjectId } = require("mongodb");
const db = require("../services/database");
const { stringifyObjectIds } = require("../utils/helper");
const { listTreeDto } = require("../features/list/list.dto");

class ListModel {
	async getEntryLists(userId) {
		const lists = await db.listItems
			.find({ isEntry: true, owner: new ObjectId(userId) })
			.toArray();
		return lists.map((list) => stringifyObjectIds(list, ["owner"]));
	}

	async getListsByIds(ids) {
		const lists = await db.listItems
			.find({ _id: { $in: ids }, children: { $exists: true } })
			.toArray();
		return lists.map(listTreeDto);
	}

	async _getListsRec(arr) {
		if (!arr.length) {
			return;
		}
		const res = [];
		for (const list of arr) {
			const lists = await this.getListsByIds(list.children);
			const children = await this._getListsRec(lists);
			res.push({
				id: list.id,
				name: list.name,
				children,
			});
		}
		return res;
	}

	async getListsTree(userId) {
		const lists = await this.getEntryLists(userId);
		return this._getListsRec(lists);
	}

	async getById(id) {
		const item = await db.listItems.findOne({ _id: new ObjectId(id) });
		return item && stringifyObjectIds(item, ["owner"]);
	}

	async getByConfigId(id) {
		const item = await db.listItems.findOne({ config: new ObjectId(id) });
		return item && stringifyObjectIds(item, ["owner"]);
	}

	async getParent(id) {
		const item = await db.listItems.findOne({ children: new ObjectId(id) });
		return item && stringifyObjectIds(item, ["owner"]);
	}

	async list(ids) {
		const lists = await db.listItems.find({ _id: { $in: ids } }).toArray();
		return lists.map((list) => stringifyObjectIds(list, ["owner"]));
	}

	async createEntry(data, userId) {
		await db.listItems.insertOne({
			_id: new ObjectId(),
			isEntry: true,
			children: [],
			name: data.name,
			config: new ObjectId(data.config),
			owner: new ObjectId(userId),
		});
	}

	async createListItem(parentId, data, userId) {
		const newId = new ObjectId();
		const isList = data.config;
		let updateData;
		if (isList) {
			updateData = {
				_id: newId,
				isEntry: false,
				children: [],
				name: data.name,
				config: new ObjectId(data.config),
				owner: new ObjectId(userId),
			};
		} else {
			updateData = {
				_id: newId,
				...data,
			};
		}
		await db.listItems.insertOne(updateData);
		await db.listItems.updateOne(
			{ _id: new ObjectId(parentId) },
			{ $push: { children: newId } },
		);
	}

	async update(id, body) {
		await db.listItems.updateOne({ _id: new ObjectId(id) }, { $set: body });
	}

	async linkToParent(id, parentId) {
		await db.listItems.updateOne(
			{ _id: new ObjectId(parentId) },
			{ $push: { children: new ObjectId(id) } },
		);
	}

	async unlinkFromParent(id) {
		const objId = new ObjectId(id);
		await db.listItems.updateOne(
			{ children: objId },
			{ $pull: { children: objId } },
		);
	}

	async delete({ id, children }) {
		const idsForDelete = [new ObjectId(id)];
		const queue = [...children];

		while (queue.length) {
			const id = queue.pop();
			const list = await db.listItems.findOne({ _id: id });
			// todo check for circular links ?
			idsForDelete.push(list._id);
			if (list.children) {
				queue.push(...list.children);
			}
		}
		await db.listItems.deleteMany({ _id: { $in: idsForDelete } });
	}
}

module.exports = new ListModel();
