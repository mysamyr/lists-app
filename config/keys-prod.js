module.exports = {
	NODE_ENV: process.env.NODE_ENV || "production",
	PORT: process.env.PORT || 3000,
	MONGODB_URI: process.env.MONGODB_URI,
	MONGODB_DB_NAME: process.env.MONGODB_DB_NAME,
};
