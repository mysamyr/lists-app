module.exports = {
	INTERNAL_SERVER_ERROR: "Internal Server Error",

	// input validation
	NOT_VALID_NAME: "Incorrect name",
	NOT_UNIQUE: "Item is not unique",
	NO_DATA: "No data",
	NOT_EXISTING_CONFIG: "Config doesn't exist",
	NOT_VALID_TYPE: "Invalid fields type",
	COUNT_DIDNT_CHANGE: "Count wasn't change",
	NOT_VALID_STRING_$: ({ description, min, max }) =>
		`Field ${description} should be a string and contain from ${min} to ${max} characters`,
	NOT_VALID_NUMBER_$: ({ description, min, max }) =>
		`Field ${description} should be a number from ${min} to ${max}`,
	INCORRECT_FIELD_$: (field) => `Field ${field} is incorrect`,
	NOT_EXISTING_FIELD_$: (description) => `Field ${description} doesn't exist`,

	TOO_MANY_FIELDS: "Схема відображення включає неіснуючі поля",
	NO_PRINT_VIEW:
		"Відсутня схема відображення компактного списку (printView: string)",
	NO_FIELDS: "Відсутня схема полів списку (fields: object[])",
	NO_SORT: "Неправильне поле для сортування",

	// bad request
	NO_ITEM: "Element doesn't exist",
	NOT_A_LIST: "Element is not a list",
	NOT_UNIQUE_LIST_ITEM: "Element is not unique",
	SAME_DESTINATION: "Destination list has not changed",
	SAME_ITEM: "Destination list and current list cannot match",

	FIELD_EXISTS: "Поле з такою назвою вже існує",
	ELEMENT_IS_BEING_USED: "Елемент використовується",
	RENAME_LIST: "List with this name already exists",
};
