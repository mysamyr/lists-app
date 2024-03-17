require("./src/utils/dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const database = require("./src/services/database");
const requestLogger = require("./src/middlewares/request-logger");
const authMiddleware = require("./src/middlewares/auth-check");
const errorHandler = require("./src/middlewares/error-handler");
const authRouter = require("./src/features/auth/auth.router");
const listRouter = require("./src/features/list/list.router");
const configRouter = require("./src/features/config/config.router");
const { errorLogger } = require("./src/services/logging");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json({ limit: "1mb" }));
app.use(helmet());
app.use(
	cors({
		origin: true,
		credentials: true,
	}),
);
app.use(cookieParser());

app.use(requestLogger);

app.use("/auth", authRouter);
app.use("/lists", authMiddleware, listRouter);
app.use("/configs", authMiddleware, configRouter);

app.use(errorHandler);

database
	.connect()
	.then(() => {
		app.listen(PORT, () => {
			// eslint-disable-next-line no-console
			console.log(`Server has been started on ${PORT}...`);
		});
	})
	// eslint-disable-next-line no-console
	.catch((e) => console.log(e));

process
	.on("unhandledRejection", (err) => {
		errorLogger(err);
	})
	.on("uncaughtException", (err) => {
		errorLogger(err);
		errorLogger("!= () APP shutdown ");
		process.exit(1);
	});
