const { sortByValue, getView } = require("./helper");

const generateMeta = ({
	title,
	scripts = [],
	stylesheets = [],
	lang = "ua",
}) => [
	`<html lang=${lang}>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
      <title>${title}</title>
      ${stylesheets
				.map((path) => `<link rel="stylesheet" href="/${path}">`)
				.join("")}
      ${scripts.map((path) => `<script src="/${path}"></script>`).join("")}
    </head>
    <body>
  `,
	`  </body>
   </html>
  `,
];
const generateHeader = (text) => `<h1>${text}</h1>`;

const addBtn = `<div class="add-item">+</div>`;
const dialog = `<dialog></dialog>`;
const noContent = `<p>Немає нічого</p>`;

const listMapper = ({ name, id }) =>
	`<li data-id="${id}"><span>${name}</span><div><span id="edit" class="icon">~</span><span id="delete" class="icon">&times;</span></div></li>`;
const listItemMapper = (data, schema) =>
	`<li data-id="${data.id}"><span class="${
		data.complete ? "completed" : ""
	}">${getView(
		data,
		schema,
	)}</span><div><span id="edit" class="icon">~</span><span id="delete" class="icon">&times;</span></div></li>`;
const printMapper = (data, schema) => `<p>${getView(data, schema)}</p>`;

module.exports.generateHome = (list) => {
	const [start, end] = generateMeta({
		title: "Список",
		stylesheets: ["styles.css"],
		scripts: ["home.js"],
	});

	const sortedList = sortByValue(list);

	const header = generateHeader("Списки");
	const content = sortedList.map(listMapper);

	return [
		start,
		header,
		content.length ? `<ul>${content.join("\n")}</ul>` : noContent,
		addBtn,
		dialog,
		end,
	].join("");
};

module.exports.generateSimpleList = (list) => {
	const [start, end] = generateMeta({
		title: list.name,
		stylesheets: ["styles.css"],
		scripts: ["simple-list.js"],
	});

	const sortedList = sortByValue(list.data, "message");

	const header = generateHeader(`<b>${list.name}</b>`);
	const backBtn = `<a href="/" class="btn">Назад</a>`;
	const content = sortedList.map((i) => listItemMapper(i));

	return [
		start,
		`<div class="row">`,
		header,
		backBtn,
		`</div>`,
		content.length ? `<ul>${content.join("\n")}</ul>` : noContent,
		addBtn,
		dialog,
		end,
	].join("");
};
module.exports.generateTodoList = (list) => {
	const [start, end] = generateMeta({
		title: list.name,
		stylesheets: ["styles.css"],
		scripts: ["todo-list.js"],
	});

	const sortedList = sortByValue(list.data);

	const header = generateHeader(`<b>${list.name}</b>`);
	const backBtn = `<a href="/" class="btn">Назад</a>`;
	const content = sortedList.map((i) => listItemMapper(i));

	return [
		start,
		`<div class="row">`,
		header,
		backBtn,
		`</div>`,
		content.length ? `<ul>${content.join("\n")}</ul>` : noContent,
		addBtn,
		dialog,
		end,
	].join("");
};
module.exports.generateComplexList = (list) => {
	const [start, end] = generateMeta({
		title: list.name,
		stylesheets: ["styles.css"],
		scripts: ["complex-list.js"],
	});

	const sortedList = sortByValue(list.data, list.sort);

	const header = generateHeader(`<b>${list.name}</b>`);
	const backBtn = `<a href="/" class="btn">Назад</a>`;
	const content = sortedList.map((i) => listItemMapper(i, list.view));
	const btns = `<div class="btns">
        <a href="/list/${list._id.toString()}/print" class="btn print">Показати список</a>
    </div>`;

	return [
		start,
		`<div class="row">`,
		header,
		backBtn,
		`</div>`,
		content.length ? `<ul>${content.join("\n")}</ul>${btns}` : noContent,
		addBtn,
		dialog,
		end,
	].join("");
};

module.exports.generatePrint = ({ data, name, _id, printView, sort }) => {
	const [start, end] = generateMeta({
		title: "Список",
		stylesheets: ["styles.css"],
	});

	const sortedList = sortByValue(data, sort);

	const header = generateHeader(`<b>${name}</b>`);
	const content = sortedList.map((i) => printMapper(i, printView)).join("\n");
	const backBtn = `<a href="/list/${_id.toString()}" class="btn">Назад</a>`;

	return [
		start,
		`<div class="row">`,
		header,
		backBtn,
		`</div>`,
		content,
		end,
	].join("");
};

module.exports.generate404 = () => {
	const [start, end] = generateMeta({
		title: "Сторінка не знайдена",
	});

	const header = generateHeader("Сторінка не знайдена");
	const backBtn = `<a href="/" class="btn">На головну</a>`;

	return [start, header, backBtn, end].join("");
};
