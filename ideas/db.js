const simpleList = {
	_id: "ObjectId",
	name: "ListName",
	type: 1,
	created: "Date.toJSON()",
	data: [
		{
			id: "ObjectId",
			name: "list item message",
		},
	],
};
const todoList = {
	_id: "ObjectId",
	name: "ListName",
	type: 2,
	created: "Date.toJSON()",
	data: [
		{
			id: "ObjectId",
			name: "list item message",
			complete: true,
		},
	],
};
const complexList = {
	_id: "ObjectId",
	name: "ListName",
	type: 3,
	created: "Date.toJSON()",
	data: [
		{
			id: "ObjectId",
			name: "list item name",
			count: 42,
			// other fields according to `fields` configuration
		},
	],
	view: "{name} schema for list view...",
	printView: "{name} schema for print view...",
	fields: [
		{
			name: "db field name",
			description: "field view name",
			type: "string | number",
			min: 3,
			max: 99,
			postfix: "postfix for field display", // optional
		},
	],
	sort: "field name for sorting", // optional
};
