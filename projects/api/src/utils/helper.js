module.exports.stringifyObjectId = ({ _id: id, ...rest }) => ({
	id: id.toString(),
	...rest,
});
module.exports.stringifyObjectIds = ({ _id: id, ...rest }, keys = []) => {
	const stringifiedFields = keys.reduce((acc, key) => {
		acc[key] = rest[key] && rest[key].toString();
		return acc;
	}, {});

	return {
		id: id.toString(),
		...rest,
		...stringifiedFields,
	};
};

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
