const { CONTENT_TYPE, STATUS, METHOD } = require("./enums");

const requestHandler = (path, method, req, fn) => {
	// ignore query, only params
	const schemaParams = path.split("?")[0].split("/");
	const requestParams = req.url.split("?")[0].split("/");

	if (
		req.method === method &&
		schemaParams.length === requestParams.length &&
		schemaParams.every((param, idx) => {
			if (param[0] === ":") {
				if (!req.params) req.params = {};
				req.params[param.slice(1)] = requestParams[idx];
			} else {
				if (param !== requestParams[idx]) return false;
			}
			return true;
		})
	) {
		return fn;
	}
};

module.exports.get = (path, handler) => (req) =>
	requestHandler(path, METHOD.GET, req, handler);

module.exports.post = (path, handler) => (req) =>
	requestHandler(path, METHOD.POST, req, handler);

module.exports.put = (path, handler) => (req) =>
	requestHandler(path, METHOD.PUT, req, handler);

module.exports.delete = (path, handler) => (req) =>
	requestHandler(path, METHOD.DELETE, req, handler);

module.exports.createRouter = (controllers) => async (req, res) => {
	try {
		for (let controller of controllers) {
			if (controller) {
				await controller(req, res);
				if (res.finished) break;
			}
		}
	} catch (e) {
		// eslint-disable-next-line no-console
		console.error(e);
		res.writeHead(STATUS.BAD_REQUEST, CONTENT_TYPE.JSON);
		return res.end(JSON.stringify({ error: e.message }));
	}
};
