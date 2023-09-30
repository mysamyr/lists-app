const { ObjectId, MongoClient } = require("mongodb");
const { MONGODB_URI } = require("../config");

const client = new MongoClient(MONGODB_URI);
const connection = {};

module.exports.connect = async () => {
	await client.connect();
	const db = client.db("house");
	connection.lists = db.collection("lists");
	connection.audits = db.collection("audits");
};

module.exports.getAll = async () => {
	const lists = await connection.lists.find().toArray();
	return lists.map(({ _id: id, ...rest }) => ({ id, ...rest }));
};

module.exports.getById = async (id) => {
	return await connection.lists.findOne({ _id: new ObjectId(id) });
};

module.exports.getListByName = async (name) => {
	return await connection.lists.findOne({ name });
};

module.exports.create = async (id, item) => {
	await connection.lists.updateOne(
		{ _id: new ObjectId(id) },
		{ $push: { data: item } },
	);
};

module.exports.updateName = async (id, itemId, data) => {
	return connection.lists.findOneAndUpdate(
		{ _id: new ObjectId(id) },
		{ $set: { "data.$[listItem].name": data } },
		{
			arrayFilters: [{ "listItem.id": new ObjectId(itemId) }],
		},
	);
};

module.exports.updateCount = async (id, itemId, data) => {
	return connection.lists.findOneAndUpdate(
		{ _id: new ObjectId(id) },
		{ $set: { "data.$[listItem].count": data } },
		{
			arrayFilters: [{ "listItem.id": new ObjectId(itemId) }],
		},
	);
};

module.exports.delete = async (id, itemId) => {
	return connection.lists.findOneAndUpdate(
		{ _id: new ObjectId(id) },
		{ $pull: { data: { id: new ObjectId(itemId) } } },
	);
};

module.exports.getHistory = async (id) => {
	return connection.audits.find({ listId: id }).toArray();
};

module.exports.createAudit = async (item) => {
	await connection.audits.insertOne(item);
};

module.exports.createList = async (data) => {
	await connection.lists.insertOne(data);
};
