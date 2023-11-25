import { createInput } from "../../utils/dom";
import { LIST_ITEM_LENGTH } from "../../constants";

export default ({
	value = "",
	placeholder = "",
	required = false,
	maxLength = LIST_ITEM_LENGTH.MAX,
}) => {
	const nameInput = createInput();
	nameInput.type = "text";
	nameInput.name = "name";
	nameInput.value = value;
	nameInput.placeholder = placeholder;
	nameInput.maxLength = maxLength;
	nameInput.required = required;
	return nameInput;
};
