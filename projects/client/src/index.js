import { navigate, render } from "./utils/navigator";

window.addEventListener("popstate", async () =>
	render(new URL(window.location.href).pathname),
);

// (async () => await render(new URL(window.location.href).pathname))();
(async () => navigate())();
