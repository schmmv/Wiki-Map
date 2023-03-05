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

const getFavsByUserId = function(id) {
  return db.query(`
    SELECT maps.title, maps.user_id, latitude, longitude, zoom
    FROM maps
    JOIN favourites ON maps.id = map_id
    JOIN users ON users.id = favourites.user_id
    WHERE favourites.user_id = $1`, [id])
    .then(data => {
      return data.rows;
    });
}

const getMapsByUserId = function(id) {
  return db.query(`
    SELECT maps.title, user_id, latitude, longitude, zoom
    FROM users
    JOIN maps ON users.id = user_id
    WHERE user_id = $1`, [id])
    .then(data => {
      return data.rows;
    });
}

module.exports = { getAllMaps, getMapById, getFavsByUserId, getMapsByUserId };
