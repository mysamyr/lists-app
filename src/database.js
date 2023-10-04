const { ObjectId, MongoClient } = require("mongodb");
const { MONGODB_URI, MONGODB_DB_NAME } = require("../config");

const client = new MongoClient(MONGODB_URI);
const connection = (module.exports.connection = {});

module.exports.connect = async () => {
	await client.connect();
	const db = client.db(MONGODB_DB_NAME);
	connection.lists = db.collection("lists");
	connection.audits = db.collection("audits");
	connection.close = () => client.close(true);
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

module.exports.createListItem = async (id, item) => {
	await connection.lists.updateOne(
		{ _id: new ObjectId(id) },
		{ $push: { data: item } },
	);
};

module.exports.updateListItemData = async (id, itemId, data) => {
	const updateData = Object.entries(data).reduce((acc, [key, value]) => {
		acc[`data.$[listItem].${key}`] = value;
		return acc;
	}, {});
	return connection.lists.findOneAndUpdate(
		{ _id: new ObjectId(id) },
		{ $set: updateData },
		{
			arrayFilters: [{ "listItem.id": new ObjectId(itemId) }],
		},
	);
};

module.exports.deleteListItem = async (id, itemId) => {
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

module.exports.renameList = async (id, name) => {
	await connection.lists.findOneAndUpdate(
		{ _id: new ObjectId(id) },
		{ $set: { name } },
	);
};

module.exports.deleteList = async (id) => {
	await connection.lists.findOneAndDelete({ _id: new ObjectId(id) });
};
