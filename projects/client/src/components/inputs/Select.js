import { createOption, createSelect } from "../../utils/elements";

export default ({ name, required = false, options = [] }) => {
	const select = createSelect();
	select.name = name;
	select.required = required;
	options.forEach((i) => {
		const option = createOption();
		option.innerText = i.name;
		option.value = i.id;
		select.appendChild(option);
	});
	return select;
};
