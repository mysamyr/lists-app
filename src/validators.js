const { ACTIONS } = require("./constants");

module.exports.validateCreateItem = (body, fields) => {
  if (!body) {
    throw new Error("Відсутні дані для створення");
  }
  fields.forEach(({field, description, type, min, max}) => {
    if (!body.hasOwnProperty(field)) {
      throw new Error(`Відсутнє поле ${description}`);
    }
    const value = body[field];
    if (type === "string" && (typeof value !== "string" || value.length < min || value.length > max)) {
      throw new Error(`Поле ${description} має бути рядком і включати від ${min} до ${max} символів`);
    }
    if (type === "number" && (typeof value !== "number" || value < min || value > max)) {
      throw new Error(`Поле ${description} має бути числом від ${min} до ${max}`);
    }
  });
};

module.exports.validateUpdateItem = (body) => {
  if (!body || (!body.hasOwnProperty("count") && !body.hasOwnProperty("name"))) {
    throw new Error("Відсутні дані");
  }
  if (body.hasOwnProperty("count")) {
    if (typeof body.count !== "number" || body.count < 0) {
      throw new Error("Кількість не може бути від'ємна");
    }
    return ACTIONS.CHANGE_NUMBER;
  }
  if (body.hasOwnProperty("name")) {
    if (typeof body.name !== "string" || body.name.length < 0 || body.name.length > 50) {
      throw new Error("Назва має включати від 0 до 50 символів");
    }
    return ACTIONS.RENAME;
  }
};
