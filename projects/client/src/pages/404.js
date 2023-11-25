import { URLS } from "../constants";

export default () => {
	const body = document.querySelector("body");
	body.innerText = "";
	body.innerHTML = `<h1>Unexpected error occured</h1><a href="${URLS.HOME}">Go home</a>`;
};
