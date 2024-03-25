module.exports.dateTime = (d = new Date()) => {
	const ISO = d.toISOString();
	const [date, time] = ISO.split("T");
	const hhmmss = time.slice(0, 8);
	return `${date} ${hhmmss}`;
};
