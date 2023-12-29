"use strict";

module.exports = {
	entry: "./src/index.js",
	output: {
		filename: "index.js",
		path: require("path").resolve(__dirname, "public", "dist"),
	},
	module: {
		rules: [],
	},
	mode: "production",
};
