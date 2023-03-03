const db = require('../connection');

const getUsers = () => {
  return db.query('SELECT * FROM users;')
    .then(data => {
      return data.rows;
    });
};

const getUserById = function(id) {
  return db.query(`
    SELECT *
    FROM users
    WHERE id = $1`, [id])
    .then(data => {
      return data.rows[0];
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
module.exports = { getUsers, getUserById, getMapsByUserId };
