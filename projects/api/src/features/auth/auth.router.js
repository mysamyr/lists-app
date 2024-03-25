const router = require("express").Router();
const promisify = require("../../middlewares/promisify");
const authController = require("./auth.controller");
const { OK, CREATED } = require("../../constants/status-codes");

router.post(
	"/signup",
	promisify(async (req, res) => {
		await authController.signup(req.body);

		res.status(CREATED).send();
	}),
);

router.post(
	"/login",
	promisify(async (req, res) => {
		const { accessToken, refreshToken } = await authController.login(req.body);

		res.cookie("refreshToken", refreshToken, {
			maxAge: 30 * 24 * 60 * 60 * 1000,
			httpOnly: true,
			secure: true,
		});

		res.status(OK).json({ accessToken, refreshToken });
	}),
);

router.get(
	"/refresh",
	promisify(async (req, res) => {
		const { accessToken, refreshToken } = await authController.refresh(
			req.cookies.refreshToken,
		);

		res.cookie("refreshToken", refreshToken, {
			maxAge: 30 * 24 * 60 * 60 * 1000,
			httpOnly: true,
			secure: true,
		});

		res.status(OK).json({ accessToken, refreshToken });
	}),
);

router.get(
	"/activate",
	promisify(async (req, res) => {
		await authController.activate(req.query.id);

		res.status(OK).send();
	}),
);

router.get(
	"/logout",
	promisify(async (req, res) => {
		await authController.logout(req.cookies.refreshToken);

		res.clearCookie("refreshToken");

		res.status(OK).send();
	}),
);

module.exports = router;
