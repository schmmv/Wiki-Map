/*
 * All routes for User Data are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /api/users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const pins = require('../db/queries/pins');

// we might want to add a /mypins route?
// and we might want to see all the pins in an area
router.get('/', (req, res) => {
  pins.getPins()
    .then(pins => {
      res.json({ pins });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});


router.post('/', (req, res) => {
  const userId = req.session.user_id;
  console.log(req.body);
  // the create function comes from db/queries/pins.js
  pins.create({...req.body})
  .then(pin => {
    console.log('pin response:', pin);
    // sends the HTTP response. parameter describes the body to be send in the response.
    // it returns an object
    res.send(pin);
  })
  .catch(e => {
    console.error(e);
    res.send(e)
  });
});

module.exports = router;
