const { ACTIONS } = require("./constants");

module.exports.validateCreateItem = (body) => {
  if (!body || !body.name || !body.capacity || !body.hasOwnProperty("count")) {
    throw new Error("Відсутні дані для створення");
  }
  const {name, capacity, count} = body;
  if (typeof name !== "string" || name.length < 0 || name.length > 50) {
    throw new Error("Назва банки має включати від 0 до 50 символів");
  }
  if (typeof capacity !== "number" || capacity < 0.07 || capacity > 3) {
    throw new Error("Об'єм банки недопустимий");
  }
  if (typeof count !== "number" || count < 0) {
    throw new Error("Кількість банок не може бути від'ємна");
  }
};
module.exports.validateUpdateItem = (body) => {
  if (!body || (!body.hasOwnProperty("count") && !body.hasOwnProperty("name"))) {
    throw new Error("Відсутні дані");
  }
  if (body.hasOwnProperty("count")) {
    if (typeof body.count !== "number" || body.count < 0) {
      throw new Error("Кількість банок не може бути від'ємна");
    }
    return ACTIONS.CHANGE_NUMBER;
  }
  if (body.hasOwnProperty("name")) {
    if (typeof body.name !== "string" || body.name.length < 0 || body.name.length > 50) {
      throw new Error("Назва банки має включати від 0 до 50 символів");
    }
    return ACTIONS.RENAME;
  }
};
