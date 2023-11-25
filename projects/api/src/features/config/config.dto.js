module.exports = {
	configDto(data, fieldsMap) {
		const fields = data.fields.map((id) => fieldsMap[id]);

		return {
			...data,
			id: data.id.toString(),
			fields,
		};
	},
};
