import { navigate, navigateBack } from "./utils/navigator";
import { URLS } from "./constants";
import { getValue } from "./utils/local-storage";

window.addEventListener("popstate", async () => {
	return navigateBack();
});

(async () => {
	if (!getValue("session")) {
		return navigate(URLS.LOGIN);
	}
	const path = history.state?.path || "";
	if (path.includes(URLS.LISTS)) {
		return navigate(URLS.LISTS);
	}
	if (path.includes(URLS.CONFIGS)) {
		return navigate(URLS.CONFIGS);
	}
	return navigate();
})();
