const { ACTIONS, ERROR_MESSAGES } = require("./constants");
const { getViewFields } = require("./helper");

const validateFields = (fields) => {
	const checkedSet = new Set();
	for (let field of fields) {
		if (
			!field.hasOwnProperty("name") ||
			typeof field.name !== "string" ||
			!field.name.length
		) {
			throw new Error("Поле в схемі має містити поле name: string");
		}
		if (
			!field.hasOwnProperty("description") ||
			typeof field.description !== "string" ||
			!field.description.length
		) {
			throw new Error(
				"Поле в схемі має містити поле description: string (Опис)",
			);
		}
		if (
			!field.hasOwnProperty("type") ||
			typeof field.type !== "string" ||
			!field.type.length
		) {
			throw new Error("Поле в схемі має містити поле type: string (Тип поля)");
		}
		if (field.type !== "string" && field.type !== "number") {
			throw new Error(ERROR_MESSAGES.NOT_VALID_TYPE);
		}
		if (
			!field.hasOwnProperty("min") ||
			typeof field.min !== "number" ||
			!field.hasOwnProperty("max") ||
			typeof field.max !== "number"
		) {
			throw new Error(
				"Поле в схемі має містити обмеження (min: number & max: number)",
			);
		}
		if (
			field.hasOwnProperty("postfix") &&
			typeof field.postfix !== "string" &&
			!field.postfix.length
		) {
			throw new Error(
				"Схема полів включає неправильний постфікс (postfix: string)",
			);
		}
		if (checkedSet.has(field.name)) {
			throw new Error("Схема полів включає дублікати");
		}

		checkedSet.add(field.name);
	}
};

const isViewValid = (schema, fields) => {
	const schemaItems = getViewFields(schema);
	for (let field of schemaItems) {
		if (!fields.find((i) => i.name === field)) return false;
	}
	return true;
};

module.exports.validateCreateItem = (
	body,
	{ type: listType, fields, data },
) => {
	if (!body) {
		throw new Error(ERROR_MESSAGES.NO_CREATION_DATA);
	}
	if (listType === 1 || listType === 2) {
		if (!body.hasOwnProperty("message")) {
			throw new Error(ERROR_MESSAGES.NO_MESSAGE);
		}
		if (listType === 2 && !body.hasOwnProperty("complete")) {
			throw new Error(ERROR_MESSAGES.NO_CREATION_DATA);
		}
		const value = body.message;
		if (typeof value !== "string" || value.length < 1 || value.length > 50) {
			throw new Error(ERROR_MESSAGES.NOT_VALID_MESSAGE);
		}
		if (data.find((i) => i.message === value)) {
			throw new Error(ERROR_MESSAGES.NOT_UNIQUE);
		}
		return;
	}
	fields.forEach(({ name, description, type, min, max }) => {
		if (!body.hasOwnProperty(name)) {
			throw new Error(ERROR_MESSAGES.NOT_VALID_MESSAGE_(description));
		}
		const value = body[name];
		switch (type) {
			case "string":
				if (
					typeof value !== "string" ||
					value.length < min ||
					value.length > max
				) {
					throw new Error(
						ERROR_MESSAGES.NOT_VALID_STRING_({ description, min, max }),
					);
				}
				break;
			case "number":
				if (typeof value !== "number" || value < min || value > max) {
					throw new Error(
						ERROR_MESSAGES.NOT_VALID_NUMBER_({ description, min, max }),
					);
				}
				break;
			default:
				throw new Error(ERROR_MESSAGES.NOT_VALID_TYPE);
		}
	});
};

module.exports.validateUpdateItem = (body, { data }) => {
	if (
		!body ||
		(!body.hasOwnProperty("count") &&
			!body.hasOwnProperty("name") &&
			!body.hasOwnProperty("message") &&
			!body.hasOwnProperty("complete"))
	) {
		throw new Error("Відсутні дані");
	}
	if (body.hasOwnProperty("count")) {
		if (typeof body.count !== "number" || body.count < 0) {
			throw new Error("Кількість не може бути від'ємна");
		}
		return ACTIONS.CHANGE_NUMBER;
	}
	if (body.hasOwnProperty("name")) {
		if (
			typeof body.name !== "string" ||
			body.name.length < 0 ||
			body.name.length > 50
		) {
			throw new Error("Назва має включати від 1 до 50 символів");
		}
		return ACTIONS.RENAME;
	}
	if (body.hasOwnProperty("message")) {
		if (
			typeof body.message !== "string" ||
			body.message.length < 0 ||
			body.message.length > 50
		) {
			throw new Error(ERROR_MESSAGES.NOT_VALID_MESSAGE);
		}
		if (data.find((i) => i.message === body.message)) {
			throw new Error(ERROR_MESSAGES.NOT_UNIQUE);
		}
		return ACTIONS.CHANGE_MESSAGE;
	}
	if (body.hasOwnProperty("complete")) {
		if (typeof body.complete !== "boolean") {
			throw new Error(ERROR_MESSAGES.NO_MESSAGE);
		}
		return ACTIONS.COMPLETE;
	}
};

module.exports.validateCreateList = (body) => async (db) => {
	// todo
	if (!body) {
		throw new Error("Відсутнє тіло запиту");
	}
	if (!body.hasOwnProperty("type") || typeof body.type !== "number") {
		throw new Error("Відсутній тип списку");
	}
	if (body.type !== 1 && body.type !== 2 && body.type !== 3) {
		throw new Error("Неправильний тип списку");
	}
	if (
		!body.hasOwnProperty("name") ||
		typeof body.name !== "string" ||
		!body.name.length
	) {
		throw new Error("Відсутня назва списку (name: string)");
	}
	if (body.name.length > 30) {
		throw new Error("Назва списку занадто довга");
	}
	if (await db.getListByName(body.name)) {
		throw new Error("Список з такою назвою вже існує");
	}
	if (body.type === 1 || body.type === 2) {
		if (Object.keys(body).length > 2) {
			throw new Error("Неправильні дані для створення списку");
		}
		return;
	}
	if (
		!body.hasOwnProperty("view") ||
		typeof body.view !== "string" ||
		!body.view.length
	) {
		throw new Error(
			"Відсутня схема відображення елементів списку (view: string)",
		);
	}
	if (
		!body.hasOwnProperty("printView") ||
		typeof body.printView !== "string" ||
		!body.printView.length
	) {
		throw new Error(
			"Відсутня схема відображення елементів списку (view: string)",
		);
	}
	if (
		!isViewValid(body.view, body.fields) ||
		!isViewValid(body.printView, body.fields)
	) {
		throw new Error("Схема відображення включає неіснуючі поля");
	}
	if (
		!body.hasOwnProperty("fields") ||
		!Array.isArray(body.fields) ||
		!body.fields?.length
	) {
		throw new Error("Відсутня схема полів списку (fields: object[])");
	}
	validateFields(body.fields);
	if (
		body.hasOwnProperty("sort") &&
		(typeof body.sort !== "string" ||
			!body.sort.length ||
			!body.fields.find((f) => f.name === body.sort))
	) {
		throw new Error("Неправильне поле для сортування");
	}
};
