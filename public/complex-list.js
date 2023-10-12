const NAME_MIN_LENGTH = 3;
const NAME_MAX_LENGTH = 50;

window.addEventListener("DOMContentLoaded", function () {
	const listId = location.pathname.split("/")[2];
	const list = document.querySelectorAll("li");
	const dialog = document.querySelector("dialog");
	const addItemBtn = document.querySelector(".add-item");

	function closeDialog() {
		dialog.innerHTML = "";
		dialog.close();
	}

	function logError(msg) {
		// eslint-disable-next-line no-console
		console.error(msg);
	}

	function validateName(name, oldName) {
		if (
			!name ||
			name.length < NAME_MIN_LENGTH ||
			name.length > NAME_MAX_LENGTH
		) {
			return `Назва має включати від ${NAME_MIN_LENGTH} до ${NAME_MAX_LENGTH} символів`;
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

	function renderDetails({ item, fields }) {
		const lines = fields.map(({ name, description, postfix }) => {
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
			.map(
				({ name, description, type }) => `
        <input name="${name}" type="${
					type === "string" ? "text" : "number"
				}" placeholder="${description}">
    `,
			)
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

	async function saveListItem(details) {
		const form = document.querySelector("form");
		const inputs = getInputsFromForm(form);
		const { data, error } = validateCreationInputs(inputs, details);
		if (error) return alert(error);
		await fetch(`/list/${listId}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		})
			.then(async function (data) {
				if (!data.ok) {
					const res = await data.json();
					throw new Error(res.error);
				}
				closeDialog();
				location.href = `/list/${listId}`;
			})
			.catch(function (e) {
				logError(e.message);
				alert(e.message);
			});
	}

	async function renameListItem(id, oldName) {
		const name = document.querySelector("input");
		const error = validateName(name.value, oldName);
		if (error) return alert(error);
		await fetch(`/list/${listId}/item/${id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ name: name.value }),
		})
			.then(async function (data) {
				if (!data.ok) {
					const res = await data.json();
					throw new Error(res.error);
				}
				closeDialog();
				location.href = `/list/${listId}`;
			})
			.catch(function (e) {
				logError(e.message);
				alert(e.message);
			});
	}

	async function deleteListItem(id) {
		await fetch(`/list/${listId}/item/${id}`, { method: "DELETE" })
			.then(async function (data) {
				if (!data.ok) {
					const res = await data.json();
					throw new Error(res.error);
				}
				location.href = `/list/${listId}`;
			})
			.catch(function (e) {
				logError(e.message);
				alert(e.message);
			});
		closeDialog();
	}

	async function changeCount(id, isAdd) {
		const countElement = document.getElementById("count");
		const count = +countElement.innerText;
		const newCount = isAdd ? count + 1 : count - 1;

		if (newCount < 0) return alert("Кількість не може бути від'ємною!");
		await fetch(`/list/${listId}/item/${id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ count: newCount }),
		})
			.then(async function (data) {
				if (!data.ok) {
					const res = await data.json();
					throw new Error(res.error);
				}
				countElement.innerText = `${newCount}`;
			})
			.catch(function (e) {
				logError(e.message);
				alert(e.message);
			});
	}

	async function openDetails(id) {
		await fetch(`/list/${listId}/item/${id}`)
			.then(function (data) {
				return data.json();
			})
			.then(function (details) {
				if (details.error) {
					throw new Error(details.error);
				}
				dialog.innerHTML = renderDetails(details);
				const closeBtn = document.getElementById("close");
				const decBtn = document.getElementById("dec");
				const incBtn = document.getElementById("inc");
				closeBtn.addEventListener("click", function () {
					closeDialog();
				});
				if (decBtn && incBtn) {
					decBtn.addEventListener("click", async function () {
						await changeCount(details.item.id, false);
					});
					incBtn.addEventListener("click", async function () {
						await changeCount(details.item.id, true);
					});
				}
				dialog.showModal();
			})
			.catch(function (e) {
				logError(e.message);
				alert(e.message);
			});
	}

	async function openCreation() {
		await fetch(`/list/${listId}/fields`)
			.then(function (data) {
				return data.json();
			})
			.then(function (details) {
				if (details.error) {
					throw new Error(details.error);
				}
				dialog.innerHTML = renderCreationForm(details);
				const [saveBtn, closeBtn] = document.querySelectorAll("dialog .btn");
				saveBtn.addEventListener("click", async function () {
					return saveListItem(details);
				});
				closeBtn.addEventListener("click", function () {
					closeDialog();
				});
				document
					.querySelector("form")
					.addEventListener("keydown", function (e) {
						if (e.code === "Enter" && dialog.open) saveListItem(details);
					});
				dialog.showModal();
			})
			.catch(function (e) {
				logError(e.message);
				alert(e.message);
			});
	}

	async function openRename(id, oldName) {
		dialog.innerHTML = `
    <form class="modal-form">
      <input type="text" maxlength="${NAME_MAX_LENGTH}" value="${oldName}">
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

	list.forEach(function (listItem) {
		listItem.addEventListener("click", async function (e) {
			const { id, name } = listItem.dataset;
			if (e.target.id === "edit") {
				return await openRename(id, name);
			}
			if (e.target.id === "delete") {
				return await openDelete(id, name);
			}
			return await openDetails(id);
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
