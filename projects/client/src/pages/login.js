import { setValue } from "../utils/local-storage";
import { navigate } from "../utils/navigator";
import { URLS } from "../constants";
import { createDiv, onPressClick } from "../utils/dom";

export default () => {
	const body = document.querySelector("body");
	body.innerText = "";
	const container = createDiv();
	container.innerText = "Login";
	container.classList.add("btn");
	onPressClick(
		container,
		() => {
			setValue("session", "test session");
			return navigate(URLS.LISTS);
		},
		{ once: true },
	);
	body.appendChild(container);
	// todo render login form
};
