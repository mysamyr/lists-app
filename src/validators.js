const { ACTIONS } = require("./constants");
const { getViewFields } = require("./helper");

const validateFields = (fields) => {
	const checkedSet = new Set();
	for (let field of fields) {
		if (
			!field.hasOwnProperty("field") ||
			typeof field.field !== "string" ||
			!field.field.length
		) {
			throw new Error("Поле в схемі має містити поле field: string");
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
		if (checkedSet.has(field.field)) {
			throw new Error("Схема полів включає дублікати");
		}

		checkedSet.add(field.field);
	}
};

const isViewValid = (schema, fields) => {
	const schemaItems = getViewFields(schema);
	for (let field of schemaItems) {
		if (fields.find((i) => i.field === field)) return false;
	}
	return true;
};

module.exports.validateCreateItem = (body, fields) => {
	if (!body) {
		throw new Error("Відсутні дані для створення");
	}
	fields.forEach(({ field, description, type, min, max }) => {
		if (!body.hasOwnProperty(field)) {
			throw new Error(`Відсутнє поле ${description}`);
		}
		const value = body[field];
		if (
			type === "string" &&
			(typeof value !== "string" || value.length < min || value.length > max)
		) {
			throw new Error(
				`Поле ${description} має бути рядком і включати від ${min} до ${max} символів`,
			);
		}
		if (
			type === "number" &&
			(typeof value !== "number" || value < min || value > max)
		) {
			throw new Error(
				`Поле ${description} має бути числом від ${min} до ${max}`,
			);
		}
	});
};

module.exports.validateUpdateItem = (body) => {
	if (
		!body ||
		(!body.hasOwnProperty("count") && !body.hasOwnProperty("name"))
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
			throw new Error("Назва має включати від 0 до 50 символів");
		}
		return ACTIONS.RENAME;
	}
};

module.exports.validateCreateList = (body) => async (db) => {
	if (!body) {
		throw new Error("Відсутнє тіло запиту");
	}
	if (
		!body.hasOwnProperty("name") ||
		typeof body.name !== "string" ||
		!body.name.length
	) {
		throw new Error("Відсутня назва списку (name: string)");
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
		!body.hasOwnProperty("fields") ||
		!Array.isArray(body.fields) ||
		!body.fields?.length
	) {
		throw new Error("Відсутня схема полів списку (fields: object[])");
	}
	const { name, view, fields } = body;
	if (await db.getListByName(name)) {
		throw new Error("Список з такою назвою вже існує");
	}
	if (name.length > 30) {
		throw new Error("Назва списку занадто довга");
	}

	validateFields(fields);

	if (!isViewValid(view, fields)) {
		throw new Error("Схема відображення включає неіснуючі поля");
	}
};
