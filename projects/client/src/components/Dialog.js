import { createDialog } from "../utils/elements";
import { handleDialogClose } from "../utils/helpers";

export default (container) => {
	const dialog = createDialog();
	dialog.classList.add("column");
	container.appendChild(dialog);
	handleDialogClose();
};
