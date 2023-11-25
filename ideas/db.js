const List = {
	_id: "ObjectId",
	name: "string",
	isEntry: "boolean",
	config: "ObjectId",
	children: ["ObjectIds"],
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
