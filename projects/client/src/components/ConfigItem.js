import { createListItem, createSpan } from "../utils/elements";
import { URLS } from "../constants";
import { navigate } from "../utils/navigator";

const onClickItem = async (id) => navigate(URLS.GET_CONFIG_DETAILS(id));

// todo add buttons

export default (data) => {
	const listItem = createListItem();
	listItem.classList.add("list");
	const text = createSpan();
	text.innerText = data.name;
	listItem.addEventListener("click", () => onClickItem(data.id), {
		once: true,
	});
	listItem.appendChild(text);

	return listItem;
};
