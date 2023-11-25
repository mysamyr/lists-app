import ListItem from "./ListItem";
import { createParagraph, createUnorderedList } from "../utils/elements";

export default (lists, view) => {
	const ul = createUnorderedList();
	ul.classList.add("column");
	if (!lists.length) {
		const p = createParagraph();
		p.innerText = "No list items";
		return p;
	}
	const content = lists.map((i) => ListItem(i, view));
	ul.append(...content);
	return ul;
};
