import { createDiv, createParagraph } from "../../utils/elements";
import { getButtons } from "../../utils/helpers";

export default (onConfirm) => {
	const dialog = document.querySelector("dialog");
	const container = createDiv();
	container.classList.add("dialog-modal");
	const paragraph = createParagraph();
	paragraph.innerText = "Are you sure you want to delete list item?";
	const buttons = getButtons({ onConfirm });
	container.append(paragraph, buttons);
	dialog.appendChild(container);
	dialog.showModal();
};
