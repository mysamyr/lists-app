import { getListData } from "../store";
import { navigateBack } from "../utils/navigator";
import SortModal from "./modals/SortModal";
import { createDiv, createHeader1, onPressClick } from "../utils/dom";
import { getQueryStringObject } from "../utils/helpers";
import Sidebar from "./Sidebar";

const onClickSort = () => {
	const queryStringObj = getQueryStringObject();
	const list = getListData();
	const fields = list.config.fields;
	SortModal({
		fields,
		sort: queryStringObj.sort || list.config.sort,
		direction: queryStringObj.direction || "asc",
	});
};

const leftContent = (id) => {
	const container = createDiv();
	if (!id) {
		return container;
	}
	const withBack = id === "back";
	container.id = id;
	if (withBack) {
		onPressClick(container, navigateBack, { once: true });
	} else {
		onPressClick(container, Sidebar);
	}
	container.innerHTML = `<img src="/img/${
		withBack ? "back-arrow" : "menu"
	}.svg" height="24" alt=${id}/>`;
	return container;
};
const rightContent = (withSort) => {
	const rightContainer = createDiv();
	if (withSort) {
		rightContainer.id = "sort";
		onPressClick(rightContainer, onClickSort);
		rightContainer.innerHTML = `<img src="/img/sort.svg" height="20" alt="sort"/>`;
	}
	return rightContainer;
};

export default ({ title, left, withSort = false }) => {
	const container = createDiv();
	container.classList.add("row", "header");
	const header = createHeader1();
	header.innerText = title.length > 25 ? title.slice(0, 26) + "..." : title;
	container.append(leftContent(left), header, rightContent(withSort));

	return container;
};
