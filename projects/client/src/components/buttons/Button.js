import { createDiv } from "../../utils/elements";

export default ({ onClick, text, color, once = true }) => {
	const confirmBtn = createDiv();
	confirmBtn.classList.add("btn");
	if (color) confirmBtn.classList.add(color);
	confirmBtn.innerText = text;
	confirmBtn.addEventListener("click", onClick, { once });
	return confirmBtn;
};
