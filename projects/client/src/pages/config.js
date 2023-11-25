import { getRequest } from "../api";
import { URLS } from "../constants";
import Header from "../components/Header";
import MarginBottom from "../components/MarginBottom";
import Dialog from "../components/Dialog";
import List from "../components/List";
import ConfigDetails from "../components/ConfigDetails";
import ConfigItem from "../components/ConfigItem";
import { sortByValue } from "../utils/helpers";
import { getConfigsList, setConfigsList } from "../store";
import AddButton from "../components/buttons/AddButton";

export default async (id) => {
	const isHomePage = !id;
	const body = document.querySelector("body");
	if (isHomePage) {
		const configs = await getRequest(URLS.GET_CONFIGS);
		if (!configs) return;
		setConfigsList(configs);
		body.innerText = "";
		body.appendChild(Header("Configs"));
		body.append(
			List(sortByValue(configs), ConfigItem),
			MarginBottom(),
			AddButton(),
		);
		Dialog(body);
	} else {
		const configList = getConfigsList();
		const configDetails = configList.find((i) => i.id === id);
		body.innerText = "";
		body.append(Header(configDetails.name, true), ConfigDetails(configDetails));
	}
};
