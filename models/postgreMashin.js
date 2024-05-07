const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "Zevtabs@2024",
  port: 5432,
});

const find = async (mashiniiDugaar) => {
  var khariu = await pool.query(
    "SELECT * FROM tokimashin WHERE mashiniiDugaar = $1",
    [mashiniiDugaar]
  );
  console.log("khariu", khariu);
  return khariu.rows;
};

const insertOne = async (body) => {
  const { mashiniiDugaar } = body;
  await pool.query("INSERT INTO tokimashin (mashiniiDugaar) VALUES ($1)", [
    mashiniiDugaar,
  ]);
  return "Amjilttai";
};
const deleteMany = async (body) => {
  const { mashiniiDugaar } = body;
  await pool.query("DELETE FROM tokimashin WHERE mashiniiDugaar = $1", [
    mashiniiDugaar,
  ]);
  return "Amjilttai";
};

module.exports = {
  find,
  insertOne,
  deleteMany,
};
