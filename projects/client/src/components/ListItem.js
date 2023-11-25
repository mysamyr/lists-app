import { navigate } from "../utils/navigator";
import { URLS } from "../constants";
import { getListData, pushBreadcrumbs } from "../store";
import { getView, showError } from "../utils/helpers";
import {
	createDiv,
	createListItem,
	createSpan,
	onPressClick,
} from "../utils/dom";
import DeleteModal from "./modals/DeleteModal";
import { deleteRequest, putRequest } from "../api";
import RenameModal from "./modals/RenameModal";
import { validateName } from "../utils/validators";

const onClickListItem = async (e, data) => {
	e.preventDefault();
	pushBreadcrumbs(data);
	const path = URLS.GET_LIST_DETAILS_$(data.id);
	return navigate(path);
};

const onDeleteListItem = (e, id) => {
	e.preventDefault();
	e.stopPropagation();
	const onConfirm = async () => {
		await deleteRequest(URLS.DELETE_LIST_ITEM_$(id));
		const parentId = getListData()?.id;
		return navigate(parentId ? URLS.GET_LIST_DETAILS_$(parentId) : URLS.HOME);
	};
	DeleteModal(onConfirm);
};

const onRenameListItem = (e, id, oldName) => {
	e.preventDefault();
	e.stopPropagation();
	const onConfirm = async () => {
		const form = document.querySelector("form");
		const name = form.name.value.trim();
		const err = validateName(name);
		if (err) return showError(err);
		if (oldName === name) return showError("Name isn't changed");
		await putRequest(URLS.DELETE_LIST_ITEM_$(id), { name });
		const parentId = getListData()?.id;
		return navigate(parentId ? URLS.GET_LIST_DETAILS_$(parentId) : URLS.HOME);
	};
	RenameModal(oldName, onConfirm);
};

const getButtons = (id, name) => {
	const buttonsContainer = createDiv();
	buttonsContainer.classList.add("btns");
	const renameBtn = createDiv();
	renameBtn.classList.add("icon");
	renameBtn.innerHTML = "&#9998;";
	const deleteBtn = createDiv();
	deleteBtn.classList.add("icon");
	deleteBtn.innerHTML = "&times;";
	onPressClick(renameBtn, (e) => onRenameListItem(e, id, name));
	onPressClick(deleteBtn, (e) => onDeleteListItem(e, id));
	buttonsContainer.append(renameBtn, deleteBtn);
	return buttonsContainer;
};

export default (data, view) => {
	const { id, name, config, completed } = data;
	const isListItem = !config;

	const listItem = createListItem();
	listItem.classList.add("list");
	if (isListItem) {
		listItem.classList.add("list-item");
	}
	const text = createSpan();
	if (completed) {
		text.classList.add("completed");
	}
	text.innerText = isListItem ? getView(data, view) : name;
	onPressClick(listItem, (e) => onClickListItem(e, data), { once: true });
	listItem.append(text, getButtons(id, name));

	return listItem;
};
