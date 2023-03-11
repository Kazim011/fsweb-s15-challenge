const db = require("../../data/dbConfig");

function getAll() {
  return db("users");
}

function getById(id) {
  return db("users").where({ id }).first();
}

function getByFilter(filter) {
  return db("users").where(filter).first();
}

async function create(payload) {
  const [id] = await db("users").insert(payload);
  return getById(id);
}

module.exports = {
  getAll,
  getById,
  getByFilter,
  create,
};
