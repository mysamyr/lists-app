import { createDiv } from "../utils/elements";
import { putRequest } from "../api";
import { URLS } from "../constants";
import { navigate } from "../utils/navigator";
import { getListItems } from "../store";

const changeCount = async (id, count) => {
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

const getActionButtons = (id, count) => {
	const div = createDiv();
	const decBtn = createDiv();
	const incBtn = createDiv();
	div.classList.add("btns");
	decBtn.classList.add("btn", "red");
	incBtn.classList.add("btn", "green");
	decBtn.innerText = "-";
	incBtn.innerText = "+";
	decBtn.addEventListener("click", async () => changeCount(id, count - 1), {
		once: true,
	});
	incBtn.addEventListener("click", async () => changeCount(id, count + 1), {
		once: true,
	});
	div.append(decBtn, incBtn);
	return div;
};

const getCompletedButton = (id, completed) => {
	const container = createDiv();
	container.classList.add("btns");
	const button = createDiv();
	button.classList.add("btn");
	button.innerText = "Change Completed";
	button.addEventListener(
		"click",
		async () => changeCompleted(id, !completed),
		{
			once: true,
		},
	);
	container.appendChild(button);
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
		container.appendChild(getActionButtons(data.id, data.count));
	}
	if (completed) {
		container.appendChild(getCompletedButton(data.id, data.completed));
	}
	return container;
};
