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
const { ERROR_MESSAGES } = require("./constants");
const { CONTENT_TYPE, STATUS, ACTIONS } = require("./enums");
const {
	renderHome,
	renderList,
	renderCreateList,
	generatePrint,
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
	res.writeHead(STATUS.OK, CONTENT_TYPE.PLAIN);
	return res.end(renderHome());
};

module.exports.renderCreateList = async (req, res) => {
	res.writeHead(STATUS.OK, CONTENT_TYPE.PLAIN);
	return res.end(renderCreateList());
};

module.exports.renderList = async (req, res) => {
	const id = req.params.id;
	if (!ObjectId.isValid(id)) {
		throw new Error(ERROR_MESSAGES.NOT_VALID_ID);
	}
	const details = await db.getById(id);
	if (!details) {
		throw new Error(ERROR_MESSAGES.NO_LIST_ITEM);
	}
	res.writeHead(STATUS.OK, CONTENT_TYPE.PLAIN);
	return res.end(renderList(details.name));
};

module.exports.print = async (req, res) => {
	const id = req.params.id;
	if (!ObjectId.isValid(id)) {
		throw new Error(ERROR_MESSAGES.NOT_VALID_ID);
	}

	const details = await db.getById(id);
	if (!details) {
		throw new Error(ERROR_MESSAGES.NO_LIST_ITEM);
	}
	res.writeHead(STATUS.OK, CONTENT_TYPE.PLAIN);
	return res.end(generatePrint(details));
};

module.exports.getLists = async (req, res) => {
	const list = await db.getAll();
	res.writeHead(STATUS.OK, CONTENT_TYPE.JSON);
	return res.end(
		JSON.stringify(list.map((i) => ({ id: i.id.toString(), name: i.name }))),
	);
};

module.exports.createList = async (req, res) => {
	const item = req.body;
	await validateCreateList(item);
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

	await validateRenameList(req.body);
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

module.exports.getDetails = async (req, res) => {
	const id = req.params.id;
	if (!ObjectId.isValid(id)) {
		throw new Error(ERROR_MESSAGES.NOT_VALID_ID);
	}

	const details = await db.getById(id);
	if (!details) {
		throw new Error(ERROR_MESSAGES.NO_LIST_ITEM);
	}
	res.writeHead(STATUS.OK, CONTENT_TYPE.JSON);
	return res.end(
		JSON.stringify({
			name: details.name,
			type: details.type,
			data: details.data,
			view: details.view,
			printView: details.printView,
			fields: details.fields,
			sort: details.sort,
		}),
	);
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
	const body = req.body;
	if (!ObjectId.isValid(listId) || !ObjectId.isValid(id)) {
		throw new Error(ERROR_MESSAGES.NOT_VALID_ID);
	}

	const details = await db.getById(listId);
	if (!details) {
		throw new Error(ERROR_MESSAGES.NO_LIST_ITEM);
	}
	const action = await validateUpdateItem(body, details, id);
	const updatedItem = details.data.find((i) => i.id.toString() === id);
	await db.updateListItemData(listId, id, body);
	await db.createAudit(
		prepareAuditData(action, { id, listId, body, updatedItem }),
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

module.exports.audits = async (req, res) => {
	const id = req.params.id;
	if (!ObjectId.isValid(id)) {
		throw new Error(ERROR_MESSAGES.NOT_VALID_ID);
	}

	const audits = await db.getHistory(id);
	res.writeHead(STATUS.OK, CONTENT_TYPE.JSON);
	return res.end(JSON.stringify(mapAudits(audits)));
};
