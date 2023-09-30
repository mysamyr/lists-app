const { MONGODB_URI } = require("../config");
const { MongoClient, ObjectId } = require("mongodb");
const { validateCreateList } = require("../src/validators");

const client = new MongoClient(MONGODB_URI);

const name = "Test";
const fieldSchema = [
	{
		field: "name",
		description: "Назва",
		type: "string",
		min: 3,
		max: 30,
	},
	{
		field: "count",
		description: "Кількість",
		type: "number",
		min: 0,
		max: 999,
	},
];
const renderViewSchema = "{name}";

(async () => {
	await client.connect();
	const db = client.db("house");

	await validateCreateList({
		name,
		fields: fieldSchema,
		view: renderViewSchema,
	})(db);

	await db.collection("lists").insertOne({
		_id: new ObjectId(),
		name,
		fields: fieldSchema,
		data: [],
		created: new Date().toJSON(),
		view: renderViewSchema,
	});
})();
