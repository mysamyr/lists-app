module.exports.NAME_MIN_LENGTH = 3;
module.exports.NAME_MAX_LENGTH = 50;

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

module.exports.ERROR_MESSAGES = {
	INTERNAL_SERVER_ERROR: "Internal Server Error",
	NOT_VALID_ID: "Відісланий ідентифікатор неправильний",
	UNKNOWN_TYPE: "Тип списку невідомий",
	NO_LIST_ITEM: "Відсутній елемент списку",
	NO_CREATION_DATA: "Відсутні дані для створення",
	NO_MESSAGE: "Відсутній вміст",
	NOT_VALID_MESSAGE: `Елемент списку має включати від ${module.exports.NAME_MIN_LENGTH} до ${module.exports.NAME_MAX_LENGTH} символів`,
	NOT_VALID_TYPE: "Неправильний тип поля елементу списку",
	NOT_VALID_MESSAGE_: (description) => `Відсутнє поле ${description}`,
	NOT_VALID_STRING_: ({ description, min, max }) =>
		`Поле ${description} має бути рядком і включати від ${min} до ${max} символів`,
	NOT_VALID_NUMBER_: ({ description, min, max }) =>
		`Поле ${description} має бути числом від ${min} до ${max}`,
	NOT_UNIQUE: "Елемент списку не унікальний",
};
