import { getButtons } from "../../utils/helpers";
import { createForm } from "../../utils/elements";
import NameInput from "../inputs/NameInput";

export default (name, onConfirm) => {
	const dialog = document.querySelector("dialog");
	const form = createForm();
	form.classList.add("dialog-modal");

	form.append(
		NameInput({ value: name, required: true }),
		getButtons({ onConfirm, once: false }),
	);

	dialog.appendChild(form);
	dialog.showModal();
};
