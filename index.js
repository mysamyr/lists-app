const http = require("http");
const {
	attachBody,
	requestLogger,
	renderHome,
	renderCreateList,
	renderList,
	createList,
	renameList,
	deleteList,
	getDetails,
	getFields,
	createListItem,
	updateListItem,
	deleteListItem,
	print,
	audits,
	renderFile,
} = require("./src/controller");
const { connect } = require("./src/database");
const router = require("./src/router");
const { PORT } = require("./config");

const port = PORT || 3000;

const server = http.createServer(async (req, res) => {
	await attachBody(req);
	requestLogger(req);

	await router.createRouter([
		router.get("/", renderHome)(req),
		router.get("/list", renderCreateList)(req),
		router.get("/list/:id", renderList)(req),
		router.post("/list", createList)(req),
		router.put("/list/:id", renameList)(req),
		router.delete("/list/:id", deleteList)(req),
		router.get("/list/:listId/item/:id", getDetails)(req),
		router.get("/list/:id/fields", getFields)(req),
		router.post("/list/:id", createListItem)(req),
		router.put("/list/:listId/item/:id", updateListItem)(req),
		router.delete("/list/:listId/item/:id", deleteListItem)(req),
		router.get("/list/:id/print", print)(req),
		router.get("/audits/:id", audits)(req),
		router.get("/:file", renderFile)(req),
	])(req, res);
});

server.listen(port, async () => {
	await connect();
	// eslint-disable-next-line no-console
	console.log(`Server has been started on ${port}...`);
});
