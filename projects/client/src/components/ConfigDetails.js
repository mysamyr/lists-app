import { createDiv, createParagraph, createSpan } from "../utils/dom";

const getField = (field) => {
	const container = createDiv();
	const row1 = createDiv();
	row1.classList.add("row");
	const description = createParagraph();
	description.innerText = field.description + " - ";
	const type = createParagraph();
	type.innerText = field.type;
	row1.append(description, type);
	// todo also optional (for bool)
	const row2 = createDiv();
	row2.classList.add("row");
	const min = createSpan();
	min.innerText = field.min + "-";
	const max = createSpan();
	max.innerText = field.max;
	row2.append(min, max);
	container.append(row1, row2);
	if (field.prefix || field.postfix) {
		const row3 = createDiv();
		row3.classList.add("row");
		if (field.prefix) {
			const prefix = createSpan();
			prefix.innerText = `Pre: ${field.prefix}`;
			row3.appendChild(prefix);
		}
		if (field.postfix) {
			const postfix = createSpan();
			postfix.innerText = `Post: ${field.postfix}`;
			row3.appendChild(postfix);
		}
		container.appendChild(row3);
	}
	return container;
};

export default (data) => {
	const container = createDiv();
	container.classList.add("column", "gap");
	const config = [
		{
			key: "Name",
			value: data.name,
		},
		{
			key: "Sort",
			value: data.sort,
		},
		{
			key: "View",
			value: data.view,
		},
		{
			key: "Fields",
			value: data.fields.map(getField),
		},
	];
	const fields = config.map(({ key, value }) => {
		const item = createDiv();
		item.classList.add("row");
		const header = createSpan();
		header.innerText = `${key}:`;
		item.appendChild(header);
		if (key === "Fields") {
			item.append(...value);
		} else {
			const text = createSpan();
			text.innerText = value;
			item.appendChild(text);
		}
		return item;
	});
	container.append(...fields);
	return container;
};
