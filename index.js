const http = require("http");
const { attachBody, requestLogger, renderHome, renderList, getDetails, getFields, create, update, remove, print, audits, test, renderFile} = require("./src/controller");
const {connect} = require("./src/database");
const router = require("./src/router");

const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
  await attachBody(req);
  requestLogger(req);

  // todo fields name and count have to be in every collection!
  // todo add placeholder to field configuration

  await router.createRouter([
    router.get("/", renderHome)(req),
    router.get("/list/:id", renderList)(req),
    router.get("/list/:listId/item/:id", getDetails)(req),
    router.get("/list/:id/fields", getFields)(req),
    router.post("/list/:id", create)(req),
    router.put("/list/:listId/item/:id", update)(req),
    router.delete("/list/:listId/item/:id", remove)(req),
    router.get("/list/:id/print", print)(req),
    router.get("/audits/:id", audits)(req),
    router.get("/test", test)(req),
    router.get("/:file", renderFile)(req),
  ])(req, res);
});

server.listen(PORT, async () => {
  await connect();
  console.log(`Server has been started on ${PORT}...`);
});
