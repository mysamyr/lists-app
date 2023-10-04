const NAME_MIN_LENGTH = 3;
const NAME_MAX_LENGTH = 30;

window.addEventListener("DOMContentLoaded", async function () {
	const list = document.querySelectorAll("li");
	const dialog = document.querySelector("dialog");
	const addItemBtn = document.querySelector(".add-item");
	let preventModalClose = false;

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

	// async function openChooseType() {
	// 	dialog.innerHTML = `
	//   <form>
	//   	<p>Виберіть тип списку, який хочете створити:</p>
	//     <input name="type" type="radio" value="1" id="simple">
	//     <label for="simple">Звичайний</label>
	//     <input name="type" type="radio" value="2" id="todo">
	//     <label for="todo">Список справ</label>
	//     <input name="type" type="radio" value="3" id="complex">
	//     <label for="complex">Комплексний</label>
	//     <div class="btns">
	//       <div class="btn green">Вибрати</div>
	//       <div class="btn red">Скасувати</div>
	//     </div>
	//   </form>`;
	// 	const [nextBtn, closeBtn] = document.querySelectorAll("dialog .btn");
	// 	nextBtn.addEventListener("click", async function () {
	// 		preventModalClose = true;
	// 		// render select message
	// 		dialog.close();
	// 		const type = +document.querySelector("form").type.value;
	// 		if (type === 3) {
	// 			alert("Тимчасово не підтримується");
	// 		}
	// 		if (type !== 1 && type !== 2) {
	// 			alert("Невірний тип");
	// 		}
	// 		dialog.innerHTML = `
	// 		<form>
	// 			<p>Введіть назву списку</p>
	// 			<input name="name" type="text" maxlength="${NAME_MAX_LENGTH}" placeholder="Назва">
	// 			<div class="btns">
	// 				<div class="btn green">Зберегти</div>
	// 				<div class="btn red">Скасувати</div>
	// 			</div>
	// 		</form>`;
	// 		const [saveBtn, closeBtn] = document.querySelectorAll("dialog .btn");
	// 		saveBtn.addEventListener("click", async function () {
	// 			const name = document.querySelector("form").name.value;
	// 			validateName(name);
	// 			await fetch(`/list`, {
	// 				method: "POST",
	// 				headers: {
	// 					"Content-Type": "application/json",
	// 				},
	// 				body: JSON.stringify({ type, name }),
	// 			})
	// 			.then(async function (data) {
	// 				if (!data.ok) {
	// 					const res = await data.json();
	// 					throw new Error(res.error);
	// 				}
	// 				closeDialog();
	// 				location.href = "/";
	// 			})
	// 			.catch(function (e) {
	// 				logError(e.message);
	// 				alert(e.message);
	// 			});
	// 		});
	// 		closeBtn.addEventListener("click", function () {
	// 			closeDialog();
	// 		});
	// 		dialog.showModal();
	// 	});
	// 	closeBtn.addEventListener("click", function () {
	// 		closeDialog();
	// 	});
	// 	dialog.showModal();
	// }

	async function openRename(id, oldName) {
		dialog.innerHTML = `
    <form>
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
    <form>
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
		alert("Тимчасово недоступно =)");
		// await openChooseType();
	});
	dialog.addEventListener("click", function (e) {
		if (preventModalClose) return;
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
