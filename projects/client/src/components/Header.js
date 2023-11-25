import { getListData } from "../store";
import { navigateBack } from "../utils/navigator";
import SortModal from "./modals/SortModal";
import { createDiv, createHeader1 } from "../utils/elements";
import { getQueryStringObject } from "../utils/helpers";

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

const getBackBtn = () => {
	const backBtn = createDiv();
	backBtn.id = "back";
	backBtn.addEventListener("click", navigateBack, { once: true });
	backBtn.innerHTML = `<img src="/img/back-arrow.svg" height="24" alt="back"/>`;
	return backBtn;
};
const getSortBtn = (withSort) => {
	const sortBtn = createDiv();
	if (withSort) {
		sortBtn.id = "sort";
		sortBtn.addEventListener("click", onClickSort);
		sortBtn.innerHTML = `<img src="/img/sort.svg" height="20" alt="sort"/>`;
	} else {
		sortBtn.style.width = "44px";
	}
	return sortBtn;
};

export default (withBack = false, withSort = false) => {
	const container = createDiv();
	container.classList.add("row", "header");
	if (withBack) {
		container.appendChild(getBackBtn());
	}
	const header = createHeader1();
	header.innerText = "Lister App";
	container.appendChild(header);
	container.appendChild(getSortBtn(withSort));

	return container;
};
