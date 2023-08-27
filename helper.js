const path = require("path");
const {ACTIONS} = require("./constants");

const generateMeta = ({title, lang = "ua"}) => ([
    `<html lang=${lang}>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
      <link rel="stylesheet" href="styles.css">
      <title>${title}</title>
    </head>
    <body>
    `,
    `</body>
    </html>
    `
  ]);

const listMapper = ({name, capacity, count}) =>
  `<p>${name} ${capacity}л. - ${count}</p>\n`;


const sortByValue = (arr, key) => arr.sort((x, y) => {
  if (x[key] < y[key]) return -1;
  if (x[key] > y[key]) return 1;
  return 0;
});

const generateList = (list) => {
  const [start, end] = generateMeta({title: "Список"});

  const sortedList = sortByValue(list, "name");

  const content = sortedList.map(listMapper).join("");
  const backBtn = `<div class="btns"><a href="/" class="btn">Назад</a></div>`;

  return [start, backBtn, content, end].join("");
};

const determineContentType = (url) => {
  const ext = path.extname(url);

  let contentType;
  switch (ext) {
    case ".css":
      contentType = "text/css";
      break;
    case ".js":
      contentType = "text/javascript";
      break;
    case ".ico":
      contentType = "image/x-icon";
      break;
    default:
      contentType = "text/html";
  }
  return contentType;
};

const prepareAuditData = (action, data) => {
  let res;

  switch (action) {
    case ACTIONS.CREATE:
      res = {
        name: data.name,
        before: "",
        after: `${data.name} ${data.capacity} - ${data.count}`
      };
      break;
    case ACTIONS.RENAME:
      res = {
        name: data.updatedData.value.name,
        before: data.updatedData.value.name,
        after: data.body.name
      };
      break;
    case ACTIONS.CHANGE_NUMBER:
      res = {
        name: data.updatedData.value.name,
        before: data.updatedData.value.count,
        after: data.body.count,
      };
      break;
    case ACTIONS.DELETE:
      res = {
        name: data.name,
        before: `${data.name} ${data.capacity} - ${data.count}`,
        after: ""
      };
      break;
  }
  res = {...res, id: data.id, action, date: new Date().toISOString()};
  return res;
};

const mapAudits = (list) => list.map(({_id, ...data}) => data);

module.exports = {
  generateList,
  determineContentType,
  sortByValue,
  prepareAuditData,
  mapAudits,
};
