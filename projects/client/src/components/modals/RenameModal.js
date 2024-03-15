import { createForm, createParagraph } from "../../utils/dom";
import NameInput from "../inputs/NameInput";
import Buttons from "../buttons/Buttons";

export default (name, onConfirm) => {
	const dialog = document.querySelector("dialog");
	const form = createForm();
	form.classList.add("dialog-modal");
	const header = createParagraph();
	header.innerText = "Enter new name:";
	form.append(
		header,
		NameInput({ value: name, required: true }),
		Buttons({ onConfirm, once: false }),
	);

	dialog.appendChild(form);
	dialog.classList.add("modal");
	dialog.showModal();
};
