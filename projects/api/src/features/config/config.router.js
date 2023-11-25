const router = require("express").Router();
const promisify = require("../../middlewares/promisify");
const configController = require("./config.controller");
const { OK } = require("../../constants/status-codes");

router.get(
	"/",
	promisify(async (req, res) => {
		res.status(OK).json(await configController.list());
	}),
);

router.get(
	"/:id",
	promisify(async (req, res) => {
		res.status(OK).json(await configController.get(req.params.id));
	}),
);

router.post(
	"/",
	promisify(async (req, res) => {
		await configController.create(req.body);

		res.status(OK).send();
	}),
);

router.delete(
	"/:id",
	promisify(async (req, res) => {
		await configController.delete(req.params.id);

		res.status(OK).send();
	}),
);

module.exports = router;
