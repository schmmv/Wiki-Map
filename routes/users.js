/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const db = require('../db/queries/users');
const mapQueries = require('../db/queries/maps');
const pinQueries = require('../db/queries/pins');

// /users/:id
router.get('/:id', (req, res) => {
  const userID = req.session.user_id;
  db.getUserById(userID)
  .then(user => {
    return res.render('users',{ user });
  })

});

// /users/:id/maps
router.get('/:id/maps', (req, res) => {
  const userID = req.params.id;
  console.log(`inside get /users/${userID}/maps`);

  if (userID !== req.session.user_id) {
    return res.status(401).send('Unauthorized');
  }
  mapQueries.getMapsByUserId(userID)
    .then(maps => {
      const templateVars = { maps: maps, user: userID, title: 'My Maps' };
      console.log(maps);
      res.render('maps', templateVars);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

// /users/:id/favourites
router.get('/:id/favourites', (req, res) => {
  const userID = req.params.id;

  if (userID !== req.session.user_id) {
    return res.status(401).send('Unauthorized');
  }

  mapQueries.getFavsByUserId(userID)
    .then(maps => {
      const templateVars = { maps: maps, user: userID, title: 'My Favourites' };
      res.render('maps', templateVars);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

// /users/:id/pins
router.get('/:id/pins', (req, res) => {
  const userID = req.params.id;
  if (userID !== req.session.user_id) {
    return res.status(401).send('Unauthorized');
  }
  pinQueries.getPinsByUserId(userID)
    .then(pins => {
      res.json({ pins });
      // const templateVars = { pins: pins, user: userID };
      // res.render('pins', templateVars);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
})
module.exports = router;

