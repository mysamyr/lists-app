const { NAME_MIN_LENGTH, NAME_MAX_LENGTH } = require("../../constants");
const ERROR_MESSAGES = require("../..//constants/error-messages");
const { FIELDS, FIELD_TYPES } = require("../../constants/enums");
const ListModel = require("../../models/list");
const ConfigModel = require("../../models/config");
const { getConfigData } = require("../config/config.service");
const { getListWithData } = require("./list.service");
const { validateName } = require("../../validators");

const validateFields = (body, { fields }) => {
	fields.forEach(({ name, description, type, min, max }) => {
		if (!body.hasOwnProperty(name)) {
			throw new Error(ERROR_MESSAGES.NOT_EXISTING_FIELD_$(description));
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
						ERROR_MESSAGES.NOT_VALID_STRING_$({ description, min, max }),
					);
				}
				break;
			case FIELD_TYPES.NUMBER:
				if (
					typeof value !== FIELD_TYPES.NUMBER ||
					(min && value < min) ||
					(max && value > max)
				) {
					throw new Error(
						ERROR_MESSAGES.NOT_VALID_NUMBER_$({ description, min, max }),
					);
				}
				break;
			case FIELD_TYPES.BOOLEAN:
				if (typeof value !== FIELD_TYPES.BOOLEAN) {
					throw new Error(ERROR_MESSAGES.INCORRECT_FIELD_$(name));
				}
		}
	});
};

const validateUniqueFieldsCombination = (body, items) => {
	if (
		items.find((i) =>
			Object.entries(i).every(
				([key, value]) =>
					key === FIELDS.COUNT ||
					key === FIELDS.COMPLETE ||
					key === FIELDS.ID ||
					value === body[key],
			),
		)
	) {
		throw new Error(ERROR_MESSAGES.NOT_UNIQUE_LIST_ITEM);
	}
};

module.exports.validateCreate = async (body, parent) => {
	if (!body) {
		throw new Error(ERROR_MESSAGES.NO_DATA);
	}

	if (body.config) {
		// create list
		validateName(body, { min: NAME_MIN_LENGTH, max: NAME_MAX_LENGTH });

		if (!(await ConfigModel.getById(body.config))) {
			throw new Error(ERROR_MESSAGES.NOT_EXISTING_CONFIG);
		}

		if (parent) {
			const children = await ListModel.list(parent.children);
			if (children.find((i) => i.config && i.name === body.name)) {
				throw new Error(ERROR_MESSAGES.NOT_UNIQUE);
			}
		}
	} else {
		// create list item
		const config = await getConfigData(parent.config);

		validateFields(body, config);

		const children = await ListModel.list(parent.children);
		const siblings = children.filter((i) => {
			if (body.config) {
				return i.config && i.name === body.name;
			} else {
				return !i.config && i.name === body.name;
			}
		});
		if (siblings.length) {
			validateUniqueFieldsCombination(body, siblings);
		}
	}
};

module.exports.validateUpdate = async (body, item, parent) => {
	if (!body) {
		throw new Error(ERROR_MESSAGES.NO_DATA);
	}
	if (!parent) {
		// changing name for entry list
		validateName(body, { min: NAME_MIN_LENGTH, max: NAME_MAX_LENGTH });
		return;
	}
	const parentData = await getListWithData(parent);

	if (body.hasOwnProperty(FIELDS.COUNT)) {
		const countConfig = parentData.config.fields.find(
			(i) => i.name === FIELDS.COUNT,
		);
		if (
			typeof body.count !== FIELD_TYPES.NUMBER ||
			(countConfig.min && body.count < countConfig.min) ||
			(countConfig.max && body.count > countConfig.max)
		) {
			throw new Error(ERROR_MESSAGES.INCORRECT_FIELD_$(FIELDS.COUNT));
		}
		if (body.count === item.count) {
			throw new Error(ERROR_MESSAGES.COUNT_DIDNT_CHANGE);
		}
	} else if (body.hasOwnProperty(FIELDS.NAME)) {
		const nameConfig = parentData.config.fields.find(
			(i) => i.name === FIELDS.NAME,
		);
		validateName(body, nameConfig);

		const children = await ListModel.list(parent.children);
		const siblings = children.filter((i) => {
			if (item.config) {
				return i.config && i.name === body.name;
			} else {
				return !i.config && i.name === body.name;
			}
		});
		if (siblings.length) {
			validateUniqueFieldsCombination(body, siblings);
		}
	} else if (body.hasOwnProperty(FIELDS.COMPLETE)) {
		if (typeof body.complete !== FIELD_TYPES.BOOLEAN) {
			throw new Error(ERROR_MESSAGES.NOT_VALID_TYPE);
		}
	}
};
