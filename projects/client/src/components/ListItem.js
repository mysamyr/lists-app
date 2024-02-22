import { navigate } from "../utils/navigator";
import { URLS } from "../constants";
import { getListData, getListItems, pushBreadcrumbs } from "../store";
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
import MoveModal from "./modals/MoveModal";

const onClickListItem = async (e, data) => {
	e.preventDefault();
	pushBreadcrumbs(data);
	const path = URLS.GET_LIST_DETAILS_$(data.id);
	return navigate(path);
};

const onChangeCompleted = async ({ id, nameElement }) => {
	const lists = getListItems();
	let completed;
	lists.forEach((item, idx) => {
		if (item.id === id) {
			lists[idx].completed = !lists[idx].completed;
			completed = lists[idx].completed;
		}
	});
	await putRequest(URLS.UPDATE_LIST_DETAILS_$(id), { completed });
	nameElement.classList.toggle("completed");
};

const onDeleteListItem = ({ id }) =>
	DeleteModal(async () => {
		await deleteRequest(URLS.DELETE_LIST_ITEM_$(id));
		const parentId = getListData()?.id;
		return navigate(parentId ? URLS.GET_LIST_DETAILS_$(parentId) : URLS.LISTS);
	});

const onRenameListItem = ({ id, name: oldName }) =>
	RenameModal(oldName, async () => {
		const form = document.querySelector("form");
		const name = form.name.value.trim();
		const err = validateName(name);
		if (err) return showError(err);
		if (oldName === name) return showError("Name isn't changed");
		await putRequest(URLS.DELETE_LIST_ITEM_$(id), { name });
		const parentId = getListData()?.id;
		return navigate(parentId ? URLS.GET_LIST_DETAILS_$(parentId) : URLS.LISTS);
	});
const onMoveList = ({ id }) => {
	MoveModal(async () => {
		const destination = document.querySelector("form").destination.value;
		if (id === destination) return showError("Cannot choose the same element");
		await putRequest(URLS.MOVE_LIST_$(id), { destination });

		return navigate();
	});
};

const getMenuOptions = ({
	id,
	name,
	text: nameElement,
	completed,
	isListItem,
}) => {
	const config = [
		{
			text: "Rename",
			func: onRenameListItem,
		},
		{
			text: "Delete",
			func: onDeleteListItem,
		},
	];
	if (completed !== undefined) {
		config.push({
			text: "Change Completed",
			func: onChangeCompleted,
		});
	}
	if (!isListItem) {
		config.push({
			text: "Move",
			func: onMoveList,
		});
	}
	const result = [];
	config.forEach(({ text, func }) => {
		const option = createDiv();
		option.innerText = text;
		onPressClick(
			option,
			() => {
				document.querySelector(".tooltip").remove();
				return func({ id, name, nameElement, completed });
			},
			{ once: true },
		);
		result.push(option);
	});
	return result;
};

const toggleOptionsTooltip = ({ e, id, name, text, completed, isListItem }) => {
	e.preventDefault();
	e.stopPropagation();
	const existingTooltip = document.querySelector(".tooltip");
	if (existingTooltip) {
		existingTooltip.remove();
		if (existingTooltip.dataset.id === id) return;
	}
	const container = createDiv();
	container.classList.add("tooltip");
	container.dataset.id = id;
	container.append(
		...getMenuOptions({ e, id, name, text, completed, isListItem }),
	);
	document.querySelector("body").appendChild(container);
	const offsetTop = e.target.offsetTop;
	const heightOfElement = e.target.clientHeight;
	container.style.cssText = `top: ${offsetTop + heightOfElement + 12}px;`;
};

const getOptionsButton = ({ id, name, text, completed, isListItem }) => {
	const button = createDiv();
	button.classList.add("icon");
	button.innerHTML = "︙";
	onPressClick(button, (e) =>
		toggleOptionsTooltip({ e, id, name, text, completed, isListItem }),
	);
	return button;
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
	listItem.append(
		text,
		getOptionsButton({ id, name, text, completed, isListItem }),
	);

	return listItem;
};
