export const createDialog = () => document.createElement("dialog");
export const createDiv = () => document.createElement("div");
export const createForm = () => document.createElement("form");
export const createLabel = () => document.createElement("label");
export const createInput = () => document.createElement("input");
export const createSelect = () => document.createElement("select");
export const createOption = () => document.createElement("option");
export const createSpan = () => document.createElement("span");
export const createHr = () => document.createElement("hr");
export const createHeader1 = () => document.createElement("h1");
export const createHeader2 = () => document.createElement("h2");
export const createParagraph = () => document.createElement("p");
export const createUnorderedList = () => document.createElement("ul");
export const createListItem = () => document.createElement("li");
export const onPressClick = (el, fn, options) =>
	el.addEventListener("click", fn, options);
export const onKeyPress = (el, fn, options) =>
	el.addEventListener("keydown", fn, options);
