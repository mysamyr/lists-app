require("./src/utils/dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const database = require("./src/services/database");
const requestLogger = require("./src/middlewares/request-logger");
const errorHandler = require("./src/middlewares/error-handler");
const listRouter = require("./src/features/list/list.router");
const configRouter = require("./src/features/config/config.router");
const { errorLogger } = require("./src/services/logging");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json({ limit: "1mb" }));
app.use(helmet());
app.use(cors("*"));

app.use(requestLogger);

app.use("/lists", listRouter);
app.use("/configs", configRouter);

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
