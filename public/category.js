window.addEventListener("DOMContentLoaded", async function () {
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
		if (!name || name.length < 1 || name.length > 50) {
			return "Назва має включати від 0 до 50 символів";
		}
		if (oldName && name === oldName) {
			return "Назва має включати від 0 до 50 символів";
		}
	}

	function validateCreationInputs(inputs, fields) {
		const data = {};
		for (let { field, description, type, min, max } of fields) {
			let value = inputs[field];
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
			data[field] = value;
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
		const lines = fields.map(
			({ field, description, postfix }) =>
				`<p>${description}: <b id="${field}">${item[field]}${
					postfix || ""
				}</b></p>`,
		);
		return `
    ${lines.join("\n")}
    <div class="btns">
      <div class="btn red">-</div>
      <div class="btn green">+</div>
    </div>
    <div class="btn">Закрити</div>`;
	}

	function renderCreationForm(fields) {
		const inputs = fields
			.map(
				({ field, description, type }) => `
        <input name="${field}" type="${
					type === "string" ? "text" : "number"
				}" placeholder="${description}">
    `,
			)
			.join("\n");
		return `
    <form>
      ${inputs}
      <div class="btns">
        <div class="btn green">Зберегти</div>
        <div class="btn red">Скасувати</div>
      </div>
    </form>
    `;
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
				const [decBtn, incBtn, closeBtn] =
					document.querySelectorAll("dialog .btn");
				decBtn.addEventListener("click", async function () {
					await changeCount(details.item.id, false);
				});
				incBtn.addEventListener("click", async function () {
					await changeCount(details.item.id, true);
				});
				closeBtn.addEventListener("click", function () {
					closeDialog();
				});
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
				});
				closeBtn.addEventListener("click", function () {
					closeDialog();
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
    <form>
      <input type="text" max="50" value="${oldName}">
      <div class="btns">
        <div class="btn green">Зберегти</div>
        <div class="btn red">Скасувати</div>
      </div>
    </form>
    `;
		const name = document.querySelector("input");
		const [saveBtn, closeBtn] = document.querySelectorAll("dialog .btn");
		saveBtn.addEventListener("click", async function () {
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
		});
		closeBtn.addEventListener("click", function () {
			closeDialog();
		});
		dialog.showModal();
	}

	async function openDelete(id, name) {
		dialog.innerHTML = `
    <form>
      <p>Справді видалити ${name}?</p>
      <div class="btns">
        <div class="btn red">Видалити</div>
        <div class="btn green">Скасувати</div>
      </div>
    </form>
    `;
		const [saveBtn, closeBtn] = document.querySelectorAll("dialog .btn");
		saveBtn.addEventListener("click", async function () {
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
		});
		closeBtn.addEventListener("click", function () {
			closeDialog();
		});
		dialog.showModal();
	}

	list.forEach(function (listItem) {
		listItem.addEventListener("click", async function (e) {
			const id = listItem.dataset.id;
			const name = listItem.textContent.split(" ").slice(0, -1).join(" ");
			if (e.target === listItem) {
				return await openDetails(id);
			}
			if (e.target.id === "edit") {
				return await openRename(id, name);
			}
			if (e.target.id === "delete") {
				return await openDelete(id, name);
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
	});
});
