import { createDiv, onPressClick } from "../utils/dom";
import { pushBreadcrumbs } from "../store";
import { navigate } from "../utils/navigator";
import { URLS } from "../constants";

const onClick = async (type) => {
	pushBreadcrumbs({ type });
	return navigate(URLS.NEW_LIST);
};

export default () => {
	const container = createDiv();
	container.classList.add("add-drop-down", "column", "gap");
	const listItemBtn = createDiv();
	listItemBtn.innerText = "List Item";
	listItemBtn.classList.add("btn", "gray");
	onPressClick(listItemBtn, () => onClick("list-item"), { once: true });
	container.appendChild(listItemBtn);
	const ListBtn = createDiv();
	ListBtn.innerText = "List";
	ListBtn.classList.add("btn", "gray");
	onPressClick(ListBtn, () => onClick("list"), { once: true });
	container.appendChild(ListBtn);
	return container;
};
