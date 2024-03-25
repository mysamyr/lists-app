const router = require("express").Router();
const promisify = require("../../middlewares/promisify");
const listController = require("./list.controller");
const { OK, CREATED, NO_CONTENT } = require("../../constants/status-codes");

router.get(
	"/",
	promisify(async (req, res) => {
		res.status(OK).json(await listController.getLists(req.userData.id));
	}),
);

router.get(
	"/tree",
	promisify(async (req, res) => {
		res.status(OK).json(await listController.getListsTree(req.userData.id));
	}),
);

router.get(
	"/:id",
	promisify(async (req, res) => {
		res
			.status(OK)
			.json(
				await listController.getListsChildren(req.params.id, req.userData.id),
			);
	}),
);

router.post(
	"/",
	promisify(async (req, res) => {
		await listController.create(null, req.body, req.userData.id);

		res.status(CREATED).send();
	}),
);

router.post(
	"/:id",
	promisify(async (req, res) => {
		await listController.create(req.params.id, req.body, req.userData.id);

		res.status(CREATED).send();
	}),
);

router.put(
	"/:id",
	promisify(async (req, res) => {
		await listController.update(req.params.id, req.body, req.userData.id);

		res.status(OK).send();
	}),
);

router.put(
	"/:id/move",
	promisify(async (req, res) => {
		await listController.move(
			req.params.id,
			req.body.destination,
			req.userData.id,
		);

		res.status(OK).send();
	}),
);

router.delete(
	"/:id",
	promisify(async (req, res) => {
		await listController.delete(req.params.id, req.userData.id);

		res.status(NO_CONTENT).send();
	}),
);

module.exports = router;
