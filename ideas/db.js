const List = {
	_id: "ObjectId",
	name: "string",
	isEntry: "boolean",
	config: "ObjectId",
	children: ["ObjectIds"],
	owner: "ObjectId"
};
const ListItem = {
	_id: "ObjectId",
	name: "string",
	completed: "boolean",	// ?
	count: "number",			// ?
	_: "other fields according to list's config"	// ?
};

const Config = {
	_id: "ObjectId",
	name: "string",
	sort: "string",
	view: "string",
	fields: ["ObjectIds"],
}

const Field = {
	_id: "ObjectId",
	name: "string",
	description: "string",
	type: "string",			// str/num/bool
	min: "number",			// ?
	max: "number",			// ?
	prefix: "string",		// ?
	postfix: "string",	// ?
};

const User = {
	_id: "ObjectId",
	email: "string",
	passwordHash: "string",
	role: "string", // a (admin), u (user), n (newbie)
	activationLink: "string"
};

const Token = {
	_id: "ObjectId",
	token: "string",
	userId: "ObjectId"
};
