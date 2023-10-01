module.exports.ACTIONS = {
	CREATE: "create",
	RENAME: "rename",
	CHANGE_MESSAGE: "change_message",
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
	BAD_REQUEST: 400,
	NOT_FOUND: 404,
};

module.exports.ERROR_MESSAGES = {
	NOT_VALID_ID: "Відісланий ідентифікатор не валідний",
	UNKNOWN_TYPE: "Тип списку невідомий",
	NO_CREATION_DATA: "Відсутні дані для створення",
	NO_MESSAGE: "Відсутній вміст",
	NOT_VALID_MESSAGE: "Елемент списку має включати від 1 до 50 символів",
	NOT_VALID_TYPE: "Неправильний тип поля елементу списку",
	NOT_VALID_MESSAGE_: (description) => `Відсутнє поле ${description}`,
	NOT_VALID_STRING_: ({ description, min, max }) =>
		`Поле ${description} має бути рядком і включати від ${min} до ${max} символів`,
	NOT_VALID_NUMBER_: ({ description, min, max }) =>
		`Поле ${description} має бути числом від ${min} до ${max}`,
	NOT_UNIQUE: "Елемент списку не унікальний",
};
