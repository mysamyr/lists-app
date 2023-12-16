const { NAME_MIN_LENGTH, NAME_MAX_LENGTH } = require("./index");

module.exports = {
	INTERNAL_SERVER_ERROR: "Internal Server Error",

	// input validation
	NOT_VALID_ID: "Відісланий ідентифікатор неправильний",
	NOT_VALID_LIST_TYPE: "Неправильний тип списку",
	NOT_VALID_TYPE: "Неправильний тип поля елементу списку",
	NO_DATA: "Відсутні дані",
	INVALID_DATA: "Неправильні дані",
	NOT_VALID_NAME: `Назва має включати від ${NAME_MIN_LENGTH} до ${NAME_MAX_LENGTH} символів`,
	NOT_VALID_MESSAGE: `Елемент списку має включати від ${NAME_MIN_LENGTH} до ${NAME_MAX_LENGTH} символів`,
	NOT_VALID_MESSAGE_$: (description) => `Відсутнє поле ${description}`,
	NOT_VALID_STRING_$: ({ description, min, max }) =>
		`Поле ${description} має бути рядком і включати від ${min} до ${max} символів`,
	NOT_VALID_NUMBER_$: ({ description, min, max }) =>
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
	NO_ITEM: "Елемент не знайдено",
	NOT_A_LIST: "Елемент не є списком",
	NOT_UNIQUE_LIST_ITEM: "Елемент списку не унікальний",
	NOT_UNIQUE: "Список не унікальний",

	FIELD_EXISTS: "Поле з такою назвою вже існує",
	ELEMENT_IS_BEING_USED: "Елемент використовується",
};
