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
const generateHeader = (header, backURL) => `<div class="row">
		<div id="back" onclick="location.href='${backURL}'">
			<img src="/img/back-arrow.svg" height="24" alt="back"/>
		</div>
		<h1>${header}</h1>
	</div>`;

const printMapper = (data, schema) => `<p>${getView(data, schema)}</p>`;

module.exports.renderHome = () => {
	const html = generateMeta({
		title: "Lister",
		stylesheets: ["styles.css"],
		scripts: ["dist/home.js"],
	});

	return html.join("");
};
module.exports.renderList = (name) => {
	const html = generateMeta({
		title: name,
		stylesheets: ["styles.css"],
		scripts: ["dist/list.js"],
	});

	return html.join("");
};

module.exports.renderCreateList = () => {
	const [start, end] = generateMeta({
		title: "Створити список",
		stylesheets: ["styles.css"],
		scripts: ["dist/create-list.js"],
	});

	const header = generateHeader("Створити новий список", "/");

	const typeSection = `<h2>Виберіть тип списку</h2>
		<label><input name="type" type="radio" value="1" checked>Простий список</label>
		<label><input name="type" type="radio" value="2">Список справ</label>
		<label><input name="type" type="radio" value="3">Комплексний список</label>`;
	const nameSection = `<input name="name" type="text" placeholder="Введіть назву">`;
	const submitBtn = `<div id="confirm" class="btn green">Зберегти</div>`;

	return [
		start,
		header,
		`<form>`,
		typeSection,
		nameSection,
		submitBtn,
		`</form>`,
		end,
	].join("");
};

module.exports.generatePrint = ({ data, name, _id, printView, sort }) => {
	const [start, end] = generateMeta({
		title: "Список",
		stylesheets: ["styles.css"],
	});

	const sortedList = sortByValue(data, sort);

	const header = generateHeader(name, `/list-page/${_id.toString()}`);
	const content = sortedList.map((i) => printMapper(i, printView)).join("\n");

	return [start, header, content, end].join("");
};

module.exports.generate404 = () => {
	const [start, end] = generateMeta({
		title: "Сторінка не знайдена",
	});

	const header = generateHeader("Сторінка не знайдена", "/");

	return [start, header, end].join("");
};
