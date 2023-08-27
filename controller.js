const path = require("path");
const fs = require("fs");
const {ObjectId} = require("mongodb");
const Jars = require("./database");
const {generateList, determineContentType, sortByValue, prepareAuditData, mapAudits} = require("./helper");
const {validateCreateItem, validateUpdateItem} = require("./validators");
const {ACTIONS, METHOD, STATUS} = require("./constants");

const getBody = async (request) => {
  return await new Promise((resolve, reject) => {
    const chunks = [];

    request.on("data", (chunk) => {
      chunks.push(chunk);
    });

    request.on("end", () => {
      const buf = Buffer.concat(chunks).toString();
      resolve(buf);
    });

    request.on("error", (error) => {
      reject(error);
    });
  });
};

module.exports.requestLogger = (req) => {
  const body = req.body ? {body: req.body} : {};
  console.log({
    method: req.method,
    url: req.url,
    ...body
  });
};

module.exports.renderHome = (req, res) => {
  if (req.method === METHOD.GET && req.url === "/") {
    try {
      const data = fs.readFileSync(path.join(__dirname, "public", "index.html"));
      res.writeHead(STATUS.OK, {"Content-Type": "text/html"});
      return res.end(data);
    } catch (e) {
      throw new Error("Internal Server Error");
    }
  }
};

module.exports.renderFile = ({url}, res) => {
  const filePath = path.join(__dirname, "public", url);
  const contentType = determineContentType(url);

  try {
    const data = fs.readFileSync(filePath);
    res.writeHead(STATUS.OK, {"Content-Type": contentType});
    return res.end(data);
  } catch (err) {
    if (err.code === 'ENOENT') {
      const notFoundFile = fs.readFileSync(path.join(__dirname, "public", "404.html"));
      res.writeHead(STATUS.NOT_FOUND, {"Content-Type": "text/html"});
      return res.end(notFoundFile);
    }
    throw new Error("Internal Server Error");
  }
};

module.exports.attachBody = async (request) => {
  const body = await getBody(request);
  if (body) {
    request.body = JSON.parse(body);
  }
};

module.exports.getList = async (req, res) => {
  if (req.method === METHOD.GET && req.url === "/jars") {
    const list = await Jars.getAll();
    res.writeHead(STATUS.OK, {"Content-Type": "text/html"});
    return res.end(JSON.stringify({
      list: sortByValue(list, "name")
    }));
  }
};

module.exports.getDetails = async (req, res) => {
  const id = req.url.split("/")[1];
  const isId = ObjectId.isValid(id);

  if (req.method === METHOD.GET && isId) {
    const item = await Jars.getById(id);
    res.writeHead(STATUS.OK, {"Content-Type": "application/json"});

    return res.end(JSON.stringify({...item, id: item._id}));
  }
};

module.exports.create = async (req, res) => {
  if (req.method === METHOD.POST) {
    const item = req.body;
    validateCreateItem(item);

    const id = await Jars.create(item);
    await Jars.createAudit(prepareAuditData(ACTIONS.CREATE, {...item, id}));
    res.writeHead(STATUS.OK);
    return res.end();
  }
};

module.exports.update = async (req, res) => {
  const id = req.url.split("/")[1];
  const isId = ObjectId.isValid(id);

  if (req.method === METHOD.PUT && isId) {
    const body = req.body;
    const action = validateUpdateItem(body);

    const updatedData = await Jars.update(id, body);
    await Jars.createAudit(prepareAuditData(action, {id, body, updatedData}));
    res.writeHead(STATUS.OK, {"Content-Type": "application/json"});
    return res.end();
  }
};

module.exports.delete = async (req, res) => {
  const id = req.url.split("/")[1];
  const isId = ObjectId.isValid(id);

  if (req.method === METHOD.DELETE && isId) {
    const deletedData = await Jars.delete(id);
    await Jars.createAudit(prepareAuditData(ACTIONS.DELETE, {id, ...deletedData.value}));
    res.writeHead(STATUS.OK);
    return res.end();
  }
};

module.exports.print = async (req, res) => {
  if (req.method === METHOD.GET && req.url === "/print") {
    const list = await Jars.getAll();
    res.writeHead(STATUS.OK, {"Content-Type": "text/html"});
    return res.end(generateList(list));
  }
};

module.exports.audits = async (req, res) => {
  if (req.method === METHOD.GET && req.url === "/audits") {
    const audits = await Jars.getHistory();
    res.writeHead(STATUS.OK, {"Content-Type": "application/json"});
    return res.end(JSON.stringify(mapAudits(audits)));
  }
};
