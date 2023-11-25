module.exports.stringifyObjectId = ({ _id: id, ...rest }) => ({
	id: id.toString(),
	...rest,
});

module.exports.getViewFields = (schema) => {
	let result = [];
	let field = null;
	for (let l of schema) {
		if (field === null && l === "{") {
			field = "";
			continue;
		}
		if (field !== null) {
			if (l === "}") {
				result.push(field);
				field = null;
			} else {
				field += l;
			}
		}
	}
	return result;
};
