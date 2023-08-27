const http = require("http");
const controller = require("./controller");
const {connect} = require("./database");
const {createRouter} = require("./router");

const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
  await controller.attachBody(req);
  controller.requestLogger(req);

  await createRouter([
    controller.renderHome,
    controller.getList,
    controller.getDetails,
    controller.create,
    controller.update,
    controller.delete,
    controller.print,
    controller.audits,
    controller.renderFile,
  ])(req, res);
});

server.listen(PORT, async () => {
  await connect();
  console.log(`Server has been started on ${PORT}...`);
});
