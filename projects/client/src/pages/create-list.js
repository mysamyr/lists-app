import { getListData, getListItems, getParentData } from "../store";
import { navigate, navigateBack } from "../utils/navigator";
import { URLS } from "../constants";
import {
	NOT_UNIQUE_NAME,
	PROVIDE_ALL_CREATION_DATA,
} from "../constants/errors";
import Header from "../components/Header";
import {
	createForm,
	createHeader2,
	createInput,
	createLabel,
	createParagraph,
	createSpan,
} from "../utils/dom";
import {
	determineInputType,
	getInputsFromForm,
	showError,
} from "../utils/helpers";
import { getRequest, postRequest } from "../api";
import { validateCreateListItemForm, validateName } from "../utils/validators";
import NameInput from "../components/inputs/NameInput";
import Select from "../components/inputs/Select";
import Buttons from "../components/buttons/Buttons";

const onSaveList = async () => {
	const parentData = getParentData();
	const listItems = getListItems();
	const form = document.querySelector("form");
	const formData = getInputsFromForm(form);
	if (listItems.find((i) => formData.name === i.name && i.config)) {
		return showError(NOT_UNIQUE_NAME);
	}
	if (!formData.name || !formData.config) {
		return showError(PROVIDE_ALL_CREATION_DATA);
	}
	const err = validateName(formData.name);
	if (err) {
		return showError(err);
	}
	if (parentData) {
		await postRequest(URLS.CREATE_NEW_LIST_ITEM_$(parentData.id), formData);
		return navigateBack();
	}
	await postRequest(URLS.CREATE_NEW_ENTRY_LIST, formData);
	return navigate();
};

const onSaveListItem = async () => {
	const parentData = getParentData();
	const form = document.querySelector("form");
	const formData = getInputsFromForm(form);
	const { error, data } = validateCreateListItemForm(
		formData,
		parentData.config.fields,
		getListItems(),
	);
	if (error) {
		return showError(error);
	}
	await postRequest(URLS.CREATE_NEW_LIST_ITEM_$(parentData.id), data);
	return navigateBack();
};

const getConfigs = async () => {
	const configs = await getRequest(URLS.GET_CONFIGS);
	if (!configs?.length) {
		const text = createParagraph();
		text.innerText = "Please create config first.";
		return text;
	}
	return Select({
		name: "config",
		options: configs,
		required: true,
	});
};

const getCreateListForm = async () => {
	const form = createForm();
	form.classList.add("create-form", "column");
	const nameHeader = createHeader2();
	nameHeader.innerText = "Insert name:";
	const configHeader = createHeader2();
	configHeader.innerText = "Select config:";
	form.classList.add("create-form", "column");
	form.append(
		nameHeader,
		NameInput({
			placeholder: "List's name",
			required: true,
		}),
		configHeader,
		await getConfigs(),
		Buttons({
			onConfirm: onSaveList,
			onClose: navigateBack,
			confirmText: "Save",
			once: false,
		}),
	);
	form.addEventListener("submit", (e) => {
		e.preventDefault();
		return onSaveList();
	});
	return form;
};

const getCreateListItemForm = () => {
	const parentData = getParentData();
	const form = createForm();
	form.classList.add("create-form", "column");
	const header = createHeader2();
	header.innerText = `Create a list item for ${parentData.name}`;
	const inputs = parentData.config.fields.map((i) => {
		const type = determineInputType(i.type);
		if (type === "checkbox") {
			const label = createLabel();
			const input = createInput();
			input.type = type;
			input.name = i.name;
			input.value = true;
			const span = createSpan();
			span.innerText = i.description;
			label.appendChild(input);
			label.appendChild(span);
			return label;
		} else {
			const input = createInput();
			input.type = type;
			input.name = i.name;
			input.placeholder = i.description;
			return input;
		}
	});
	form.append(
		header,
		...inputs,
		Buttons({
			onConfirm: onSaveListItem,
			onClose: navigateBack,
			confirmText: "Save",
			once: false,
		}),
	);
	form.addEventListener("submit", (e) => {
		e.preventDefault();
		return onSaveListItem();
	});
	return form;
};

export default async () => {
	const { type } = getListData();
	const body = document.querySelector("body");
	body.innerText = "";
	body.append(
		Header("ListerApp", true),
		type === "list" ? await getCreateListForm() : getCreateListItemForm(),
	);
	document.querySelector("input")?.focus();
};
