import { FIELD_TYPES, LIST_ITEM_LENGTH } from "../constants";
import {
	NAME_IS_EMPTY,
	NAME_IS_TOO_LONG,
	NAME_IS_TOO_SHORT,
	NOT_UNIQUE_ITEM,
	NUMBER_FIELD_VALIDATION_ERROR_$,
	STRING_FIELD_VALIDATION_ERROR_$,
} from "../constants/errors";

export const validateName = (name) => {
	if (!name.length) {
		return NAME_IS_EMPTY;
	}
	if (name.length < LIST_ITEM_LENGTH.MIN) {
		return NAME_IS_TOO_SHORT;
	}
	if (name.length > LIST_ITEM_LENGTH.MAX) {
		return NAME_IS_TOO_LONG;
	}
};

export const validateCreateListItemForm = (inputs, fields, items) => {
	const data = {};
	let notUniqueItems = [...items];
	for (let { name, description, type, min, max } of fields) {
		let value = inputs[name];
		if (
			type === FIELD_TYPES.STRING &&
			(typeof value !== "string" || value.length < min || value.length > max)
		) {
			return {
				error: STRING_FIELD_VALIDATION_ERROR_$(description, min, max),
			};
		}
		if (type === FIELD_TYPES.NUMBER) {
			value = value === "" ? 0 : +value;
			if ((min && value < min) || (max && value > max)) {
				return {
					error: NUMBER_FIELD_VALIDATION_ERROR_$(description, min, max),
				};
			}
		}
		data[name] = value;
		notUniqueItems = notUniqueItems.filter((i) => i[name] === value);
	}
	if (notUniqueItems.length) {
		return {
			error: NOT_UNIQUE_ITEM,
		};
	}
	return { data };
};
