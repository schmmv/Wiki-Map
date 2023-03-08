const db = require('../connection');


const getFavs = function() {
  return db.query(`
    SELECT * FROM favourites;`)
    .then(res => res.rows);
};

const getFavsByUserId = function(id) {
  return db.query(`
    SELECT * FROM favourites
    WHERE user_id = $1;`, [id])
    .then(res => res.rows);
};

const getFavMapsByUserId = function(id) {
  return db.query(`
    SELECT maps.id, maps.title, maps.user_id, latitude, longitude, zoom
    FROM maps
    JOIN favourites ON maps.id = map_id
    JOIN users ON users.id = favourites.user_id
    WHERE favourites.user_id = $1`, [id])
    .then(data => {
      console.log(data.rows);
      return data.rows;
    });
};

const addFavourite = function(user_id, map_id) {
  return db.query(`
    INSERT INTO favourites (user_id, map_id)
    VALUES ($1, $2)
    RETURNING *;`, [user_id, map_id])
    .then((res) => {
      return res.rows[0];
    });
};

const removeFavById = function(id) {
  return db.query(`
    DELETE FROM favourites
    WHERE id = $1
    RETURNING *`, [id]);
}



module.exports = { getFavMapsByUserId, addFavourite, getFavs, getFavsByUserId, removeFavById }
