import { createDiv } from "../../utils/dom";
import { closeDialog } from "../../utils/helpers";
import Button from "./Button";

export default ({
	onConfirm,
	onClose = closeDialog,
	confirmText = "Confirm",
	cancelText = "Cancel",
	confirmColor = "green",
	cancelColor = "red",
	once = true,
}) => {
	const container = createDiv();
	const confirmBtn = Button({
		onClick: onConfirm,
		text: confirmText,
		color: confirmColor,
		once,
	});
	const cancelBtn = Button({
		onClick: onClose,
		text: cancelText,
		color: cancelColor,
		once: true,
	});
	container.classList.add("btns");
	container.append(confirmBtn, cancelBtn);
	return container;
};
