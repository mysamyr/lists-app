import { FIELD_TYPES } from "../constants";
import { onPressClick, onKeyPress } from "./dom";

export const sortByValue = (arr, key = "name", dir = "asc") => {
	const [lists, listItems] = arr.reduce(
		(acc, i) => {
			if (i.config) {
				acc[0].push(i);
			} else {
				acc[1].push(i);
			}
			return acc;
		},
		[[], []],
	);
	lists.sort((x, y) => x.name.localeCompare(y.name));
	listItems.sort((x, y) => {
		if (typeof x[key] === "string" && typeof y[key] === "string") {
			return x[key].localeCompare(y[key]);
		}
		return x[key] - y[key];
	});
	if (dir === "desc") {
		if (key === "name") {
			lists.reverse();
		}
		listItems.reverse();
	}
	return [...lists, ...listItems];
};

export const getView = (data, schema) => {
	if (!schema) return data.name;
	let result = "";
	let field = null;
	for (let l of schema) {
		if (field !== null && l !== "}") {
			field += l;
		} else {
			if (l === "{") {
				field = "";
			} else if (l === "}") {
				result += data[field];
				field = null;
			} else {
				result += l;
			}
		}
	}
	return result;
};

export const closeDialog = () => {
	const dialog = document.querySelector("dialog");
	dialog.innerText = "";
	dialog.close();
};

export const determineInputType = (type) => {
	switch (type) {
		case FIELD_TYPES.BOOLEAN:
			return "checkbox";
		case FIELD_TYPES.STRING:
			return "text";
		case FIELD_TYPES.NUMBER:
			return "number";
	}
};

export const getInputsFromForm = (form) => {
	const inputs = {};
	for (let e of form.elements) {
		if (e.nodeName === "INPUT") {
			switch (e.type) {
				case "text":
					inputs[e.name] = e.value.trim();
					break;
				case "number":
					inputs[e.name] = e.value || 0;
					break;
				case "select-one":
					inputs[e.name] = e.value;
					break;
				case "checkbox":
					inputs[e.name] = e.checked;
					break;
				case "radio":
					if (e.checked) {
						inputs[e.name] = e.value;
					}
					break;
			}
		}
		if (e.nodeName === "SELECT") {
			switch (e.type) {
				case "select-one":
					inputs[e.name] = e.value;
					break;
			}
		}
	}
	return inputs;
};

export const handleDialogClose = () => {
	const dialog = document.querySelector("dialog");
	onPressClick(dialog, (e) => {
		const dialogDimensions = dialog.getBoundingClientRect();
		if (
			dialog.open &&
			(e.clientX < dialogDimensions.left ||
				e.clientX > dialogDimensions.right ||
				e.clientY < dialogDimensions.top ||
				e.clientY > dialogDimensions.bottom)
		) {
			dialog.classList.remove("sidebar");
			closeDialog();
		}
	});
	onKeyPress(dialog, (e) => {
		if (e.code === "Escape" && dialog.open) closeDialog();
		if (e.code === "Enter" && dialog.open) e.preventDefault();
	});
};

export const getQueryStringObject = (url = window.location.search) =>
	new Proxy(new URLSearchParams(url), {
		get: (searchParams, prop) => searchParams.get(prop),
	});

export const showError = (msg) => {
	// eslint-disable-next-line no-console
	console.error(msg);
	alert(msg);
};
