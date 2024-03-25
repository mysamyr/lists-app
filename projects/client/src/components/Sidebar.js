import { createDiv, onPressClick } from "../utils/dom";
import Button from "./buttons/Button";
import { navigate } from "../utils/navigator";
import { URLS } from "../constants";
import { removeValue } from "../utils/local-storage";

const closeSidebar = () => {
	const sidebar = document.querySelector(".sidebar");
	const backdrop = document.querySelector(".sidebar-backdrop");
	backdrop.remove();
	sidebar.classList.replace("slide-in", "slide-out");
	setTimeout(() => sidebar.remove(), 450);
};

const renderMenuOptions = () => {
	const activePage = history.state.path;
	const links = [
		{
			text: "Lists",
			url: URLS.LISTS,
		},
		{
			text: "Configs",
			url: URLS.CONFIGS,
		},
		{
			text: "Logout",
			url: URLS.LOGIN,
			fn: () => {
				removeValue("token");
			},
			color: "red",
		},
	];
	return links.map(({ text, url, fn, color }) => {
		const isActive = activePage === url;

		return Button({
			onClick: () => {
				if (!isActive) {
					fn && fn();
					return navigate(url);
				} else {
					closeSidebar();
				}
			},
			text,
			color,
		});
	});
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
	onPressClick(backdrop, () => closeSidebar(), { once: true });
	document.querySelector("body").append(backdrop, sidebar);
};
