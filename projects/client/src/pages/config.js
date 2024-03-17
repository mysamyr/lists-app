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
import { navigate } from "../utils/navigator";

export default async (id) => {
	const isHomePage = !id;
	const body = document.querySelector("body");
	if (isHomePage) {
		try {
			const configs = await getRequest(URLS.GET_CONFIGS);
			setConfigsList(configs);
			body.innerText = "";
			body.appendChild(Header({ title: "Configs", left: "menu" }));
			body.append(List(sortByValue(configs), ConfigItem), MarginBottom());
			Dialog(body);
		} catch {
			return await navigate(URLS.ERROR);
		}
	} else {
		const configList = getConfigsList();
		const configDetails = configList.find((i) => i.id === id);
		body.innerText = "";
		body.append(
			Header({ title: configDetails.name, left: "back" }),
			ConfigDetails(configDetails),
		);
	}
};
