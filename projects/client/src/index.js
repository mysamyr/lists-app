import { navigate, navigateBack } from "./utils/navigator";
import { URLS } from "./constants";

window.addEventListener("popstate", async () => {
	return navigateBack();
});

(async () => {
	const path = history.state?.path || "";
	if (path.includes(URLS.LISTS)) {
		return navigate(URLS.LISTS);
	}
	if (path.includes(URLS.CONFIGS)) {
		return navigate(URLS.CONFIGS);
	}
	return navigate();
})();
