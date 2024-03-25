import { URLS } from "../constants";
import listPage from "../pages/list";
import createListPage from "../pages/create-list";
import configsPage from "../pages/config";
import loginPage from "../pages/auth";
import page404 from "../pages/404";
import errorPage from "../pages/error";
import {
	clearState,
	getBreadcrumbs,
	getListData,
	popBreadcrumbs,
} from "../store";
import { getValue } from "./local-storage";

export const render = async (path) => {
	if (path === URLS.HOME || path === URLS.LISTS) {
		clearState();
		return listPage();
	}
	if (path === URLS.LOGIN) {
		clearState();
		return loginPage();
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
	if (path === URLS.ERROR) {
		return errorPage();
	}
	return page404();
};

export const navigate = async (path = URLS.LISTS) => {
	if (!getValue("token")) {
		window.history.pushState({ path: URLS.LOGIN }, "", URLS.LOGIN);
		clearState();
		return loginPage();
	}
	window.history.pushState({ path }, "", path);
	return render(path);
};

export const navigateBack = async () => {
	const path = history.state?.path;
	if (!path || path === URLS.LOGIN) {
		return navigate();
	}
	history.replaceState({ path, obsolete: true }, "");
	if (path.includes(URLS.LISTS)) {
		const breadcrumbsStack = getBreadcrumbs();
		popBreadcrumbs();
		if (!breadcrumbsStack.length) {
			return navigate(URLS.LISTS);
		}
		const id = getListData().id;
		const url = URLS.GET_LIST_DETAILS_$(id);
		history.pushState({ path: url }, "", url);
		return render(url);
	}
	if (path.includes(URLS.CONFIGS)) {
		// todo configs changes
		return navigate(URLS.CONFIGS);
	}
};

export const setQueryParams = (params) => {
	const searchParams = new URLSearchParams(window.location.search);
	Object.entries(params).forEach(([key, value]) => {
		searchParams.set(key, value);
	});
	const newUrl = window.location.pathname + "?" + searchParams.toString();
	window.history.pushState({ path: newUrl }, "", newUrl);
};
