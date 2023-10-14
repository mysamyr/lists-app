const path = require("path");
const { ACTIONS } = require("./constants");

const getListItemString = (data) =>
	Object.entries(data).reduce((acc, [key, value]) => {
		if (key !== "id" && key !== "listId") {
			acc += `${key} - ${value};`;
		}
		return acc;
	}, "");

module.exports.sortByValue = (arr, key = "name") =>
	arr.sort((x, y) => {
		if (x[key] < y[key]) return -1;
		if (x[key] > y[key]) return 1;
		return 0;
	});

module.exports.determineContentType = (url) => {
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

module.exports.prepareAuditData = (action, data) => {
	let res;
	switch (action) {
		case ACTIONS.CREATE:
			res = {
				name: data.name,
				before: "",
				after: getListItemString(data),
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
		case ACTIONS.COMPLETE:
			res = {
				name: data.updatedData.value.name,
				before: data.updatedData.value.complete,
				after: data.body.complete,
			};
			break;
		case ACTIONS.DELETE:
			res = {
				name: data.name,
				before: getListItemString(data),
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
module.exports.mapAudits = (list) => list.map(({ _id, ...data }) => data);

module.exports.getView = (data, schema) => {
	if (!schema) return data.name;
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

module.exports.getViewFields = (schema) => {
	let result = [];
	let field = null;
	for (let l of schema) {
		if (field === null && l === "{") {
			field = "";
			continue;
		}
		if (field !== null) {
			if (l === "}") {
				result.push(field);
				field = null;
			} else {
				field += l;
			}
		}
	}
	return result;
};
