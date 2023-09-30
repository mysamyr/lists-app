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

const dialog = `<dialog></dialog>`;

const categoryMapper = ({ name, id }) => `<li data-id="${id}">${name}</li>`;
const listMapper = (data, schema) =>
	`<li data-id="${data.id}">${getView(
		schema,
		data,
	)}<div><span id="edit">~</span><span id="delete">&times;</span></div></li>`;
const printMapper = (data, schema) =>
	`<p>${getView(schema, data)} - ${data.count}</p>`;

module.exports.generateHome = (list) => {
	const [start, end] = generateMeta({
		title: "Список",
		stylesheets: ["styles.css"],
		scripts: ["home.js"],
	});

	const sortedList = sortByValue(list, "name");

	const header = generateHeader("Списки");
	const content = sortedList.map(categoryMapper).join("\n");

	return [start, header, "<ul>", content, "</ul>", end].join("");
};

module.exports.generateList = (list) => {
	const [start, end] = generateMeta({
		title: "Список",
		stylesheets: ["styles.css"],
		scripts: ["category.js"],
	});

	const sortedList = sortByValue(list.data, "name");

	const header = generateHeader(`<b>${list.name}</b>`);
	const backBtn = `<a href="/" class="btn">Назад</a>`;
	const content = sortedList.map((i) => listMapper(i, list.view)).join("\n");
	const btns = `<div class="btns">
        <a href="/list/${list._id.toString()}/print" class="btn print">Показати список</a>
    </div>`;
	const addBtn = `<div class="add-item">+</div>`;

	return [
		start,
		`<div class="row">`,
		header,
		backBtn,
		`</div>`,
		"<ul>",
		content,
		"</ul>",
		btns,
		addBtn,
		dialog,
		end,
	].join("");
};

module.exports.generatePrint = (list) => {
	const [start, end] = generateMeta({
		title: "Список",
		stylesheets: ["styles.css"],
	});

	const sortedList = sortByValue(list.data, "name");

	const header = generateHeader(`<b>${list.name}</b>`);
	const content = sortedList.map((i) => printMapper(i, list.view)).join("\n");
	const backBtn = `<a href="/list/${list._id.toString()}" class="btn">Назад</a>`;

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

	const header = generateHeader(`Сторінка не знайдена`);
	const backBtn = `<a href="/" class="btn">Назад</a>`;

	return [start, header, backBtn, end].join("");
};
