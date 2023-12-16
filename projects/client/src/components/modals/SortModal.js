import { closeDialog, getButtons, sortByValue } from "../../utils/helpers";
import { getListData, getListItems } from "../../store";
import List from "../List";
import {
	createForm,
	createHr,
	createInput,
	createLabel,
	createSpan,
} from "../../utils/elements";
import { setQueryParams } from "../../utils/navigator";

const getFieldOptions = (fields, sort) =>
	fields.map((f) => {
		const label = createLabel();
		const input = createInput();
		const span = createSpan();
		input.name = "field";
		input.type = "radio";
		input.value = f.name;
		if (sort === f.name) {
			input.checked = true;
		}
		span.innerText = f.description;
		label.appendChild(input);
		label.appendChild(span);
		return label;
	});
const getDirectionOptions = (direction) => {
	const directionConfig = [
		{
			value: "asc",
			text: "ASC",
		},
		{
			value: "desc",
			text: "DESC",
		},
	];
	return directionConfig.map((i) => {
		const label = createLabel();
		const input = createInput();
		const span = createSpan();
		input.name = "direction";
		input.type = "radio";
		input.value = i.value;
		if (direction === i.value) {
			input.checked = true;
		}
		span.innerText = i.text;
		label.appendChild(input);
		label.appendChild(span);

		return label;
	});
};

const onConfirm = () => {
	const data = getListItems();
	const config = getListData().config;

	const form = document.querySelector("form");
	const sort = form.field?.value;
	const direction = form.direction.value;

	setQueryParams({ sort, direction });

	if (!data.length) return;

	const sortedData = sortByValue(data, sort, direction);
	const ul = document.querySelector("ul");
	const list = List(sortedData, config.view, ul);
	ul.parentNode.replaceChild(list, ul);

	closeDialog();
};

export default ({ fields, sort = "name", direction }) => {
	const dialog = document.querySelector("dialog");
	const form = createForm();
	form.classList.add("dialog-modal");
	form.append(
		...getFieldOptions(fields, sort),
		createHr(),
		...getDirectionOptions(direction),
		getButtons({ onConfirm }),
	);

	dialog.appendChild(form);
	dialog.showModal();
};
