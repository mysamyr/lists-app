const MIN_LENGTH = 3;
const MAX_LENGTH = 50;
const URLS = {
	HOME: "/",
	LIST_PAGE_$(id) {
		return `/list-page/${id}`;
	},
	GET_$(id) {
		return `/list/${id}`;
	},
	CREATE_$(id) {
		return `/list/${id}`;
	},
	UPDATE_$(listId, id) {
		return `/list/${listId}/item/${id}`;
	},
	DELETE_$(listId, id) {
		return `/list/${listId}/item/${id}`;
	},
	PRINT_$(id) {
		return `/print-list/${id}`;
	},
};

async function getRequest(url, func) {
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

async function postRequest(url, body, func) {
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

async function putRequest(url, body, func) {
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

async function deleteRequest(url, func) {
	return fetch(url, { method: "DELETE" })
		.then(func)
		.catch(function (e) {
			logError(e.message);
			alert(e.message);
		});
}

function sortByValue(arr, key = "name") {
	return arr.sort(function (x, y) {
		if (x[key] < y[key]) return -1;
		if (x[key] > y[key]) return 1;
		return 0;
	});
}

function getView(data, schema) {
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

function logError(msg) {
	// eslint-disable-next-line no-console
	console.error(msg);
}

function validateName(name, oldName) {
	if (!name || name.length < MIN_LENGTH || name.length > MAX_LENGTH) {
		return `Назва має включати від ${MIN_LENGTH} до ${MAX_LENGTH} символів`;
	}
	if (oldName && name === oldName) {
		return "Новий елемент не змінився";
	}
}

function validateCreationInputs(inputs, fields) {
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

function getInputsFromForm(form) {
	const inputs = {};
	for (let e of form.elements) {
		if (e.nodeName === "INPUT") {
			inputs[e.name] = e.value;
		}
	}
	return inputs;
}

window.addEventListener("DOMContentLoaded", async function () {
	const listId = location.pathname.split("/")[2];
	const body = document.querySelector("body");
	let store;
	await getRequest(URLS.GET_$(listId), async function (res) {
		const listData = await res.json();
		const { name, type, data, view, sort } = listData;
		store = listData;

		const content = sortByValue(data, sort).map(function (i) {
			const listItemView = getView(i, view);
			const listItemClass = i.complete ? "completed" : "";
			return `<li data-id="${i.id}"><span class="${listItemClass}">${listItemView}</span><div><span id="edit" class="icon">~</span><span id="delete" class="icon">&times;</span></div></li>`;
		});

		const btns =
			type === 3 && content.length
				? `<div class="btns margin-bottom"><a href="${URLS.PRINT_$(
						listId,
				  )}" class="btn">Показати стисло</a></div>`
				: `<div class="margin-bottom"></div>`;

		body.innerHTML = `<div class="row"><h1>${name}</h1><a href="${
			URLS.HOME
		}" class="btn">Назад</a></div>
				${content.length ? `<ul>${content.join("\n")}</ul>` : "<p>Список пустий</p>"}
				${btns}
				<div class="add-item">+</div>
				<dialog></dialog>`;
	});

	const listItems = document.querySelectorAll("li");
	const dialog = document.querySelector("dialog");
	const addItemBtn = document.querySelector(".add-item");

	function closeDialog() {
		dialog.innerHTML = "";
		dialog.close();
	}

	function renderDetails({ item, fields }) {
		const lines = fields.map(function ({ name, description, postfix }) {
			const buttons =
				name === "count"
					? `<div class="btns">
      <div id="dec" class="btn red">-</div>
      <div id="inc" class="btn green">+</div>
    </div>`
					: "";
			return `<p>${description}: <b id="${name}">${item[name]}${
				postfix || ""
			}</b></p>${buttons}`;
		});
		return `
		<div class="details">
			${lines.join("\n")}
		</div>
    <div id="close" class="btn">Закрити</div>`;
	}

	function renderCreationForm(fields) {
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

	async function saveListItem() {
		const form = document.querySelector("form");
		let creationData;
		switch (store.type) {
			case 1:
				const messageErr = validateName(form.name.value);
				if (messageErr) return alert(messageErr);
				creationData = { name: form.name.value };
				break;
			case 2:
				const todoNameErr = validateName(form.name.value);
				if (todoNameErr) return alert(todoNameErr);
				creationData = { name: form.name.value, complete: false };
				break;
			case 3:
				const inputs = getInputsFromForm(form);
				const { data, error } = validateCreationInputs(inputs, store.fields);
				if (error) return alert(error);
				creationData = data;
				break;
		}

		await postRequest(
			URLS.CREATE_$(listId),
			creationData,
			async function (data) {
				if (!data.ok) {
					const res = await data.json();
					throw new Error(res.error);
				}
				closeDialog();
				location.href = URLS.LIST_PAGE_$(listId);
			},
		);
	}

	async function renameListItem(id, oldName) {
		const name = document.querySelector("input");
		const error = validateName(name.value, oldName);
		if (error) return alert(error);
		await putRequest(
			URLS.UPDATE_$(listId, id),
			{ name: name.value },
			async function (data) {
				if (!data.ok) {
					const res = await data.json();
					throw new Error(res.error);
				}
				location.href = URLS.LIST_PAGE_$(listId);
			},
		);
	}

	async function deleteListItem(id) {
		await deleteRequest(URLS.DELETE_$(listId, id), async function (data) {
			if (!data.ok) {
				const res = await data.json();
				throw new Error(res.error);
			}
			location.href = URLS.LIST_PAGE_$(listId);
		});
	}

	async function markListItemDone(id, completed) {
		await putRequest(
			URLS.UPDATE_$(listId, id),
			{ complete: !completed },
			async function (data) {
				if (!data.ok) {
					const res = await data.json();
					throw new Error(res.error);
				}
				location.href = URLS.LIST_PAGE_$(listId);
			},
		);
	}

	async function changeCount(item, isAdd) {
		const countElement = document.getElementById("count");
		const count = item.count;
		const newCount = isAdd ? count + 1 : count - 1;

		if (newCount < 0) return alert("Кількість не може бути від'ємною!");
		await putRequest(
			URLS.UPDATE_$(listId, item.id),
			{ count: newCount },
			async function (data) {
				if (!data.ok) {
					const res = await data.json();
					throw new Error(res.error);
				}
				countElement.innerText = `${newCount}`;
				item.count = newCount;
			},
		);
	}

	async function openDetails(item, fields) {
		dialog.innerHTML = renderDetails({ item, fields });
		const closeBtn = document.getElementById("close");
		const decBtn = document.getElementById("dec");
		const incBtn = document.getElementById("inc");
		closeBtn.addEventListener("click", function () {
			closeDialog();
		});
		if (decBtn && incBtn) {
			decBtn.addEventListener("click", async function () {
				await changeCount(item, false);
			});
			incBtn.addEventListener("click", async function () {
				await changeCount(item, true);
			});
		}
		dialog.showModal();
	}

	async function openCreation() {
		if (store.type === 3) {
			dialog.innerHTML = renderCreationForm(store.fields);
		} else {
			dialog.innerHTML = `
				<form class="modal-form">
					<input name="name" type="text" placeholder="Введіть текст">
					<div class="btns">
						<div class="btn green">Зберегти</div>
						<div class="btn red">Скасувати</div>
					</div>
				</form>`;
		}
		const [saveBtn, closeBtn] = document.querySelectorAll("dialog .btn");
		saveBtn.addEventListener("click", saveListItem);
		closeBtn.addEventListener("click", function () {
			closeDialog();
		});
		document.querySelector("form").addEventListener("keydown", function (e) {
			if (e.code === "Enter" && dialog.open) saveListItem();
		});
		dialog.showModal();
	}

	async function openRename(id, oldName) {
		dialog.innerHTML = `
    <form class="modal-form">
      <input type="text" maxlength="${MAX_LENGTH}" value="${oldName}">
      <div class="btns">
        <div class="btn green">Зберегти</div>
        <div class="btn red">Скасувати</div>
      </div>
    </form>`;
		const [saveBtn, closeBtn] = document.querySelectorAll("dialog .btn");
		saveBtn.addEventListener("click", async function () {
			return renameListItem(id, oldName);
		});
		closeBtn.addEventListener("click", function () {
			closeDialog();
		});
		document.querySelector("form").addEventListener("keydown", function (e) {
			if (e.code === "Enter" && dialog.open) {
				return renameListItem(id, oldName);
			}
		});
		dialog.showModal();
	}

	async function openDelete(id, name) {
		dialog.innerHTML = `
    <form class="modal-form">
      <p>Справді видалити ${name}?</p>
      <div class="btns">
        <div class="btn red">Видалити</div>
        <div class="btn green">Скасувати</div>
      </div>
    </form>`;
		const [saveBtn, closeBtn] = document.querySelectorAll("dialog .btn");
		saveBtn.addEventListener("click", async function () {
			return deleteListItem(id);
		});
		closeBtn.addEventListener("click", function () {
			closeDialog();
		});
		dialog.showModal();
	}

	listItems.forEach(function (listItem) {
		listItem.addEventListener("click", async function (e) {
			const id = listItem.dataset.id;
			const item = store.data.find(function (i) {
				return i.id === id;
			});
			if (e.target.id === "edit") {
				return await openRename(id, item.name);
			}
			if (e.target.id === "delete") {
				return await openDelete(id, item.name);
			}
			switch (store.type) {
				case 2:
					return markListItemDone(id, item.complete);
				case 3:
					return openDetails(item, store.fields);
			}
		});
	});
	addItemBtn.addEventListener("click", async function () {
		await openCreation();
	});
	dialog.addEventListener("click", function (e) {
		const dialogDimensions = dialog.getBoundingClientRect();
		if (
			dialog.open &&
			(e.clientX < dialogDimensions.left ||
				e.clientX > dialogDimensions.right ||
				e.clientY < dialogDimensions.top ||
				e.clientY > dialogDimensions.bottom)
		) {
			closeDialog();
		}
	});
	dialog.addEventListener("keydown", function (e) {
		if (e.code === "Escape" && dialog.open) closeDialog();
		if (e.code === "Enter" && dialog.open) e.preventDefault();
	});
});
