window.addEventListener("DOMContentLoaded", async function () {
	const list = document.querySelectorAll("li");
	list.forEach(function (listItem) {
		listItem.addEventListener("click", async function () {
			const id = listItem.dataset.id;
			location.replace(`/list/${id}`);
		});
	});
});
