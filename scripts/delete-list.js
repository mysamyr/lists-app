const { ObjectId } = require("mongodb");
const db = require("../src/database");

const listId = "";

(async () => {
	await db.connect();

	await db.connection.lists.deleteOne({ _id: new ObjectId(listId) });

	return db.connection.close();
})();

process.on("SIGINT", async () => {
	await db.connection.close();
	process.exit(0);
});
