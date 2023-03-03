const db = require('../connection');

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

module.exports = { getFavsByUserId };
