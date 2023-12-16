module.exports.ACTIONS = {
	CREATE: "create",
	RENAME: "rename",
	COMPLETE: "complete",
	CHANGE_NUMBER: "change_number",
	DELETE: "delete",
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
