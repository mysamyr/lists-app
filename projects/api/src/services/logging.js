module.exports.requestLogger = (req) => {
	// eslint-disable-next-line no-console
	console.log({
		level: "info",
		message: JSON.stringify({
			url: req.url,
			method: req.method,
			body: req.body,
			timestamp: new Date().toISOString(),
		}),
	});
};

module.exports.errorLogger = (error) => {
	// eslint-disable-next-line no-console
	console.error(
		JSON.stringify({
			error,
			timestamp: new Date().toISOString(),
		}),
	);
};
