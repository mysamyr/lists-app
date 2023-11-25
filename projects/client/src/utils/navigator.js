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
	if (path === URLS.HOME || path === URLS.LISTS) {
		clearState();
		return listPage();
	}
	if (path === URLS.CONFIGS) {
		clearState();
		return configsPage();
	}
	if (URLS.LIST_REGEXP.test(path)) {
		const [, , id] = path.split("/");
		return listPage(id);
	}
	if (URLS.CONFIG_REGEXP.test(path)) {
		const [, , id] = path.split("/");
		return configsPage(id);
	}
	if (path === URLS.NEW_LIST) {
		return createListPage();
	}
	return page404();
};

export const navigate = async (path = URLS.LISTS) => {
	window.history.pushState({ path }, path, path);
	return render(path);
};

export const navigateBack = async () => {
	const path = history.state.path;
	const breadcrumbsStack = getBreadcrumbs();
	popBreadcrumbs();
	history.replaceState({ path, obsolete: true }, "");
	if (path.includes("lists") && !breadcrumbsStack.length) {
		return navigate(URLS.LISTS);
	}
	if (URLS.CONFIGS === path || URLS.CONFIG_REGEXP.test(path)) {
		return navigate(URLS.CONFIGS);
	}
	const id = getListData().id;
	const url = URLS.GET_LIST_DETAILS_$(id);
	history.pushState({ path: url }, "");
	return render(url);
};

export const setQueryParams = (params) => {
	const searchParams = new URLSearchParams(window.location.search);
	Object.entries(params).forEach(([key, value]) => {
		searchParams.set(key, value);
	});
	const newUrl = window.location.pathname + "?" + searchParams.toString();
	window.history.pushState({ path: newUrl }, "", newUrl);
};
