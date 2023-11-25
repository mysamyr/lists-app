import { createDiv } from "../../utils/elements";
import DropDown from "../DropDown";

export default () => {
	const addBtnState = {
		opened: false,
	};
	const addBtn = createDiv();
	addBtn.classList.add("add-item");
	addBtn.innerText = "+";
	addBtn.addEventListener("click", () => {
		if (!addBtnState.opened) {
			addBtnState.opened = true;
			addBtn.innerHTML = "&times;";
			document.querySelector("body").appendChild(DropDown());
			return;
		}
		addBtnState.opened = false;
		addBtn.innerText = "+";
		document.querySelector(".add-drop-down").remove();
	});
	return addBtn;
};
