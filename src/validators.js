const {
	ACTIONS,
	ERROR_MESSAGES,
	NAME_MIN_LENGTH,
	NAME_MAX_LENGTH,
	FIELDS,
	FIELD_TYPES,
	LIST_TYPES,
} = require("./constants");
const { getViewFields } = require("./helper");
const { getListByName } = require("./database");

const validateFields = (fields) => {
	const checkedSet = new Set();
	for (let field of fields) {
		if (
			!field.hasOwnProperty(FIELDS.NAME) ||
			typeof field.name !== FIELD_TYPES.STRING ||
			!field.name.length
		) {
			throw new Error("Схема має містити поле name: string");
		}
		if (
			!field.hasOwnProperty(FIELDS.DESCRIPTION) ||
			typeof field.description !== FIELD_TYPES.STRING ||
			!field.description.length
		) {
			throw new Error("Схема має містити поле description: string (Опис)");
		}
		if (
			!field.hasOwnProperty(FIELDS.TYPE) ||
			typeof field.type !== FIELD_TYPES.STRING ||
			!field.type.length
		) {
			throw new Error("Схема має містити поле type: string (Тип поля)");
		}
		if (field.type !== "string" && field.type !== FIELD_TYPES.NUMBER) {
			throw new Error(ERROR_MESSAGES.NOT_VALID_TYPE);
		}
		if (
			!field.hasOwnProperty(FIELDS.MIN) ||
			typeof field.min !== FIELD_TYPES.NUMBER ||
			!field.hasOwnProperty(FIELDS.MAX) ||
			typeof field.max !== FIELD_TYPES.NUMBER
		) {
			throw new Error(
				"Схема має містити обмеження (min: number & max: number)",
			);
		}
		if (
			field.hasOwnProperty(FIELDS.POSTFIX) &&
			typeof field.postfix !== FIELD_TYPES.STRING &&
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

const validateName = async (body, data) => {
	if (
		!body.hasOwnProperty(FIELDS.NAME) ||
		typeof body.name !== FIELD_TYPES.STRING
	) {
		throw new Error("Відсутня назва списку (name: string)");
	}
	if (
		body.name.length < NAME_MIN_LENGTH ||
		body.name.length > NAME_MAX_LENGTH
	) {
		throw new Error(
			`Назва списку має включати від ${NAME_MIN_LENGTH} до ${NAME_MAX_LENGTH} символів`,
		);
	}
	if (
		(data && data.find((i) => i.name === body.name)) ||
		(await getListByName(body.name))
	) {
		throw new Error("Список з такою назвою вже існує");
	}
};

const validateUniqueFieldsCombination = (body, { fields, data }) => {
	fields.forEach(({ name, description, type, min, max }) => {
		if (!body.hasOwnProperty(name)) {
			throw new Error(ERROR_MESSAGES.NOT_VALID_MESSAGE_(description));
		}
		const value = body[name];
		switch (type) {
			case FIELD_TYPES.STRING:
				if (
					typeof value !== FIELD_TYPES.STRING ||
					value.length < min ||
					value.length > max
				) {
					throw new Error(
						ERROR_MESSAGES.NOT_VALID_STRING_({ description, min, max }),
					);
				}
				break;
			case FIELD_TYPES.NUMBER:
				if (typeof value !== FIELD_TYPES.NUMBER || value < min || value > max) {
					throw new Error(
						ERROR_MESSAGES.NOT_VALID_NUMBER_({ description, min, max }),
					);
				}
				break;
			default:
				throw new Error(ERROR_MESSAGES.NOT_VALID_TYPE);
		}
	});
	if (
		data.find((i) =>
			Object.entries(i).every(([key, value]) => {
				if (key === FIELDS.COUNT || key === FIELDS.ID || value === body[key])
					return true;
			}),
		)
	) {
		throw new Error(ERROR_MESSAGES.NOT_UNIQUE);
	}
};

const isViewValid = (schema, fields) => {
	const schemaItems = getViewFields(schema);
	for (let field of schemaItems) {
		if (!fields.find((i) => i.name === field)) return false;
	}
	return true;
};

module.exports.validateCreateItem = (body, { type, fields, data }) => {
	if (!body) {
		throw new Error(ERROR_MESSAGES.NO_CREATION_DATA);
	}
	if (type === LIST_TYPES.SIMPLE || type === LIST_TYPES.TODO) {
		if (!body.hasOwnProperty(FIELDS.NAME)) {
			throw new Error(ERROR_MESSAGES.NO_MESSAGE);
		}
		if (type === LIST_TYPES.TODO && !body.hasOwnProperty(FIELDS.COMPLETE)) {
			throw new Error(ERROR_MESSAGES.NO_CREATION_DATA);
		}
		const name = body.name;
		if (
			typeof name !== FIELD_TYPES.STRING ||
			name.length < NAME_MIN_LENGTH ||
			name.length > NAME_MAX_LENGTH
		) {
			throw new Error(ERROR_MESSAGES.NOT_VALID_MESSAGE);
		}
		if (data.find((i) => i.name === name)) {
			throw new Error(ERROR_MESSAGES.NOT_UNIQUE);
		}
		return;
	}
	validateUniqueFieldsCombination(body, { fields, data });
};

module.exports.validateUpdateItem = async (
	body,
	{ type, fields, data },
	id,
) => {
	if (
		!body ||
		(!body.hasOwnProperty(FIELDS.COUNT) &&
			!body.hasOwnProperty(FIELDS.NAME) &&
			!body.hasOwnProperty(FIELDS.COMPLETE))
	) {
		throw new Error("Відсутні дані");
	}
	if (body.hasOwnProperty(FIELDS.COUNT)) {
		if (typeof body.count !== FIELD_TYPES.NUMBER || body.count < 0) {
			throw new Error("Кількість не може бути від'ємна");
		}
		return ACTIONS.CHANGE_NUMBER;
	}
	if (body.hasOwnProperty(FIELDS.NAME)) {
		if (
			typeof body.name !== FIELD_TYPES.STRING ||
			body.name.length < NAME_MIN_LENGTH ||
			body.name.length > NAME_MAX_LENGTH
		) {
			throw new Error(
				`Назва має включати від ${NAME_MIN_LENGTH} до ${NAME_MAX_LENGTH} символів`,
			);
		}
		if (type === LIST_TYPES.SIMPLE || type === LIST_TYPES.TODO) {
			await validateName(body, data);
		} else {
			const item = data.find((i) => i.id.toString() === id);
			validateUniqueFieldsCombination(
				{ ...item, name: body.name },
				{ fields, data },
			);
		}
		return ACTIONS.RENAME;
	}
	if (body.hasOwnProperty(FIELDS.COMPLETE)) {
		if (typeof body.complete !== FIELD_TYPES.BOOLEAN) {
			throw new Error(ERROR_MESSAGES.NOT_VALID_TYPE);
		}
		return ACTIONS.COMPLETE;
	}
};

module.exports.validateCreateList = async (body) => {
	if (!body) {
		throw new Error("Відсутнє тіло запиту");
	}
	if (
		!body.hasOwnProperty(FIELDS.TYPE) ||
		typeof body.type !== FIELD_TYPES.NUMBER
	) {
		throw new Error("Відсутній тип списку");
	}
	if (
		body.type !== LIST_TYPES.SIMPLE &&
		body.type !== LIST_TYPES.TODO &&
		body.type !== LIST_TYPES.COMPLEX
	) {
		throw new Error("Неправильний тип списку");
	}
	await validateName(body);
	if (body.type === LIST_TYPES.SIMPLE || body.type === LIST_TYPES.TODO) {
		if (Object.keys(body).length > 2) {
			throw new Error("Неправильні дані для створення списку");
		}
		return;
	}
	if (
		!body.hasOwnProperty(FIELDS.VIEW) ||
		typeof body.view !== FIELD_TYPES.STRING ||
		!body.view.length
	) {
		throw new Error(
			"Відсутня схема відображення елементів списку (view: string)",
		);
	}
	if (
		!body.hasOwnProperty(FIELDS.PRINT_VIEW) ||
		typeof body.printView !== FIELD_TYPES.STRING ||
		!body.printView.length
	) {
		throw new Error(
			"Відсутня схема відображення компактного списку (printView: string)",
		);
	}
	if (
		!isViewValid(body.view, body.fields) ||
		!isViewValid(body.printView, body.fields)
	) {
		throw new Error("Схема відображення включає неіснуючі поля");
	}
	if (
		!body.hasOwnProperty(FIELDS.FIELDS) ||
		!Array.isArray(body.fields) ||
		!body.fields?.length
	) {
		throw new Error("Відсутня схема полів списку (fields: object[])");
	}
	validateFields(body.fields);
	if (
		body.hasOwnProperty(FIELDS.SORT) &&
		(typeof body.sort !== FIELD_TYPES.STRING ||
			!body.sort.length ||
			!body.fields.find((f) => f.name === body.sort))
	) {
		throw new Error("Неправильне поле для сортування");
	}
};

module.exports.validateRenameList = async (body) => {
	if (!body) {
		throw new Error("Відсутнє тіло запиту");
	}
	await validateName(body);
};
