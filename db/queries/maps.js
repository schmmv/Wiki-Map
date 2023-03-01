const db = require('../connection');

const getAllMaps = () => {
  db.query(`SELECT * FROM maps`)
    .then((data) => {
      return data.rows;
    });
};

const getMapById = function(id) {
  db.query(`
    SELECT *
    FROM maps
    WHERE id = $1;`, [id])
    .then((data) => {
      return data.rows[0];
    });
};

module.exports = { getAllMaps, getMapById };
