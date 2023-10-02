const { ObjectId } = require("mongodb");
const db = require("../src/database");
const { validateCreateList } = require("../src/validators");

// 1 - simple list, 2 - todo list, 3 - complex list
const type = 3;
const name = "Complex list";
const fieldSchema = [
	{
		name: "name",
		description: "Назва",
		type: "string",
		min: 3,
		max: 30,
	},
	{
		name: "weight",
		description: "Вага",
		type: "number",
		min: 0,
		max: 999,
	},
];
const renderViewSchema = "{name}";
const sort = {
	sort: "weight",
}; // empty for sorting by name

(async () => {
	await db.connect();

	if (type === 1) {
		await db.connection.lists.insertOne({
			_id: new ObjectId(),
			name,
			type,
			data: [],
			created: new Date().toJSON(),
		});
		return;
	}
	if (type === 2) {
		await db.connection.lists.insertOne({
			_id: new ObjectId(),
			name,
			type,
			data: [],
			created: new Date().toJSON(),
		});
		return;
	}

	await validateCreateList({
		name,
		fields: fieldSchema,
		view: renderViewSchema,
	})(db);

	await db.connection.lists.insertOne({
		_id: new ObjectId(),
		name,
		type,
		fields: fieldSchema,
		data: [],
		created: new Date().toJSON(),
		view: renderViewSchema,
		...sort,
	});

	return db.connection.close();
})();

process.on("SIGINT", async () => {
	await db.connection.close();
	process.exit(0);
});
