const db = require("../../data/dbConfig");

const getAll = () => {
  return db("bilmeceler");
};

module.exports = {
  getAll,
};
