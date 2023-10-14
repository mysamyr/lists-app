const NAME_MIN_LENGTH = 3;
const NAME_MAX_LENGTH = 30;

window.addEventListener("DOMContentLoaded", async function () {
	const confirmBtn = document.getElementById("confirm");

	function logError(msg) {
		// eslint-disable-next-line no-console
		console.error(msg);
	}

	function validateName(name) {
		if (
			!name ||
			name.length < NAME_MIN_LENGTH ||
			name.length > NAME_MAX_LENGTH
		) {
			return `Назва списку має включати від ${NAME_MIN_LENGTH} до ${NAME_MAX_LENGTH} символів`;
		}
	}

	confirmBtn.addEventListener("click", async function () {
		const { type, name } = document.querySelector("form");
		// todo
		if (type.value === "3") return alert("Тимчасово недоступно =)");
		if (type.value !== "1" && type.value !== "2") return alert("Не вірний тип");
		const err = validateName(name.value);
		if (err) return alert(err);

		return fetch(`/list`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ type: +type.value, name: name.value }),
		})
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
	});
});
