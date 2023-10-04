const MESSAGE_MIN_LENGTH = 3;
const MESSAGE_MAX_LENGTH = 50;

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

	function validateMessage(message, oldMessage) {
		if (
			!message ||
			message.length < MESSAGE_MIN_LENGTH ||
			message.length > MESSAGE_MAX_LENGTH
		) {
			return `Назва має включати від ${MESSAGE_MIN_LENGTH} до ${MESSAGE_MAX_LENGTH} символів`;
		}
		if (oldMessage && message === oldMessage) {
			return "Новий елемент не змінився";
		}
	}

	async function saveListItem() {
		const message = document.querySelector("form").name.value;
		const error = validateMessage(message);
		if (error) return alert(error);
		await fetch(`/list/${listId}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ message, complete: false }),
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

	async function renameListItem(id, oldMessage) {
		const message = document.querySelector("input");
		const error = validateMessage(message.value, oldMessage);
		if (error) return alert(error);
		await fetch(`/list/${listId}/item/${id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ message: message.value }),
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

	async function markListItemDone(id, completed) {
		await fetch(`/list/${listId}/item/${id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ complete: !completed }),
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

	async function openCreation() {
		dialog.innerHTML = `
    <form>
      <input name="name" type="text" placeholder="Введіть текст">
      <div class="btns">
        <div class="btn green">Зберегти</div>
        <div class="btn red">Скасувати</div>
      </div>
    </form>`;
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

	async function openRename(id, oldMessage) {
		dialog.innerHTML = `
    <form>
      <input type="text" maxlength="${MESSAGE_MAX_LENGTH}" value="${oldMessage}">
      <div class="btns">
        <div class="btn green">Зберегти</div>
        <div class="btn red">Скасувати</div>
      </div>
    </form>`;
		const [saveBtn, closeBtn] = document.querySelectorAll("dialog .btn");
		saveBtn.addEventListener("click", async function () {
			return renameListItem(id, oldMessage);
		});
		closeBtn.addEventListener("click", function () {
			closeDialog();
		});
		document.querySelector("form").addEventListener("keydown", function (e) {
			if (e.code === "Enter" && dialog.open) {
				return renameListItem(id, oldMessage);
			}
		});
		dialog.showModal();
	}

	async function openDelete(id, message) {
		dialog.innerHTML = `
    <form>
      <p>Справді видалити <b>${message}</b>?</p>
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
			const id = listItem.dataset.id;
			const message = listItem.textContent.slice(0, -2);
			const isCompleted = listItem.children[0].classList.contains("completed");
			if (e.target.id === "edit") {
				return await openRename(id, message);
			}
			if (e.target.id === "delete") {
				return await openDelete(id, message);
			}
			return await markListItemDone(id, isCompleted);
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
