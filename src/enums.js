module.exports.ACTIONS = {
	CREATE: "create",
	RENAME: "rename",
	COMPLETE: "complete",
	CHANGE_NUMBER: "change_number",
	DELETE: "delete",
};

module.exports.METHOD = {
	GET: "GET",
	POST: "POST",
	PUT: "PUT",
	DELETE: "DELETE",
};

module.exports.STATUS = {
	OK: 200,
	CREATED: 201,
	NO_CONTENT: 204,
	BAD_REQUEST: 400,
	NOT_FOUND: 404,
};

module.exports.FIELDS = {
	ID: "id",
	FIELDS: "fields",
	NAME: "name",
	DESCRIPTION: "description",
	TYPE: "type",
	MIN: "min",
	MAX: "max",
	POSTFIX: "postfix",
	COMPLETE: "complete",
	COUNT: "count",
	VIEW: "view",
	PRINT_VIEW: "printView",
	SORT: "sort",
};

module.exports.FIELD_TYPES = {
	STRING: "string",
	NUMBER: "number",
	BOOLEAN: "boolean",
};

module.exports.LIST_TYPES = {
	SIMPLE: 1,
	TODO: 2,
	COMPLEX: 3,
};

module.exports.CONTENT_TYPE = {
	JSON: { "Content-Type": "application/json" },
	PLAIN: { "Content-Type": "text/html" },
};
