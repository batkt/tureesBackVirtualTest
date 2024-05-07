const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "Zevtabs@2024",
  port: 5432,
});

const find = (mashiniiDugaar) => {
  pool.query(
    "SELECT * FROM TokiMashin WHERE mashiniiDugaar = $1",
    [mashiniiDugaar],
    (error, results) => {
      if (error) {
        throw error;
      }
      return results.rows;
    }
  );
};

const insertOne = (body) => {
  const { mashiniiDugaar } = body;

  pool.query(
    "INSERT INTO TokiMashin (mashiniiDugaar) VALUES ($1)",
    [mashiniiDugaar],
    (error, results) => {
      if (error) {
        throw error;
      }
      return "Amjilttai";
    }
  );
};
const deleteMany = (body) => {
  const { mashiniiDugaar } = body;
  pool.query(
    "DELETE FROM TokiMashin mashiniiDugaar = $1",
    [mashiniiDugaar],
    (error, results) => {
      if (error) {
        throw error;
      }
      return "Amjilttai";
    }
  );
};

module.exports = {
  find,
  insertOne,
  deleteMany,
};
