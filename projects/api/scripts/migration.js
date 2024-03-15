require("../src/utils/dotenv").config();
const { ObjectId, MongoClient } = require("mongodb");
const { MONGODB_URI, MONGODB_DB_NAME } = process.env;

const client = new MongoClient(MONGODB_URI);
const connection = {};

const connect = async () => {
	await client.connect();
	const db = client.db(MONGODB_DB_NAME);
	await db.dropDatabase();
	connection.configs = db.collection("configs");
	connection.listItems = db.collection("list-items");
	connection.fields = db.collection("fields");
	connection.close = () => client.close(true);
};

(async () => {
	await connect();

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
		counter: {
			_id: new ObjectId(),
			name: "counter",
			sort: "name",
			view: "{name}",
			fields: [Fields.name._id, Fields.count._id],
		},
	};

	await connection.fields.insertMany(Object.values(Fields));
	await connection.configs.insertMany(Object.values(Configs));

	await connection.close();
})();

process.on("SIGINT", async () => {
	await connection.close();
	process.exit(0);
});
