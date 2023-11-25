import { createDiv, onPressClick } from "../../utils/dom";
import DropDown from "../DropDown";
import { getBreadcrumbs, pushBreadcrumbs } from "../../store";
import { navigate } from "../../utils/navigator";
import { URLS } from "../../constants";
// todo pass func from outside
const onClick = (e) => {
	if (!e.target.isOpened) {
		const breadcrumbsStack = getBreadcrumbs();
		if (!breadcrumbsStack.length) {
			pushBreadcrumbs({ type: "list" });
			return navigate(URLS.NEW_LIST);
		}
		e.target.isOpened = true;
		e.target.innerHTML = "&times;";
		document.querySelector("body").appendChild(DropDown());
		return;
	}
	e.target.isOpened = false;
	e.target.innerText = "+";
	document.querySelector(".add-drop-down").remove();
};

export default () => {
	const addBtn = createDiv();
	addBtn.classList.add("add-item");
	addBtn.innerText = "+";
	onPressClick(addBtn, onClick);
	addBtn.isOpened = false;
	return addBtn;
};
