import { URLS } from "../constants";

export default () => {
	const body = document.querySelector("body");
	body.innerText = "";
	body.innerHTML = `<h1>Page doesn't exist. </h1><a href="${URLS.LISTS}">Go home</a>`;
};
