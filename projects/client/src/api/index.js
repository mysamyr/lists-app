import { showError } from "../utils/helpers";

const API_URL = "http://localhost:8080";

const catchFunc = (e) => showError(e.message);

export const getRequest = async (url) =>
	fetch(API_URL + url, { method: "GET", cache: "no-cache" })
		.then(async (data) => {
			const json = await data.json();
			if (!data.ok) throw new Error(json.error);
			return json;
		})
		.catch(catchFunc);

export const postRequest = async (url, body) =>
	fetch(API_URL + url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	})
		.then(async (data) => {
			if (!data.ok) {
				const json = await data.json();
				throw new Error(json.error);
			}
		})
		.catch(catchFunc);

export const putRequest = async (url, body) =>
	fetch(API_URL + url, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	})
		.then(async (data) => {
			if (!data.ok) {
				const json = await data.json();
				throw new Error(json.error);
			}
		})
		.catch(catchFunc);

export const deleteRequest = async (url) =>
	fetch(API_URL + url, { method: "DELETE" })
		.then(async (data) => {
			if (!data.ok) {
				const json = await data.json();
				throw new Error(json.error);
			}
		})
		.catch(catchFunc);
