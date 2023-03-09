const db = require('../connection');

const getPinsByMapId = function(mapId) {
  return db.query(`
    SELECT
    id, title, description, image_url, map_id, latitude, longitude, user_id
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

const remove = function (id, userId) {
  const queryString = `DELETE FROM pins WHERE id = $1 AND user_id = $2;`;
  return db.query(queryString, [id, userId]);
}

// this function is what inserts the pin form data into the pins database
// the create function is used in routes/pins-api.js
const createPin = function (pin, mapId, userId) {
  console.log(pin.title);
  const queryParams = [
    mapId,
    userId,
    pin.title,
    pin.description,
    pin.img,
    pin.lat,
    pin.lng

  ];

  const queryString = `
  INSERT INTO pins (user_id, map_id, title, description, image_url, latitude, longitude)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;`;

  return db.query(queryString, queryParams)
    .then((result) => result.rows[0])
    .catch((err) => {
      console.error(err);
      throw err;
    });
};


const updatePin = function (id, pin) {
  const queryParams = [
    pin.title,
    pin.description,
    pin.img,
    id
  ];

  const queryString = `
    UPDATE
      pins
    SET
      title = $1,
      description = $2,
      image_url = $3
    WHERE
      id = $4
    RETURNING *;`;

  return db.query(queryString, queryParams)
    .then((result) => {
      console.log('query returning:', result.rows[0])
    return result.rows[0]})
    .catch((err) => {
      console.error(err);
      throw err;
    });
}

module.exports = { getPinsByUserId, createPin, remove, updatePin, getPinsByMapId };

