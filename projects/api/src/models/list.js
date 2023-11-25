const { ObjectId } = require("mongodb");
const db = require("../services/database");
const { stringifyObjectId } = require("../utils/helper");

class ListModel {
	async getEntryLists() {
		const lists = await db.listItems.find({ isEntry: true }).toArray();
		return lists.map(stringifyObjectId);
	}

	async getById(id) {
		const item = await db.listItems.findOne({ _id: new ObjectId(id) });
		return item && stringifyObjectId(item);
	}

	async getByConfigId(id) {
		const item = await db.listItems.findOne({ config: new ObjectId(id) });
		return item && stringifyObjectId(item);
	}

	async getParent(id) {
		const item = await db.listItems.findOne({ children: new ObjectId(id) });
		return item && stringifyObjectId(item);
	}

	async list(ids) {
		const lists = await db.listItems.find({ _id: { $in: ids } }).toArray();
		return lists.map(stringifyObjectId);
	}

	async createEntry(data) {
		await db.listItems.insertOne({
			_id: new ObjectId(),
			isEntry: true,
			children: [],
			name: data.name,
			config: new ObjectId(data.config),
		});
	}

	async createListItem(parentId, data) {
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
