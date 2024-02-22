import { createDiv } from "../utils/dom";
import { putRequest } from "../api";
import { URLS } from "../constants";
import { navigate } from "../utils/navigator";
import { getListItems } from "../store";
import Buttons from "./buttons/Buttons";
import { showError } from "../utils/helpers";
import { COUNT_TOO_HIGH, COUNT_TOO_LOW } from "../constants/errors";
import Button from "./buttons/Button";

const changeCount = async (id, count, fields) => {
	const countConfig = fields.find((i) => i.name === "count");
	if (countConfig.hasOwnProperty("min") && count < countConfig.min)
		return showError(COUNT_TOO_LOW);
	if (countConfig.hasOwnProperty("max") && count > countConfig.max)
		return showError(COUNT_TOO_HIGH);
	await putRequest(URLS.UPDATE_LIST_DETAILS_$(id), { count });
	const lists = getListItems();
	lists.forEach((item, idx) => {
		if (item.id === id) {
			lists[idx].count = count;
		}
	});
	return navigate(URLS.GET_LIST_DETAILS_$(id));
};

const changeCompleted = async (id, completed) => {
	await putRequest(URLS.UPDATE_LIST_DETAILS_$(id), { completed });
	const lists = getListItems();
	lists.forEach((item, idx) => {
		if (item.id === id) {
			lists[idx].completed = completed;
		}
	});
	return navigate(URLS.GET_LIST_DETAILS_$(id));
};

const getCompletedButton = (id, completed) => {
	const container = createDiv();
	container.classList.add("btns");
	container.appendChild(
		Button({
			onClick: () => changeCompleted(id, !completed),
			text: "Change Completed",
		}),
	);
	return container;
};

export default (data, config) => {
	const container = createDiv();
	container.classList.add("column", "gap");
	let addActions;
	let completed;
	const fields = config.fields.map(({ name, description }) => {
		const item = createDiv();
		item.classList.add("row");
		item.innerHTML = `<b>${description}: </b><p>${data[name]}</p>`;
		if (name === "count") addActions = true;
		if (name === "completed") completed = true;
		return item;
	});
	container.append(...fields);
	if (addActions) {
		container.appendChild(
			Buttons({
				onConfirm: async () =>
					changeCount(data.id, data.count - 1, config.fields),
				onClose: async () =>
					changeCount(data.id, data.count + 1, config.fields),
				confirmText: "-",
				cancelText: "+",
				confirmColor: "red",
				cancelColor: "green",
			}),
		);
	}
	if (completed) {
		container.appendChild(getCompletedButton(data.id, data.completed));
	}
	return container;
};
