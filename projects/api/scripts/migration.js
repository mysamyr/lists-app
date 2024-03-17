require("../src/utils/dotenv").config();
const { ObjectId, MongoClient } = require("mongodb");
const { MONGODB_URL, MONGODB_DB_NAME } = process.env;

const OLD_DB_NAME = "lister";

const client = new MongoClient(MONGODB_URL);

const connection = {};

const connect = async () => {
	await client.connect();
	const des_db = client.db(MONGODB_DB_NAME);
	await des_db.dropDatabase();
	connection.configs = des_db.collection("configs");
	connection.listItems = des_db.collection("list-items");
	connection.fields = des_db.collection("fields");
	connection.users = des_db.collection("users");
	connection.tokens = des_db.collection("tokens");
	if (OLD_DB_NAME) {
		const origin_db = client.db(OLD_DB_NAME);
		connection.old_configs = origin_db.collection("configs");
		connection.old_listItems = origin_db.collection("list-items");
		connection.old_fields = origin_db.collection("fields");
		connection.old_users = origin_db.collection("users");
	}
	connection.close = () => client.close(true);
};

const setupNewEnv = async () => {
	const Fields = [
		{
			_id: new ObjectId(),
			name: "name",
			description: "Name",
			type: "str",
			min: 3,
			max: 30,
		},
		{
			_id: new ObjectId(),
			name: "count",
			description: "Count",
			type: "num",
			min: 0,
			max: 1000,
		},
		{
			_id: new ObjectId(),
			name: "completed",
			description: "Completed",
			type: "bool",
		},
	];
	const Configs = [
		{
			_id: new ObjectId(),
			name: "name",
			sort: "name",
			view: "{name}",
			fields: [Fields[0]._id],
		},
		{
			_id: new ObjectId(),
			name: "todo",
			sort: "name",
			view: "{name}",
			fields: [Fields[0]._id, Fields[2]._id],
		},
		{
			_id: new ObjectId(),
			name: "counter",
			sort: "name",
			view: "{name}",
			fields: [Fields[0]._id, Fields[1]._id],
		},
	];

	await connection.fields.insertMany(Fields);
	await connection.configs.insertMany(Configs);

	await connection.users.insertOne({
		_id: new ObjectId(),
		email: "lubomirmisak@live.com",
		passwordHash:
			"$2b$10$Tb.iXOIIAi0dNi/WUgkOsOdHZId9.nDMWv3SfT/1EFGE2bvS6ZSHS",
		role: "a",
		activationLink: "",
	});
};
const migrateFrom = async () => {
	const Fields = await connection.old_fields.find({}).toArray();
	const Configs = await connection.old_configs.find({}).toArray();

	if (Fields.length) await connection.fields.insertMany(Fields);
	if (Configs.length) await connection.configs.insertMany(Configs);

	const Lists = await connection.old_listItems.find({}).toArray();
	const Users = await connection.old_users.find({}).toArray();

	if (Users.find((u) => u.email === "lubomirmisak@live.com")) {
		await connection.listItems.insertMany(Lists);
	} else {
		const adminUserId = new ObjectId();
		await connection.users.insertOne({
			_id: adminUserId,
			email: "lubomirmisak@live.com",
			passwordHash:
				"$2b$10$Tb.iXOIIAi0dNi/WUgkOsOdHZId9.nDMWv3SfT/1EFGE2bvS6ZSHS",
			role: "a",
			activationLink: "",
		});

		if (Lists.length) {
			await connection.listItems.insertMany(
				Lists.map((l) => ({
					...l,
					owner: l.owner || adminUserId,
				})),
			);
		}
	}
	if (Users.length) await connection.users.insertMany(Users);
};

(async () => {
	await connect();

	await connection.configs.createIndex({ name: 1 }, { unique: true });
	await connection.users.createIndex({ email: 1 }, { unique: true });
	await connection.tokens.createIndex(
		{ createdAt: 1 },
		{ expireAfterSeconds: 30 * 24 * 60 * 60 },
	);
	await connection.tokens.createIndex({ token: 1 }, { unique: true });

	if (OLD_DB_NAME) {
		await migrateFrom();
	} else {
		await setupNewEnv();
	}

	// eslint-disable-next-line no-console
	console.log("DONE!");
	await connection.close();
})();

process.on("SIGINT", async () => {
	await connection.close();
	process.exit(0);
});
