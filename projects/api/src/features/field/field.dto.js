module.exports = {
	fieldDto(data) {
		return {
			id: data.id,
			name: data.name,
			description: data.description,
			type: data.type,
			min: data.min,
			max: data.max,
			prefix: data.prefix,
			postfix: data.postfix,
		};
	},
};
