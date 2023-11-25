import { createDiv, onPressClick } from "../utils/dom";
import Button from "./buttons/Button";
import { navigate } from "../utils/navigator";
import { URLS } from "../constants";

const renderMenuOptions = () => {
	const activePage = history.state.path;
	const config = [
		{
			text: "Lists",
			url: URLS.LISTS,
		},
		{
			text: "Configs",
			url: URLS.CONFIGS,
		},
	];
	return config.map(({ text, url }) => {
		const isActive = activePage === url;

		return Button({
			onClick: () => {
				if (!isActive) {
					return navigate(url);
				}
			},
			text,
			color: isActive ? "gray" : "red",
		});
	});
};

const closeSidebar = (sidebar, backdrop) => {
	backdrop.remove();
	sidebar.classList.replace("slide-in", "slide-out");
	setTimeout(() => sidebar.remove(), 775);
};

export default () => {
	const backdrop = createDiv();
	backdrop.classList.add("sidebar-backdrop");
	const sidebar = createDiv();
	sidebar.classList.add("sidebar", "slide-in");
	const container = createDiv();
	container.classList.add("dialog-modal");
	container.append(...renderMenuOptions());
	sidebar.appendChild(container);
	onPressClick(backdrop, () => closeSidebar(sidebar, backdrop), { once: true });
	document.querySelector("body").append(backdrop, sidebar);
};
