const {STATUS} = require("./constants");

module.exports.createRouter = (controllers) => async (req, res) => {
  try {
    for (let controller of controllers) {
      await controller(req, res);
      if (res.finished) return;
    }
  } catch (e) {
    res.writeHead(STATUS.BAD_REQUEST, {"Content-Type": "application/json"});
    return res.end(JSON.stringify({error: e.message}));
  }
};
