import { API_URL } from "../../env.json";
import { showError } from "../utils/helpers";

const catchFunc = (e) => showError(e.message);
const handleResponse = async (data) => {
	if (!data.ok) {
		const json = await data.json();
		throw new Error(json.message);
	}
};
const handleJSONResponse = async (data) => {
	const json = await data.json();
	if (!data.ok) throw new Error(json.error);
	return json;
};

export const getRequest = async (url) =>
	fetch(API_URL + url, { method: "GET", cache: "no-cache" })
		.then(handleJSONResponse)
		.catch(catchFunc);

export const postRequest = async (url, body) =>
	fetch(API_URL + url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	})
		.then(handleResponse)
		.catch(catchFunc);

export const putRequest = async (url, body) =>
	fetch(API_URL + url, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	})
		.then(handleResponse)
		.catch(catchFunc);

export const deleteRequest = async (url) =>
	fetch(API_URL + url, { method: "DELETE" })
		.then(handleResponse)
		.catch(catchFunc);
