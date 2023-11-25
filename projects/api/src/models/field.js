const { ObjectId } = require("mongodb");
const db = require("../services/database");
const { stringifyObjectId } = require("../utils/helper");

class FieldModel {
	async getAll() {
		const fields = await db.fields.find({}).toArray();
		return fields.map(stringifyObjectId);
	}

	async getById(id) {
		const item = await db.fields.findOne({ _id: new ObjectId(id) });
		return stringifyObjectId(item);
	}

	async getByName(name) {
		const item = await db.fields.findOne({ name });
		return stringifyObjectId(item);
	}

	async list(ids) {
		const configs = await db.fields.find({ _id: { $in: ids } }).toArray();
		return configs.map(stringifyObjectId);
	}

	async create(data) {
		const newId = new ObjectId();
		await db.fields.insertOne({
			_id: newId,
			...data,
		});
	}

	async delete(id) {
		await db.fields.deleteOne({ _id: new ObjectId(id) });
	}
}

module.exports = new FieldModel();
