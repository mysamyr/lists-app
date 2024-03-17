import { API_URL } from "../../env.json";
import { getValue, removeValue, setValue } from "../utils/local-storage";
import { showError } from "../utils/helpers";
import { URLS } from "../constants";

const catchFunc = (e) => showError(e.message);

const getAuthHeader = () => {
	const token = getValue("token");
	if (!token) return {};
	return { Authorization: `Bearer ${token}` };
};

const refreshTokens = async (url, options) => {
	await fetch(API_URL + URLS.REFRESH, {
		method: "GET",
		credentials: "include",
	})
		.then(handleResponse)
		.then(({ accessToken }) => {
			setValue("token", accessToken);
		})
		.catch(() => {
			removeValue("token");
			throw new Error("Invalid session");
		});

	return fetch(url, {
		...options,
		headers: { ...options.headers, ...getAuthHeader() },
	}).then(handleResponse);
};

const handleResponse = async (data, url, options, retry = false) => {
	if (
		data.status === 403 &&
		retry &&
		![URLS.SIGNIN, URLS.SIGNUP].includes(url)
	) {
		return await refreshTokens(url, options);
	}
	const json = await data.json().catch(() => null);
	if (!data.ok) {
		throw new Error(json.message);
	}
	if (json) {
		return json;
	}
};

export const getRequest = async (path) => {
	const url = API_URL + path;
	const options = {
		method: "GET",
		cache: "no-cache",
		credentials: "include",
		headers: {
			...getAuthHeader(),
		},
	};
	return fetch(url, options)
		.then((data) => handleResponse(data, url, options, true))
		.catch(catchFunc);
};

export const postRequest = async (path, body) => {
	const url = API_URL + path;
	const options = {
		method: "POST",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			...getAuthHeader(),
		},
		body: JSON.stringify(body),
	};
	return fetch(url, options)
		.then((data) => handleResponse(data, url, options, true))
		.catch(catchFunc);
};

export const putRequest = async (path, body) => {
	const url = API_URL + path;
	const options = {
		method: "PUT",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			...getAuthHeader(),
		},
		body: JSON.stringify(body),
	};
	return fetch(url, options)
		.then((data) => handleResponse(data, url, options, true))
		.catch(catchFunc);
};

export const deleteRequest = async (path) => {
	const url = API_URL + path;
	const options = {
		method: "DELETE",
		credentials: "include",
		headers: {
			...getAuthHeader(),
		},
	};
	return fetch(url, options)
		.then((data) => handleResponse(data, url, options, true))
		.catch(catchFunc);
};
