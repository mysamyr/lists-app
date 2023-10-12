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
	validateRenameList,
} = require("./validators");
const { ACTIONS, STATUS, ERROR_MESSAGES, LIST_TYPES } = require("./constants");
const {
	generateHome,
	generateCreateList,
	generatePrint,
	generate404,
	generateComplexList,
	generateSimpleList,
	generateTodoList,
} = require("./renderers");
const { CONTENT_TYPE } = require("./enums");

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
	console.log(
		JSON.stringify({
			method: req.method,
			url: req.url,
			...body,
		}),
	);
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
			res.writeHead(STATUS.NOT_FOUND, CONTENT_TYPE.PLAIN);
			return res.end(generate404());
		}
		throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
	}
};

module.exports.renderHome = async (req, res) => {
	const list = await db.getAll();
	const data = generateHome(list);
	res.writeHead(STATUS.OK, CONTENT_TYPE.PLAIN);
	return res.end(data);
};

module.exports.renderCreateList = async (req, res) => {
	res.writeHead(STATUS.OK, CONTENT_TYPE.PLAIN);
	return res.end(generateCreateList());
};

module.exports.renderList = async (req, res) => {
	const list = await db.getById(req.params.id);
	let data;
	switch (list.type) {
		case LIST_TYPES.SIMPLE:
			data = generateSimpleList(list);
			break;
		case LIST_TYPES.TODO:
			data = generateTodoList(list);
			break;
		case LIST_TYPES.COMPLEX:
			data = generateComplexList(list);
			break;
		default:
			throw new Error(ERROR_MESSAGES.UNKNOWN_TYPE);
	}
	res.writeHead(STATUS.OK, CONTENT_TYPE.PLAIN);
	return res.end(data);
};

module.exports.getDetails = async (req, res) => {
	const { listId, id } = req.params;
	if (!ObjectId.isValid(listId) || !ObjectId.isValid(id)) {
		throw new Error(ERROR_MESSAGES.NOT_VALID_ID);
	}

	const details = await db.getById(listId);
	const item = details.data.find((i) => i.id.toString() === id);
	res.writeHead(STATUS.OK, CONTENT_TYPE.JSON);
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
	res.writeHead(STATUS.OK, CONTENT_TYPE.JSON);
	return res.end(JSON.stringify(data.fields));
};

module.exports.createListItem = async (req, res) => {
	const id = req.params.id;
	if (!ObjectId.isValid(id)) {
		throw new Error(ERROR_MESSAGES.NOT_VALID_ID);
	}

	const item = req.body;
	const details = await db.getById(id);
	validateCreateItem(item, details);

	const newId = new ObjectId();
	await db.createListItem(id, { id: newId, ...item });
	await db.createAudit(
		prepareAuditData(ACTIONS.CREATE, { ...item, id: newId, listId: id }),
	);
	res.writeHead(STATUS.CREATED);
	return res.end();
};

module.exports.updateListItem = async (req, res) => {
	const { listId, id } = req.params;
	if (!ObjectId.isValid(listId) || !ObjectId.isValid(id)) {
		throw new Error(ERROR_MESSAGES.NOT_VALID_ID);
	}

	const body = req.body;
	const details = await db.getById(listId);
	const action = validateUpdateItem(body, details);
	let updatedData = await db.updateListItemData(listId, id, body);
	await db.createAudit(
		prepareAuditData(action, { id, listId, body, updatedData }),
	);
	res.writeHead(STATUS.OK, CONTENT_TYPE.JSON);
	return res.end();
};

module.exports.deleteListItem = async (req, res) => {
	const { listId, id } = req.params;
	if (!ObjectId.isValid(listId) || !ObjectId.isValid(id)) {
		throw new Error(ERROR_MESSAGES.NOT_VALID_ID);
	}

	const deletedData = await db.deleteListItem(listId, id);
	await db.createAudit(
		prepareAuditData(ACTIONS.DELETE, { id, listId, ...deletedData.value }),
	);
	res.writeHead(STATUS.NO_CONTENT);
	return res.end();
};

module.exports.print = async (req, res) => {
	const id = req.params.id;
	if (!ObjectId.isValid(id)) {
		throw new Error(ERROR_MESSAGES.NOT_VALID_ID);
	}

	const list = await db.getById(id);
	res.writeHead(STATUS.OK, CONTENT_TYPE.PLAIN);
	return res.end(generatePrint(list));
};

module.exports.audits = async (req, res) => {
	const id = req.params.id;
	if (!ObjectId.isValid(id)) {
		throw new Error(ERROR_MESSAGES.NOT_VALID_ID);
	}

	const audits = await db.getHistory(id);
	res.writeHead(STATUS.OK, CONTENT_TYPE.JSON);
	return res.end(JSON.stringify(mapAudits(audits)));
};

module.exports.createList = async (req, res) => {
	const item = req.body;
	await validateCreateList(item)(db);
	await db.createList({
		_id: new ObjectId(),
		data: [],
		created: new Date().toJSON(),
		...item,
	});
	res.writeHead(STATUS.CREATED);
	return res.end();
};

module.exports.renameList = async (req, res) => {
	const id = req.params.id;
	if (!ObjectId.isValid(id)) {
		throw new Error(ERROR_MESSAGES.NOT_VALID_ID);
	}

	await validateRenameList(req.body)(db);
	await db.renameList(id, req.body.name);
	res.writeHead(STATUS.OK);
	return res.end();
};

module.exports.deleteList = async (req, res) => {
	const id = req.params.id;
	if (!ObjectId.isValid(id)) {
		throw new Error(ERROR_MESSAGES.NOT_VALID_ID);
	}

	await db.deleteList(id);
	res.writeHead(STATUS.NO_CONTENT);
	return res.end();
};
