const db = require("../services/database");

class TokensModel {
	async getToken(token) {
		return db.tokens.findOne({ token });
	}

	async saveToken(token, userId) {
		await db.tokens.insertOne({
			token,
			userId,
			createdAt: new Date(),
		});
	}

	async dropToken(token) {
		await db.tokens.findOneAndDelete({ token });
	}
}

module.exports = new TokensModel();
