module.exports = {
	listDto(data, config) {
		return {
			id: data.id,
			name: data.name,
			type: data.type,
			config,
		};
	},
	listTreeDto(data) {
		return {
			id: data._id.toString(),
			name: data.name,
			children: data.children,
		};
	},
};
