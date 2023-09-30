const path = require("path");
const fs = require("fs");
const { ObjectId } = require("mongodb");
const db = require("./database");
const {
	determineContentType,
	prepareAuditData,
	mapAudits,
} = require("./helper");
const {
	validateCreateItem,
	validateUpdateItem,
	validateCreateList,
} = require("./validators");
const { ACTIONS, STATUS, ERROR_MESSAGES } = require("./constants");
const {
	generateHome,
	generatePrint,
	generateList,
	generate404,
} = require("./renderers");

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
	const body = req.body ? { body: req.body } : {};
	// eslint-disable-next-line no-console
	console.log({
		method: req.method,
		url: req.url,
		...body,
	});
};

module.exports.attachBody = async (request) => {
	const body = await getBody(request);
	if (body) {
		request.body = JSON.parse(body);
	}
};

module.exports.renderFile = (req, res) => {
	const filePath = path.join(__dirname, "..", "public", req.url);
	const contentType = determineContentType(req.url);

	try {
		const data = fs.readFileSync(filePath);
		res.writeHead(STATUS.OK, { "Content-Type": contentType });
		return res.end(data);
	} catch (err) {
		if (err.code === "ENOENT") {
			res.writeHead(STATUS.NOT_FOUND, { "Content-Type": "text/html" });
			return res.end(generate404());
		}
		throw new Error("Internal Server Error");
	}
};

module.exports.renderHome = async (req, res) => {
	const list = await db.getAll();
	const data = generateHome(list);
	res.writeHead(STATUS.OK, { "Content-Type": "text/html" });
	return res.end(data);
};

module.exports.renderList = async (req, res) => {
	const list = await db.getById(req.params.id);
	const data = generateList(list);
	res.writeHead(STATUS.OK, { "Content-Type": "text/html" });
	return res.end(data);
};

module.exports.getDetails = async (req, res) => {
	const { listId, id } = req.params;
	if (!ObjectId.isValid(listId) || !ObjectId.isValid(id)) {
		throw new Error(ERROR_MESSAGES.NOT_VALID_ID);
	}

	const details = await db.getById(listId);
	const item = details.data.find((i) => i.id.toString() === id);
	res.writeHead(STATUS.OK, { "Content-Type": "application/json" });
	return res.end(
		JSON.stringify({
			item,
			fields: details.fields,
		}),
	);
};

module.exports.getFields = async (req, res) => {
	const { id } = req.params;
	if (!ObjectId.isValid(id)) {
		throw new Error(ERROR_MESSAGES.NOT_VALID_ID);
	}

	const data = await db.getById(id);
	res.writeHead(STATUS.OK, { "Content-Type": "application/json" });
	return res.end(JSON.stringify(data.fields));
};

module.exports.create = async (req, res) => {
	const id = req.params.id;
	if (!ObjectId.isValid(id)) {
		throw new Error(ERROR_MESSAGES.NOT_VALID_ID);
	}

	const item = req.body;
	const details = await db.getById(id);
	await validateCreateItem(item, details.fields);

	const newId = new ObjectId();
	await db.create(id, { id: newId, ...item });
	await db.createAudit(
		prepareAuditData(ACTIONS.CREATE, { ...item, id: newId, listId: id }),
	);
	res.writeHead(STATUS.OK);
	return res.end();
};

module.exports.update = async (req, res) => {
	const { listId, id } = req.params;
	if (!ObjectId.isValid(listId) || !ObjectId.isValid(id)) {
		throw new Error(ERROR_MESSAGES.NOT_VALID_ID);
	}

	const body = req.body;
	const action = validateUpdateItem(body);
	let updatedData;
	if (action === ACTIONS.RENAME) {
		updatedData = await db.updateName(listId, id, body.name);
	} else if (action === ACTIONS.CHANGE_NUMBER) {
		updatedData = await db.updateCount(listId, id, body.count);
	}
	await db.createAudit(
		prepareAuditData(action, { id, listId, body, updatedData }),
	);
	res.writeHead(STATUS.OK, { "Content-Type": "application/json" });
	return res.end();
};

module.exports.remove = async (req, res) => {
	const { listId, id } = req.params;
	if (!ObjectId.isValid(listId) || !ObjectId.isValid(id)) {
		throw new Error(ERROR_MESSAGES.NOT_VALID_ID);
	}

	const deletedData = await db.delete(listId, id);
	await db.createAudit(
		prepareAuditData(ACTIONS.DELETE, { id, listId, ...deletedData.value }),
	);
	res.writeHead(STATUS.OK);
	return res.end();
};

module.exports.print = async (req, res) => {
	const id = req.params.id;
	if (!ObjectId.isValid(id)) {
		throw new Error(ERROR_MESSAGES.NOT_VALID_ID);
	}

	const list = await db.getById(id);
	res.writeHead(STATUS.OK, { "Content-Type": "text/html" });
	return res.end(generatePrint(list));
};

module.exports.audits = async (req, res) => {
	const id = req.params.id;
	if (!ObjectId.isValid(id)) {
		throw new Error(ERROR_MESSAGES.NOT_VALID_ID);
	}

	const audits = await db.getHistory(id);
	res.writeHead(STATUS.OK, { "Content-Type": "application/json" });
	return res.end(JSON.stringify(mapAudits(audits)));
};

module.exports.createList = async (req, res) => {
	const item = req.body;
	await validateCreateList(item)(db);
	await db.createList({
		_id: new ObjectId(),
		name: item.name,
		view: item.view,
		fields: item.fields,
		data: [],
		created: new Date().toJSON(),
	});
	res.writeHead(STATUS.OK);
	return res.end();
};
