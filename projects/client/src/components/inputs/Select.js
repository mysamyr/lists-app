import { createOption, createSelect } from "../../utils/elements";

export default ({ name, required = false, options = [] }) => {
	const select = createSelect();
	select.name = name;
	select.required = required;
	options.forEach((i, idx) => {
		const option = createOption();
		option.innerText = i.name;
		option.value = i.id;
		if (!idx) option.selected = true;
		select.appendChild(option);
	});
	return select;
};
