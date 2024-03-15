const { MongoClient } = require("mongodb");
const { MONGODB_URI, MONGODB_DB_NAME } = process.env;

class Client {
	async connect() {
		const client = new MongoClient(MONGODB_URI);
		await client.connect();
		const db = client.db(MONGODB_DB_NAME);
		this.configs = db.collection("configs");
		this.listItems = db.collection("list-items");
		this.fields = db.collection("fields");
		return client;
	}
}

module.exports = new Client();
