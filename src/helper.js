const path = require("path");
const { ACTIONS } = require("./constants");

const sortByValue = (arr, key) =>
	arr.sort((x, y) => {
		if (x[key] < y[key]) return -1;
		if (x[key] > y[key]) return 1;
		return 0;
	});

const determineContentType = (url) => {
	const ext = path.extname(url);

	let contentType;
	switch (ext) {
		case ".css":
			contentType = "text/css";
			break;
		case ".js":
			contentType = "text/javascript";
			break;
		case ".ico":
			contentType = "image/x-icon";
			break;
		default:
			contentType = "text/html";
	}
	return contentType;
};

const prepareAuditData = (action, data) => {
	let res;
	// todo remove hardcoded values for create and delete
	switch (action) {
		case ACTIONS.CREATE:
			res = {
				name: data.name,
				before: "",
				after: `${data.name} ${data.capacity} - ${data.count}`,
			};
			break;
		case ACTIONS.RENAME:
			res = {
				name: data.updatedData.value.name,
				before: data.updatedData.value.name,
				after: data.body.name,
			};
			break;
		case ACTIONS.CHANGE_NUMBER:
			res = {
				name: data.updatedData.value.name,
				before: data.updatedData.value.count,
				after: data.body.count,
			};
			break;
		case ACTIONS.DELETE:
			res = {
				name: data.name,
				before: `${data.name} ${data.capacity} - ${data.count}`,
				after: "",
			};
			break;
	}
	res = {
		...res,
		id: data.id,
		listId: data.listId,
		action,
		date: new Date().toISOString(),
	};
	return res;
};
// eslint-disable-next-line no-unused-vars
const mapAudits = (list) => list.map(({ _id, ...data }) => data);

const getView = (schema, data) => {
	let result = "";
	let field = null;
	for (let l of schema) {
		if (field !== null && l !== "}") {
			field += l;
		} else {
			if (l === "{") {
				field = "";
			} else if (l === "}") {
				result += data[field];
				field = null;
			} else {
				result += l;
			}
		}
	}
	return result;
};

const getViewFields = (schema) => {
	let result = [];
	let field = null;
	for (let l of schema) {
		if (field !== null && l !== "}") {
			field += l;
		} else {
			if (l === "{") {
				field = "";
			} else if (l === "}") {
				result.push(field);
				field = null;
			} else {
				result += l;
			}
		}
	}
	return result;
};

module.exports = {
	determineContentType,
	sortByValue,
	prepareAuditData,
	mapAudits,
	getView,
	getViewFields,
};
