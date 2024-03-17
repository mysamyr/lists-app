const { ObjectId } = require("mongodb");
const db = require("../services/database");
const { stringifyObjectId } = require("../utils/helper");
const { USER_ROLES } = require("../constants/enums");

class UserModel {
	async getUserById(id) {
		const item = await db.users.findOne({ _id: new ObjectId(id) });
		return item && stringifyObjectId(item);
	}

	async getUserByEmail(email) {
		const item = await db.users.findOne({ email });
		return item && stringifyObjectId(item);
	}

	async getUserByActivationLink(activationLink) {
		const item = await db.users.findOne({ activationLink });
		return item && stringifyObjectId(item);
	}

	async createUser({ email, hash, activationLink }) {
		await db.users.insertOne({
			_id: new ObjectId(),
			email,
			passwordHash: hash,
			role: USER_ROLES.NEWBIE,
			activationLink,
		});
	}

	async updateUser(id, body) {
		await db.users.updateOne({ _id: new ObjectId(id) }, { $set: body });
	}
}

module.exports = new UserModel();
