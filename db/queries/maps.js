const db = require('../connection');

const getAllMaps = () => {
  return db.query(`SELECT * FROM maps;`)
    .then((data) => {
      return data.rows;
    });
};

const getMapById = function(id) {
  return db.query(`
    SELECT *
    FROM maps
    WHERE id = $1;`, [id])
    .then((data) => {
      return data.rows[0];
    });
};



const getMapsByUserId = function(id) {
  return db.query(`
    SELECT maps.title, maps.id, user_id, latitude, longitude, zoom
    FROM users
    JOIN maps ON users.id = user_id
    WHERE user_id = $1`, [id])
    .then(data => {
      return data.rows;
    });
}


const createMap = function (map) {
  console.log(map);
  const queryParams = [
    map.user_id,
    map.title,
    map.category,
    map.lat,
    map.lng,
    map.zoom
  ];

  const queryString = `
  INSERT INTO maps (user_id, title, category, latitude, longitude, zoom)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *`;

  return db.query(queryString, queryParams)
    .then((result) => result.rows[0])
    .catch((err) => {
      console.error(err);
      throw err;
    });
};



module.exports = { getAllMaps, getMapById, getMapsByUserId, createMap };
