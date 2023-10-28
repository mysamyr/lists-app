"use strict";

module.exports = {
	entry: {
		home: "./public/home.js",
		list: "./public/list.js",
		"create-list": "./public/create-list.js",
	},
	output: {
		filename: "[name].js",
		path: require("path").resolve(__dirname, "public", "dist"),
		clean: true,
	},
	module: {
		rules: [],
	},
};
