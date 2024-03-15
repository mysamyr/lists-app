import { createDiv, onPressClick } from "../../utils/dom";

export default ({ onClick, text, color, once = true }) => {
	const confirmBtn = createDiv();
	confirmBtn.classList.add("btn");
	if (color) confirmBtn.classList.add(color);
	confirmBtn.innerText = text;
	onPressClick(confirmBtn, onClick, { once });
	return confirmBtn;
};
