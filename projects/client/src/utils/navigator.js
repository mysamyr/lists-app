import { URLS } from "../constants";
import listPage from "../pages/list";
import createListPage from "../pages/create-list";
import configsPage from "../pages/config";
import page404 from "../pages/404";
import {
	clearState,
	getBreadcrumbs,
	getListData,
	popBreadcrumbs,
} from "../store";

export const render = async (path) => {
	if (path === URLS.HOME) {
		clearState();
		return listPage();
	}
	if (/^\/lists\/[a-f\d]{24}$/.test(path)) {
		const [, , id] = path.split("/");
		return listPage(id);
	}
	if (path === URLS.NEW_LIST) {
		return createListPage();
	}
	if (path === URLS.CONFIGS) {
		return configsPage();
	}
	if (/^\/configs\/[a-f\d]{24}$/.test(path)) {
		const [, , id] = path.split("/");
		return configsPage(id);
	}
	return page404();
};

export const navigate = async (path = URLS.HOME) => {
	window.history.pushState({ path }, path, path);
	return render(path);
};

export const navigateBack = async () => {
	const breadcrumbsStack = getBreadcrumbs();
	popBreadcrumbs();
	if (!breadcrumbsStack.length) {
		return navigate();
	}
	const id = getListData().id;
	const url = URLS.GET_LIST_DETAILS_$(id);
	return navigate(url);
};

export const setQueryParams = (params) => {
	const searchParams = new URLSearchParams(window.location.search);
	Object.entries(params).forEach(([key, value]) => {
		searchParams.set(key, value);
	});
	const newUrl = window.location.pathname + "?" + searchParams.toString();
	window.history.pushState({ path: newUrl }, "", newUrl);
};
