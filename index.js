require("./src/dotenv").config();
const http = require("http");
const {
	attachBody,
	requestLogger,
	renderHome,
	renderCreateList,
	renderList,
	print,
	getLists,
	createList,
	renameList,
	deleteList,
	getDetails,
	createListItem,
	updateListItem,
	deleteListItem,
	audits,
} = require("./src/controller");
const { connect } = require("./src/database");
const router = require("./src/router");

const port = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
	await attachBody(req);
	requestLogger(req);

	await router.createRouter([
		router.get("/", renderHome)(req),
		router.get("/create-list-page", renderCreateList)(req),
		router.get("/list-page/:id", renderList)(req),
		router.get("/print-list/:id", print)(req),

		router.get("/list", getLists)(req),
		router.post("/list", createList)(req),
		router.put("/list/:id", renameList)(req),
		router.delete("/list/:id", deleteList)(req),

		router.get("/list/:id", getDetails)(req),
		router.post("/list/:id", createListItem)(req),
		router.put("/list/:listId/item/:id", updateListItem)(req),
		router.delete("/list/:listId/item/:id", deleteListItem)(req),

		router.get("/audits/:id", audits)(req),
	])(req, res);
});

server.listen(port, async () => {
	await connect();
	// eslint-disable-next-line no-console
	console.log(`Server has been started on ${port}...`);
});
