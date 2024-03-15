import { getBreadcrumbs, popBreadcrumbs } from "../store";
import { URLS } from "../constants";
import { navigate } from "../utils/navigator";
import { createDiv, createParagraph, onPressClick } from "../utils/dom";

const onClickBreadcrumbsLink = async (e, id) => {
	e.preventDefault();
	const breadcrumbs = getBreadcrumbs();
	const activeListIdx = breadcrumbs.findIndex((i) => id === i.id);
	if (activeListIdx < 0) {
		return navigate();
	}
	for (let i = 0; i < breadcrumbs.length - activeListIdx; i++) {
		popBreadcrumbs();
	}
	const url = URLS.GET_LIST_DETAILS_$(id);
	return navigate(url);
};

const Link = ({ name = "Home", id, isActive = false }) => {
	const link = createParagraph();
	name = name.length < 8 ? name : name.slice(0, 7) + "...";
	if (!isActive) {
		onPressClick(link, (e) => onClickBreadcrumbsLink(e, id), { once: true });
	}
	link.innerHTML = isActive ? `<b>${name}</b>` : name;
	return link;
};

export default () => {
	const breadcrumbsStack = getBreadcrumbs();
	const row = createDiv();
	row.classList.add("row", "breadcrumbs");
	row.appendChild(
		Link({
			isActive: !breadcrumbsStack.length,
		}),
	);
	breadcrumbsStack.forEach((item, idx) => {
		const separator = createParagraph();
		separator.innerHTML = "&#65125;";
		row.appendChild(separator);
		row.appendChild(
			Link({
				name: item.name,
				id: item.id,
				isActive: idx === breadcrumbsStack.length - 1,
			}),
		);
	});

	return row;
};
