import { getRequest } from "../api";
import { URLS } from "../constants";
import Header from "../components/Header";
import Breadcrumbs from "../components/Breadcrumbs";
import List from "../components/List";
import ListDetails from "../components/ListDetails";
import { handleDialogClose, sortByValue } from "../utils/helpers";
import { createDialog, createDiv } from "../utils/dom";
import {
	getListData,
	getListItems,
	getParentData,
	setListItems,
} from "../store";
import AddButton from "../components/buttons/AddButton";
import ListItem from "../components/ListItem";
import { navigate } from "../utils/navigator";

const getBottomMargin = () => {
	const marginBottom = createDiv();
	marginBottom.classList.add("margin-bottom");
	return marginBottom;
};

const renderList = (body, data) => {
	// no config for entry lists
	const config = getListData()?.config || {};
	body.append(
		List(sortByValue(data, config.sort), ListItem, config.view),
		getBottomMargin(),
		AddButton(),
	);
};

const renderListDetails = (body, data) => {
	const config = getParentData().config;
	body.appendChild(ListDetails(data, config));
};

const renderDialog = (body) => {
	const dialog = createDialog();
	dialog.classList.add("column");
	body.appendChild(dialog);
	handleDialogClose();
};

export default async (id) => {
	const isHomePage = !id;
	const body = document.querySelector("body");
	const listItems = getListItems();
	const listDetails = listItems.find((i) => i.id === id && !i.config);
	if (isHomePage || !listDetails) {
		try {
			const lists = await getRequest(
				isHomePage ? URLS.GET_LISTS : URLS.GET_LIST_DETAILS_$(id),
			);
			setListItems(lists);
			body.innerText = "";
			const currentListData = getListData();
			body.append(
				Header({
					title: isHomePage ? "Lists" : currentListData.name,
					left: !isHomePage ? "back" : "menu",
					withSort: !isHomePage,
				}),
			);
			if (!isHomePage) {
				body.append(Breadcrumbs());
			}
			renderList(body, lists);
			renderDialog(body);
		} catch {
			return navigate(URLS.ERROR);
		}
	} else {
		body.innerText = "";
		body.append(
			Header({ title: listDetails.name, left: "back" }),
			Breadcrumbs(),
		);
		renderListDetails(body, listDetails);
	}
};
