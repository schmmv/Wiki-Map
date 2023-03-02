const db = require('../connection');

// TODO: make use of user in WHERE clause
const getPins = (user) => {
  return db.query('SELECT * FROM pins;')
    .then(data => {
      return data.rows;
    });
};

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

module.exports = { getPins, create };
