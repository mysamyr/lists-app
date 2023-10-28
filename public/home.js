import { LIST_LENGTH, URLS } from "./constants";
import {
	getRequest,
	putRequest,
	deleteRequest,
	sortByValue,
	validateName,
	handleDialogClose,
} from "./helpers";

window.addEventListener("DOMContentLoaded", async function () {
	const body = document.querySelector("body");

	await getRequest(URLS.GET_LISTS, async function (data) {
		const lists = await data.json();
		const content = sortByValue(lists).map(function ({ name, id }) {
			return `<li data-id="${id}"><span>${name}</span><div><span id="edit" class="icon">~</span><span id="delete" class="icon">&times;</span></div></li>`;
		});
		body.innerHTML = `<h1>Списки</h1>
				${content.length ? `<ul>${content.join("\n")}</ul>` : "<p>Немає нічого</p>"}
				<div class="margin-bottom"></div>
				<div class="add-item">+</div>
				<dialog></dialog>`;
	});

	const list = document.querySelectorAll("li");
	const dialog = document.querySelector("dialog");
	const addItemBtn = document.querySelector(".add-item");

	function closeDialog() {
		dialog.innerHTML = "";
		dialog.close();
	}

	async function renameList(id, oldName) {
		const name = document.querySelector("input");
		const error = validateName(name.value, oldName);
		if (error) return alert(error);
		await putRequest(
			URLS.RENAME_LIST_$(id),
			{ name: name.value },
			async function (data) {
				if (!data.ok) {
					const res = await data.json();
					throw new Error(res.error);
				}
				closeDialog();
				location.href = URLS.HOME;
			},
		);
	}

	async function deleteList(id) {
		await deleteRequest(URLS.DELETE_LIST_$(id), async function (data) {
			if (!data.ok) {
				const res = await data.json();
				throw new Error(res.error);
			}
			location.href = URLS.HOME;
		});
	}

	async function openRename(id, oldName) {
		dialog.innerHTML = `
    <form class="modal-form">
      <input type="text" maxlength="${LIST_LENGTH.MAX}" value="${oldName}">
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
			return (location.href = URLS.LIST_PAGE_$(id));
		});
	});
	addItemBtn.addEventListener("click", async function () {
		return (location.href = URLS.CREATE_LIST);
	});
	handleDialogClose(dialog, closeDialog);
});
