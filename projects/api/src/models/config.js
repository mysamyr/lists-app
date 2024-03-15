const { ObjectId } = require("mongodb");
const db = require("../services/database");
const { stringifyObjectId } = require("../utils/helper");

class ConfigModel {
	async getAll() {
		const configs = await db.configs.find({}).toArray();
		return configs.map(stringifyObjectId);
	}

	async getById(id) {
		const config = await db.configs.findOne({ _id: new ObjectId(id) });
		return stringifyObjectId(config);
	}

	async list(ids) {
		const configs = await db.configs.find({ _id: { $in: ids } }).toArray();
		return configs.map(stringifyObjectId);
	}

	async getByFieldId(id) {
		const config = await db.configs.findOne({
			fields: { $in: new ObjectId(id) },
		});
		return stringifyObjectId(config);
	}

	async create(data) {
		const newId = new ObjectId();
		await db.configs.insertOne({
			_id: newId,
			name: data.name,
			sort: data.sort,
			view: data.view,
			fields: data.fields.map((field) => new ObjectId(field)),
		});
	}

	async delete(id) {
		await db.configs.deleteOne({ _id: new ObjectId(id) });
	}
}

module.exports = new ConfigModel();
