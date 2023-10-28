import { LIST_ITEM_LENGTH, URLS } from "./constants";
import {
	getRequest,
	postRequest,
	putRequest,
	deleteRequest,
	validateName,
	validateCreationInputs,
	getInputsFromForm,
	renderDetails,
	renderCreationForm,
	handleDialogClose,
	getSortedList,
	renderSortOptions,
} from "./helpers";

window.addEventListener("DOMContentLoaded", async function () {
	const listId = location.pathname.split("/")[2];
	const body = document.querySelector("body");
	let store;
	await getRequest(URLS.GET_LIST_DETAILS_$(listId), async function (res) {
		const listData = await res.json();
		const { name, type, data, view, sort } = listData;
		store = listData;

		const content = getSortedList(data, sort, view);

		const btns =
			type === 3 && content.length
				? `<div class="btns margin-bottom"><a href="${URLS.PRINT_$(
						listId,
				  )}" class="btn">Показати стисло</a></div>`
				: `<div class="margin-bottom"></div>`;

		body.innerHTML = `<div class="row header">
			<div id="back" onclick="location.href='${URLS.HOME}'">
				<img src="/img/back-arrow.svg" height="24" alt="back"/>
			</div>
			<h1>${name}</h1>
			<div id="sort">
				<img src="/img/sort.svg" height="20" alt="sort"/>
			</div>
		</div>
		${content.length ? `<ul>${content.join("\n")}</ul>` : "<p>Список пустий</p>"}
		${btns}
		<div class="add-item">+</div>
		<dialog></dialog>`;
	});

	const sortBtn = document.getElementById("sort");
	const dialog = document.querySelector("dialog");
	const addItemBtn = document.querySelector(".add-item");

	function closeDialog() {
		dialog.innerHTML = "";
		dialog.close();
	}

	function sortListItems() {
		const form = document.querySelector("form");
		const field = form.field?.value;
		const direction = form.direction.value;

		const content = getSortedList(store.data, field, store.view, direction);

		store.sort = field;
		store.direction = direction;

		if (!store.data.length) {
			return;
		}

		document.querySelector("ul").innerHTML = content.length
			? `<ul>${content.join("\n")}</ul>`
			: "<p>Список пустий</p>";

		handleListItemEvents();
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
			URLS.CREATE_LIST_ITEM_$(listId),
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
			URLS.UPDATE_LIST_ITEM_$(listId, id),
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
		await deleteRequest(
			URLS.DELETE_LIST_ITEM_$(listId, id),
			async function (data) {
				if (!data.ok) {
					const res = await data.json();
					throw new Error(res.error);
				}
				location.href = URLS.LIST_PAGE_$(listId);
			},
		);
	}

	async function markListItemDone(id, completed) {
		await putRequest(
			URLS.UPDATE_LIST_ITEM_$(listId, id),
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
			URLS.UPDATE_LIST_ITEM_$(listId, item.id),
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
      <input type="text" maxlength="${LIST_ITEM_LENGTH.MAX}" value="${oldName}">
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

	function openSort() {
		dialog.innerHTML = renderSortOptions(store);
		const [saveBtn, closeBtn] = document.querySelectorAll("dialog .btn");
		saveBtn.addEventListener("click", async function () {
			sortListItems();
			closeDialog();
		});
		closeBtn.addEventListener("click", function () {
			closeDialog();
		});
		dialog.showModal();
	}

	function handleListItemEvents() {
		document.querySelectorAll("li").forEach(function (listItem) {
			listItem.addEventListener("click", async function (e) {
				const id = listItem.dataset.id;
				const item = store.data.find(function (i) {
					return i.id === id;
				});
				if (e.target.id === "edit") {
					return openRename(id, item.name);
				}
				if (e.target.id === "delete") {
					return openDelete(id, item.name);
				}
				switch (store.type) {
					case 2:
						return markListItemDone(id, item.complete);
					case 3:
						return openDetails(item, store.fields);
				}
			});
		});
	}

	sortBtn.addEventListener("click", function () {
		openSort();
		// todo !!!!!!!!!!!!!!!!!!!!!!!!
		// open dialog, choose option, choose direction, apply
		// get sorted list, insert it, add listeners
	});
	handleListItemEvents();
	addItemBtn.addEventListener("click", async function () {
		await openCreation();
	});
	handleDialogClose(dialog, closeDialog);
});
