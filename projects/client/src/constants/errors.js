export const NOT_UNIQUE_ITEM = "Item is not unique";

export const NOT_UNIQUE_NAME = "Name must be unique";
export const NAME_IS_EMPTY = "Name cannot be empty";
export const NAME_IS_TOO_SHORT = "Name is too short";
export const NAME_IS_TOO_LONG = "Name is too long";

export const COUNT_TOO_LOW = "Count is too low";
export const COUNT_TOO_HIGH = "Count is too high";

export const STRING_FIELD_VALIDATION_ERROR_$ = (description, min, max) =>
	`Field ${description} should be a string and contain from ${min} to ${max} characters`;
export const NUMBER_FIELD_VALIDATION_ERROR_$ = (description, min, max) =>
	`Field ${description} should be a number from ${min} to ${max}`;

export const PROVIDE_ALL_CREATION_DATA = "Please provide all data for creation";
