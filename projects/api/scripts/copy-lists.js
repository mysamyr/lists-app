require("../src/utils/dotenv").config();
const { ObjectId, MongoClient } = require("mongodb");
const { MONGODB_URI, MONGODB_DB_NAME } = process.env;

const client = new MongoClient(MONGODB_URI);
const connection = {};

const connect = async () => {
	await client.connect();
	const db = client.db(MONGODB_DB_NAME);
	const old_db = client.db("house");
	await db.dropDatabase();
	connection.configs = db.collection("configs");
	connection.listItems = db.collection("list-items");
	connection.fields = db.collection("fields");
	connection.oldLists = old_db.collection("lists");
	connection.close = () => client.close(true);
};

const generateTodoList = (todoList, configId) => {
	const items = todoList.data.map((i) => ({
		_id: new ObjectId(),
		name: i.name,
		completed: i.completed,
	}));
	const parent = {
		_id: new ObjectId(),
		name: "To-do",
		isEntry: true,
		children: items.map((i) => i._id),
		config: configId,
	};
	return [parent, ...items];
};
const generateRunesList = (runesList, configId) => {
	const items = runesList.data.map((i) => ({
		_id: new ObjectId(),
		name: i.name,
		lvl: i.lvl,
		count: i.count,
	}));
	const parent = {
		_id: new ObjectId(),
		name: "Runes",
		isEntry: true,
		children: items.map((i) => i._id),
		config: configId,
	};
	return [parent, ...items];
};
const generateJarsList = (jarsList, configId) => {
	const items = jarsList.data.map((i) => ({
		_id: new ObjectId(),
		name: i.name,
		capacity: i.capacity,
		count: i.count,
	}));
	const parent = {
		_id: new ObjectId(),
		name: "Банки",
		isEntry: true,
		children: items.map((i) => i._id),
		config: configId,
	};
	return [parent, ...items];
};
const generateProgrammesList = (programmesList, configId) => {
	const items = programmesList.data.map((i) => ({
		_id: new ObjectId(),
		name: i.name,
	}));
	const parent = {
		_id: new ObjectId(),
		name: "Програми на вінду",
		isEntry: true,
		children: items.map((i) => i._id),
		config: configId,
	};
	return [parent, ...items];
};

(async () => {
	await connect();

	const runesList = await connection.oldLists.findOne({ name: "Runes" });
	const jarsList = await connection.oldLists.findOne({ name: "Банки" });
	const todoList = await connection.oldLists.findOne({ name: "Список справ" });
	const programmesList = await connection.oldLists.findOne({
		name: "Програми на вінду",
	});

	const Fields = {
		name: {
			_id: new ObjectId(),
			name: "name",
			description: "Name",
			type: "str",
			min: 3,
			max: 30,
		},
		count: {
			_id: new ObjectId(),
			name: "count",
			description: "Count",
			type: "num",
			min: 0,
			max: 1000,
		},
		completed: {
			_id: new ObjectId(),
			name: "completed",
			description: "Completed",
			type: "bool",
		},
		lvl: {
			_id: new ObjectId(),
			name: "lvl",
			description: "Level",
			type: "num",
			min: 1,
			max: 33,
		},
		capacity: {
			_id: new ObjectId(),
			name: "count",
			description: "Банка",
			type: "num",
			min: 0.2,
			max: 3,
		},
	};
	const Configs = {
		name: {
			_id: new ObjectId(),
			name: "name",
			sort: "name",
			view: "{name}",
			fields: [Fields.name._id],
		},
		todo: {
			_id: new ObjectId(),
			name: "todo",
			sort: "name",
			view: "{name}",
			fields: [Fields.name._id, Fields.completed._id],
		},
		runes: {
			_id: new ObjectId(),
			name: "runes",
			sort: "lvl",
			view: "{name} Rune",
			fields: [Fields.name._id, Fields.count._id, Fields.lvl._id],
		},
		jars: {
			_id: new ObjectId(),
			name: "jars",
			sort: "name",
			view: "{name} {capacity}л.",
			fields: [Fields.name._id, Fields.capacity._id, Fields.count._id],
		},
	};

	const todo = generateTodoList(todoList, Configs.todo._id);
	const runes = generateRunesList(runesList, Configs.runes._id);
	const jars = generateJarsList(jarsList, Configs.jars._id);
	const programmes = generateProgrammesList(programmesList, Configs.name._id);

	await connection.fields.insertMany(Object.values(Fields));
	await connection.configs.insertMany(Object.values(Configs));
	await connection.listItems.insertMany([
		...todo,
		...runes,
		...jars,
		...programmes,
	]);

	await connection.close();
})();

process.on("SIGINT", async () => {
	await connection.close();
	process.exit(0);
});
