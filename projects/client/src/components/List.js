import { createParagraph, createUnorderedList } from "../utils/dom";

export default (lists, Component, ...params) => {
	const ul = createUnorderedList();
	ul.classList.add("column");
	if (!lists.length) {
		const p = createParagraph();
		p.innerText = "No items";
		return p;
	}
	const content = lists.map((i) => Component(i, ...params));
	ul.append(...content);
	return ul;
};
