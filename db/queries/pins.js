const db = require('../connection');

// TODO: make use of user in WHERE clause
// const getPinsByUserId = (id) => {
//   return db.query(`
//     SELECT maps.title as Map, pins.title as Pin from pins
//      FROM pins
//     JOIN maps ON map_id = maps.id
//     WHERE pins.user_id = $1
//     ORDER BY map_id;`, [id])
//     .then(data => {
//       console.log(data.rows);
//       return data.rows;
//     });
// };
const getPinsByUserId = function(id) {
  return db.query(`
    SELECT title, description, image_url, map_id
    FROM pins
    WHERE user_id = $1;`, [id])
    .then((res) => {
      return res.rows;
    })
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

module.exports = { getPinsByUserId, create };
