const db = require('../connection');

const getPinsByMapId = function(mapId) {
  return db.query(`
    SELECT
    id, title, description, image_url, map_id, latitude, longitude
    FROM pins
    WHERE map_id = $1;`, [mapId])
    .then((res) => {
      return res.rows;
    })
}

const getPinsByUserId = function(id) {
  return db.query(`
    SELECT
      id,
      title,
      description,
      image_url,
      map_id,
      latitude,
      longitude
    FROM pins
    WHERE user_id = $1;`, [id])
  .then((res) => {
    return res.rows;
  })
}

const remove = function (id) {
  const queryString = `DELETE FROM pins WHERE id = $1`;
  return db.query(queryString, [id]);
}

// this function is what inserts the pin form data into the pins database
// the create function is used in routes/pins-api.js
const create = function (pin) {
  console.log(pin);
  const queryParams = [
    pin.user_id,
    pin.map_id,
    pin.title,
    pin.description,
    pin.image_url,
    pin.lat,
    pin.lng
  ];

  const queryString = `
  INSERT INTO pins (user_id, map_id, title, description, image_url, latitude, longitude)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *`;

  return db.query(queryString, queryParams)
    .then((result) => result.rows[0])
    .catch((err) => {
      console.error(err);
      throw err;
    });
};

module.exports = { getPinsByUserId, create, remove, getPinsByMapId };
