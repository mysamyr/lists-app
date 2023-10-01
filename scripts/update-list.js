const { ObjectId } = require("mongodb");
const db = require("../src/database");

const listId = "";

const runesGrade = [
	"El",
	"Eld",
	"Tir",
	"Nef",
	"Eth",
	"Ith",
	"Tal",
	"Ral",
	"Ort",
	"Thul",
	"Amn",
	"Sol",
	"Shael",
	"Dol",
	"Hel",
	"Io",
	"Lum",
	"Ko",
	"Fal",
	"Lem",
	"Pul",
	"Um",
	"Mal",
	"Ist",
	"Gul",
	"Vex",
	"Ohm",
	"Lo",
	"Sur",
	"Ber",
	"Jah",
	"Cham",
	"Zod",
];

(async () => {
	await db.connect();
	const listData = await db.getById(listId);

	const newData = listData.data.map((i) => {
		const runeIdx = runesGrade.findIndex((r) => r === i.name);
		return {
			...i,
			lvl: runeIdx + 1,
		};
	});
	const newFields = listData.fields.concat([
		{
			name: "lvl",
			description: "Рівень",
			type: "number",
			min: 1,
			max: 33,
		},
	]);
	const sort = "lvl";

	await db.connection.lists.updateOne(
		{ _id: new ObjectId(listId) },
		{
			$set: {
				data: newData,
				fields: newFields,
				sort,
			},
		},
	);
	return db.connection.close();
})();

process.on("SIGINT", async () => {
	await db.connection.close();
	process.exit(0);
});
