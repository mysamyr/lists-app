const LIST_LENGTH = {
	MIN: 3,
	MAX: 30,
};

const LIST_ITEM_LENGTH = {
	MIN: 3,
	MAX: 50,
};

const URLS = {
	HOME: "/",
	GET_LISTS: "/list",
	CREATE_LIST: "/create-list-page",
	LIST_PAGE_$(id) {
		return `/list-page/${id}`;
	},
	PRINT_$(id) {
		return `/print-list/${id}`;
	},
	RENAME_LIST_$(id) {
		return `/list/${id}`;
	},
	DELETE_LIST_$(id) {
		return `/list/${id}`;
	},
	GET_LIST_DETAILS_$(id) {
		return `/list/${id}`;
	},
	CREATE_LIST_ITEM_$(id) {
		return `/list/${id}`;
	},
	UPDATE_LIST_ITEM_$(listId, id) {
		return `/list/${listId}/item/${id}`;
	},
	DELETE_LIST_ITEM_$(listId, id) {
		return `/list/${listId}/item/${id}`;
	},
};

export { LIST_LENGTH, LIST_ITEM_LENGTH, URLS };
