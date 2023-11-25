module.exports = {
	listDto(data, config) {
		return {
			id: data.id,
			name: data.name,
			type: data.type,
			config,
		};
	},
};
