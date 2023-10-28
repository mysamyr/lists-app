import { LIST_ITEM_LENGTH } from "./constants";

export async function getRequest(url, func) {
	return fetch(url, { method: "GET", cache: "no-cache" })
		.then(func)
		.catch(function (e) {
			logError(e.message);
			document.querySelector(
				"body",
			).innerHTML = `<h1>Сталася помилка</h1><a href="/">Обновити</a>`;
			alert(e.message);
		});
}

export async function postRequest(url, body, func) {
	return fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	})
		.then(func)
		.catch(function (e) {
			logError(e.message);
			alert(e.message);
		});
}

export async function putRequest(url, body, func) {
	return fetch(url, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	})
		.then(func)
		.catch(function (e) {
			logError(e.message);
			alert(e.message);
		});
}

export async function deleteRequest(url, func) {
	return fetch(url, { method: "DELETE" })
		.then(func)
		.catch(function (e) {
			logError(e.message);
			alert(e.message);
		});
}

export function sortByValue(arr, key = "name") {
	return arr.sort(function (x, y) {
		if (typeof x[key] === "string" && typeof y[key] === "string") {
			return x[key].localeCompare(y[key]);
		}
		return x[key] - y[key];
	});
}

export function getView(data, schema) {
	if (!schema) return data.name;
	let result = "";
	let field = null;
	for (let l of schema) {
		if (field !== null && l !== "}") {
			field += l;
		} else {
			if (l === "{") {
				field = "";
			} else if (l === "}") {
				result += data[field];
				field = null;
			} else {
				result += l;
			}
		}
	}
	return result;
}

export function logError(msg) {
	// eslint-disable-next-line no-console
	console.error(msg);
}

export function validateName(name, oldName) {
	if (
		!name ||
		name.length < LIST_ITEM_LENGTH.MIN ||
		name.length > LIST_ITEM_LENGTH.MAX
	) {
		return `Назва має включати від ${LIST_ITEM_LENGTH.MIN} до ${LIST_ITEM_LENGTH.MAX} символів`;
	}
	if (oldName && name === oldName) {
		return "Новий елемент не змінився";
	}
}

export function validateCreationInputs(inputs, fields) {
	const data = {};
	for (let { name, description, type, min, max } of fields) {
		let value = inputs[name];
		if (
			type === "string" &&
			(typeof value !== "string" || value.length < min || value.length > max)
		) {
			return {
				error: `Поле ${description} має бути рядком і включати від ${min} до ${max} символів`,
			};
		}
		if (type === "number") {
			value = value === "" ? 0 : +value;
			if (value < min || value > max) {
				return {
					error: `Поле ${description} має бути числом від ${min} до ${max}`,
				};
			}
		}
		data[name] = value;
	}
	return { data };
}

export function getInputsFromForm(form) {
	const inputs = {};
	for (let e of form.elements) {
		if (e.nodeName === "INPUT") {
			inputs[e.name] = e.value;
		}
	}
	return inputs;
}

export function renderDetails({ item, fields }) {
	const lines = fields.map(function ({
		name,
		description,
		prefix = "",
		postfix = "",
	}) {
		const buttons =
			name === "count"
				? `<div class="btns">
      <div id="dec" class="btn red">-</div>
      <div id="inc" class="btn green">+</div>
    </div>`
				: "";
		return `<p>${description}: <b id="${name}">${
			prefix + item[name] + postfix
		}</b></p>${buttons}`;
	});

	return `
		<div class="details">
			${lines.join("\n")}
		</div>
    <div id="close" class="btn">Закрити</div>`;
}

export function renderCreationForm(fields) {
	const inputs = fields
		.map(function ({ name, description, type }) {
			return `
        <input name="${name}" type="${
					type === "string" ? "text" : "number"
				}" placeholder="${description}">`;
		})
		.join("\n");

	return `
    <form class="modal-form">
      ${inputs}
      <div class="btns">
        <div class="btn green">Зберегти</div>
        <div class="btn red">Скасувати</div>
      </div>
    </form>`;
}

export function handleDialogClose(dialog, closeFn) {
	dialog.addEventListener("click", function (e) {
		const dialogDimensions = dialog.getBoundingClientRect();
		if (
			dialog.open &&
			(e.clientX < dialogDimensions.left ||
				e.clientX > dialogDimensions.right ||
				e.clientY < dialogDimensions.top ||
				e.clientY > dialogDimensions.bottom)
		) {
			closeFn();
		}
	});
	dialog.addEventListener("keydown", function (e) {
		if (e.code === "Escape" && dialog.open) closeFn();
		if (e.code === "Enter" && dialog.open) e.preventDefault();
	});
}

export function getSortedList(data, sort, view, direction) {
	const list = sortByValue(data, sort).map(function (i) {
		const listItemView = getView(i, view);
		const listItemClass = i.complete ? "completed" : "";
		return `<li data-id="${i.id}"><span class="${listItemClass}">${listItemView}</span><div><span id="edit" class="icon">~</span><span id="delete" class="icon">&times;</span></div></li>`;
	});
	return direction === "desc" ? list.reverse() : list;
}

export function renderSortOptions({
	type,
	fields,
	sort = "name",
	direction = "asc",
}) {
	const fieldOptions =
		type === 3
			? fields
					.map(function (f, i) {
						return `<label><input name="field" type="radio" value="${f.name}" ${
							sort === f.name ? "checked" : ""
						}>${f.description}</label>${i === fields.length - 1 ? "<hr>" : ""}`;
					})
					.join("")
			: ``;
	const directionOptions = `<label><input name="direction" type="radio" value="asc" ${
		direction === "asc" ? "checked" : ""
	}>А - Я</label>
		<label><input name="direction" type="radio" value="desc" ${
			direction === "desc" ? "checked" : ""
		}>Я - А</label>`;
	const buttons = `<div class="btns">
        <div class="btn green">Застосувати</div>
        <div class="btn red">Скасувати</div>
      </div>`;
	return (
		'<form class="modal-form">' +
		fieldOptions +
		directionOptions +
		buttons +
		"</form>"
	);
}
