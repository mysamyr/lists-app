export const URLS = {
	HOME: "/",
	LISTS: "/lists",
	CONFIGS: "/configs",
	LIST_REGEXP: /^\/lists\/[a-f\d]{24}$/,
	CONFIG_REGEXP: /^\/configs\/[a-f\d]{24}$/,
	NEW_LIST: "/lists/new",

	GET_LISTS: "/lists",
	GET_LIST_DETAILS_$: (id) => `/lists/${id}`,
	CREATE_NEW_ENTRY_LIST: "/lists",
	CREATE_NEW_LIST_ITEM_$: (id) => `/lists/${id}`,
	UPDATE_LIST_DETAILS_$: (id) => `/lists/${id}`,
	DELETE_LIST_ITEM_$: (id) => `/lists/${id}`,

	GET_CONFIGS: "/configs",
	GET_CONFIG_DETAILS: (id) => `/configs/${id}`,
};

export const LIST_ITEM_LENGTH = {
	MIN: 3,
	MAX: 50,
};

export const FIELD_TYPES = {
	STRING: "str",
	NUMBER: "num",
	BOOLEAN: "bool",
};
