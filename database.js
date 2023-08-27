const {ObjectId, MongoClient} = require("mongodb");
const {MONGODB_URI} = require("./config");

const client = new MongoClient(MONGODB_URI);
const connection = {};

module.exports.connect = async () => {
  await client.connect();
  const db = client.db("house");
  connection.jars = db.collection("jars");
  connection.audits = db.collection("audits");
};

module.exports.getAll = async () => {
  const list = await connection.jars.find().toArray();
  return list.map(({_id: id, ...rest}) => ({id, ...rest}))
};

module.exports.getById = async (id) => {
  return await connection.jars.findOne({_id : new ObjectId(id)});
};

module.exports.create = async (item) => {
  const res = await connection.jars.insertOne(item);
  return res.insertedId.toString();
};

module.exports.update = async (id, data) => {
  return connection.jars.findOneAndUpdate({_id : new ObjectId(id)}, {$set: data});
};

module.exports.delete = async (id) => {
  return connection.jars.findOneAndDelete({_id : new ObjectId(id)});
};

module.exports.getHistory = async () => {
  return connection.audits.find().toArray();
};

module.exports.createAudit = async (item) => {
  await connection.audits.insertOne(item);
};
