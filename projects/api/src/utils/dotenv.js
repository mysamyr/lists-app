const fs = require("fs");
const path = require("path");

module.exports.config = () => {
	try {
		const data = fs.readFileSync(path.join(process.cwd(), ".env"), "utf8");
		data.split(/\r?\n/).forEach((line) => {
			line = line.trim();
			if (line[0] === "#") return;
			if (!line.length) return;

			if (line.includes("=")) {
				const [name, ...value] = line.split("=");

				process.env[name] = value.join("=");
			}
		});
	} catch (err) {
		if (err.code === "ENOENT") {
			throw new Error(".env file not found!");
		} else {
			throw err;
		}
	}
};
