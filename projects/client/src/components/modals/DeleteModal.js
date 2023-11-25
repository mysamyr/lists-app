import { createDiv, createParagraph } from "../../utils/dom";
import Buttons from "../buttons/Buttons";

export default (onConfirm) => {
	const dialog = document.querySelector("dialog");
	const container = createDiv();
	container.classList.add("dialog-modal");
	const paragraph = createParagraph();
	paragraph.innerText = "Are you sure you want to delete list item?";
	const buttons = Buttons({
		onConfirm,
		confirmText: "Delete",
		confirmColor: "red",
		cancelColor: "green",
	});
	container.append(paragraph, buttons);
	dialog.appendChild(container);
	dialog.showModal();
};
