import {
	createForm,
	createInput,
	createLabel,
	createParagraph,
	createSpan,
} from "../../utils/dom";
import Buttons from "../buttons/Buttons";
import { getRequest } from "../../api";
import { URLS } from "../../constants";

const getDestinationRadio = ({ id, name, checked, lvl }) => {
	const label = createLabel();
	const input = createInput();
	const span = createSpan();
	input.name = "destination";
	input.type = "radio";
	input.value = id;
	input.checked = checked;
	span.innerText = name;
	label.appendChild(input);
	label.appendChild(span);
	label.style.marginLeft = lvl * 20 + "px";
	return label;
};

const unwrapTree = (tree, res = [], lvl = 1) => {
	tree.forEach((i) => {
		res.push(getDestinationRadio({ id: i.id, name: i.name, lvl }));
		if (i.children) {
			res.push(...unwrapTree(i.children, res, lvl + 1));
		}
	});
	return res;
};

const getListsTree = async () => {
	const lists = await getRequest(URLS.GET_LISTS_TREE);
	const rootInput = getDestinationRadio({
		id: "",
		name: "root",
		checked: true,
	});
	return [rootInput, ...unwrapTree(lists)];
};

export default async (onConfirm) => {
	const dialog = document.querySelector("dialog");
	const form = createForm();
	form.classList.add("dialog-modal");
	const header = createParagraph();
	header.innerText = "Select list to move to:";
	form.append(
		header,
		...(await getListsTree()),
		Buttons({ confirmText: "Select", onConfirm, once: false }),
	);

	dialog.appendChild(form);
	dialog.classList.add("modal");
	dialog.showModal();
};
