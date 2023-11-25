const router = require("express").Router();
const promisify = require("../../utils/promisify");
const configController = require("./config.controller");
const { OK } = require("../../constants/status-codes");

router.get(
	"/",
	promisify(async (req, res) => {
		res.status(OK).json(await configController.list());
	}),
);

router.post(
	"/",
	promisify(async (req, res) => {
		res.status(OK).json(await configController.create(req.body));
	}),
);

router.delete(
	"/:id",
	promisify(async (req, res) => {
		res.status(OK).json(await configController.delete(req.params.id));
	}),
);

module.exports = router;
