const NAME_MIN_LENGTH = 3;
const NAME_MAX_LENGTH = 30;

window.addEventListener("DOMContentLoaded", function () {
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

	async function renameList(id, oldName) {
		const name = document.querySelector("input");
		const error = validateName(name.value, oldName);
		if (error) return alert(error);
		await fetch(`/list/${id}`, {
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
				location.href = `/`;
			})
			.catch(function (e) {
				logError(e.message);
				alert(e.message);
			});
	}

	async function deleteList(id) {
		await fetch(`/list/${id}`, { method: "DELETE" })
			.then(async function (data) {
				if (!data.ok) {
					const res = await data.json();
					throw new Error(res.error);
				}
				location.href = `/`;
			})
			.catch(function (e) {
				logError(e.message);
				alert(e.message);
			});
		closeDialog();
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
			return renameList(id, oldName);
		});
		closeBtn.addEventListener("click", function () {
			closeDialog();
		});
		document.querySelector("form").addEventListener("keydown", function (e) {
			if (e.code === "Enter" && dialog.open) {
				return renameList(id, oldName);
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
			return deleteList(id);
		});
		closeBtn.addEventListener("click", function () {
			closeDialog();
		});
		dialog.showModal();
	}

	list.forEach(function (listItem) {
		const id = listItem.dataset.id;
		const name = listItem.textContent.slice(0, -2);
		listItem.addEventListener("click", async function (e) {
			if (e.target.id === "edit") {
				return await openRename(id, name);
			}
			if (e.target.id === "delete") {
				return await openDelete(id, name);
			}
			return location.replace(`/list/${id}`);
		});
	});
	addItemBtn.addEventListener("click", async function () {
		return location.replace(`/list`);
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
