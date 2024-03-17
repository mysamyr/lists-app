const { createServer, get } = require("http");
const { extname } = require("path");
const { readFileSync } = require("fs");
const { API_URL } = require("./env.json");

const port = process.env.PORT || 3000;

const determineContentType = (url) => {
	const ext = extname(url);

	let contentType;
	switch (ext) {
		case ".css":
			contentType = "text/css";
			break;
		case ".js":
			contentType = "text/javascript";
			break;
		case ".ico":
			contentType = "image/x-icon";
			break;
		case ".svg":
			contentType = "image/svg+xml";
			break;
		default:
			contentType = "text/html";
	}
	return contentType;
};

const determineFilePath = (url) => {
	switch (url) {
		case "/index.js":
			return "public/dist/index.js";
		case "/styles.css":
			return "public/styles.css";
		case "/favicon.ico":
			return "public/favicon.ico";
		case "/img/back-arrow.svg":
			return "public/img/back-arrow.svg";
		case "/img/sort.svg":
			return "public/img/sort.svg";
		case "/img/menu.svg":
			return "public/img/menu.svg";
		case "/img/options.svg":
			return "public/img/options.svg";
		default:
			return "public/index.html";
	}
};

const server = createServer((req, res) => {
	if (req.url.includes("activate")) {
		return get(`${API_URL}${req.url}`, { method: "GET" }, (response) => {
			if (response.statusCode !== 200) {
				res.writeHead(401, { "Content-Type": "text/html" });
				return res.end(
					`<h1>Activation link is not valid.</h1><div onclick="location.href='/'" style="color: #71b6f6">Back to the main page</div>`,
				);
			}
			res.writeHead(200, { "Content-Type": "text/html" });
			return res.end(
				`<h1>Congratulation!</h1><h2>Your account was activated.</h2><p>To continue use Lister App, <div onclick="location.href='/'" style="color: #71b6f6">go to website</div>.</p>`,
			);
		}).on("error", (err) => {
			// eslint-disable-next-line no-console
			console.error(err);
			res.writeHead(500, { "Content-Type": "text/html" });
			return res.end(
				`<h1>Internal Server Error</h1><div onclick="location.href='/'" style="color: #71b6f6">Back to the main page</div>`,
			);
		});
	}

	const filePath = determineFilePath(req.url);
	const contentType = determineContentType(req.url);

	try {
		const data = readFileSync(filePath);
		res.writeHead(200, { "Content-Type": contentType });
		return res.end(data);
	} catch (err) {
		// eslint-disable-next-line no-console
		console.error(err);
		if (err.code === "ENOENT") {
			res.writeHead(404, { "Content-Type": "text/html" });
			return res.end(
				`<h1>Page not found</h1><div onclick="location.href='/'" style="color: #71b6f6">Back to the main page</div>`,
			);
		}
		res.writeHead(500, { "Content-Type": "text/html" });
		return res.end(
			`<h1>Internal Server Error</h1><div onclick="location.href='/'" style="color: #71b6f6">Back to the main page</div>`,
		);
	}
});

server.listen(port, async () => {
	// eslint-disable-next-line no-console
	console.log(`Web server has been started on ${port}...`);
});
