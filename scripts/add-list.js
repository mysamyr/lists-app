const { ObjectId } = require("mongodb");
const db = require("../src/database");
const { validateCreateList } = require("../src/validators");

// 1 - simple list, 2 - todo list, 3 - complex list
const type = 3;
const name = "Test Jars";
const fieldSchema = [
	{
		name: "name",
		description: "Назва",
		type: "string",
		min: 3,
		max: 30,
	},
	{
		name: "capacity",
		description: "Банка",
		type: "number",
		min: 0.1,
		max: 3,
		postfix: " л.",
	},
	{
		name: "count",
		description: "Кількість",
		type: "number",
		min: 0,
		max: 99,
	},
];
const renderViewSchema = "{name} {capacity}л";
const printViewSchema = "{name} {capacity}л. - {count}шт.";
const sort = {}; // empty for sorting by name

(async () => {
	await db.connect();

	if (type === 1) {
		await db.createList({
			_id: new ObjectId(),
			name,
			type,
			data: [],
			created: new Date().toJSON(),
		});
		return;
	}
	if (type === 2) {
		await db.createList({
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
		type,
		fields: fieldSchema,
		view: renderViewSchema,
		printView: printViewSchema,
	});

	await db.createList({
		_id: new ObjectId(),
		name,
		type,
		fields: fieldSchema,
		data: [],
		created: new Date().toJSON(),
		view: renderViewSchema,
		printView: printViewSchema,
		...sort,
	});

	db.connection.close();
})();

process.on("SIGINT", async () => {
	await db.connection.close();
	process.exit(0);
});
