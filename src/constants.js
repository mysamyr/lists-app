module.exports.NAME_MIN_LENGTH = 3;
module.exports.NAME_MAX_LENGTH = 50;

module.exports.ERROR_MESSAGES = {
	INTERNAL_SERVER_ERROR: "Internal Server Error",

	// input validation
	NOT_VALID_ID: "Відісланий ідентифікатор неправильний",
	NOT_VALID_LIST_TYPE: "Неправильний тип списку",
	NOT_VALID_TYPE: "Неправильний тип поля елементу списку",
	NO_DATA: "Відсутні дані",
	INVALID_DATA: "Неправильні дані",
	NOT_VALID_NAME: `Назва має включати від ${module.exports.NAME_MIN_LENGTH} до ${module.exports.NAME_MAX_LENGTH} символів`,
	NOT_VALID_MESSAGE: `Елемент списку має включати від ${module.exports.NAME_MIN_LENGTH} до ${module.exports.NAME_MAX_LENGTH} символів`,
	NOT_VALID_MESSAGE_: (description) => `Відсутнє поле ${description}`,
	NOT_VALID_STRING_: ({ description, min, max }) =>
		`Поле ${description} має бути рядком і включати від ${min} до ${max} символів`,
	NOT_VALID_NUMBER_: ({ description, min, max }) =>
		`Поле ${description} має бути числом від ${min} до ${max}`,
	COUNT_DIDNT_CHANGE: "Кількість не змінилася",
	NEGATIVE_COUNT: "Кількість не може бути від'ємна",
	TOO_MANY_FIELDS: "Схема відображення включає неіснуючі поля",
	NO_VIEW: "Відсутня схема відображення елементів списку (view: string)",
	NO_PRINT_VIEW:
		"Відсутня схема відображення компактного списку (printView: string)",
	NO_FIELDS: "Відсутня схема полів списку (fields: object[])",
	NO_SORT: "Неправильне поле для сортування",

	// bad request
	NO_LIST_ITEM: "Елемент списку не знайдено",
	NOT_UNIQUE_LIST_ITEM: "Елемент списку не унікальний",
	NOT_UNIQUE: "Список не унікальний",
};
