import { createDialog } from "../utils/dom";
import { handleDialogClose } from "../utils/helpers";

export default (container) => {
	const dialog = createDialog();
	dialog.classList.add("column");
	container.appendChild(dialog);
	handleDialogClose();
};
