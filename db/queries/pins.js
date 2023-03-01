const db = require('../connection');

// TODO: make use of user in WHERE clause
const getPins = (user) => {
  return db.query('SELECT * FROM pins;')
    .then(data => {
      return data.rows;
    });
};

module.exports = { getPins };
