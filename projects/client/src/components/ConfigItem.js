import { createListItem, createSpan, onPressClick } from "../utils/dom";
import { URLS } from "../constants";
import { navigate } from "../utils/navigator";

const onClickItem = async (id) => navigate(URLS.GET_CONFIG_DETAILS(id));

// todo add actions

export default (data) => {
	const listItem = createListItem();
	listItem.classList.add("list");
	const text = createSpan();
	text.innerText = data.name;
	onPressClick(listItem, () => onClickItem(data.id), { once: true });
	listItem.appendChild(text);

	return listItem;
};
