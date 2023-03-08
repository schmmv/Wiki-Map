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
const favQueries = require('../db/queries/favourites');

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

  if (userID !== req.session.user_id) {
    return res.status(401).send('Unauthorized');
  }

  Promise.all([mapQueries.getMapsByUserId(userID), favQueries.getFavsByUserId(userID)])
    .then((responses) => {

      const favs = responses[1];
      const maps = responses[0];
      for (const map of maps) {
        map.isFav = false;
        for (const fav of favs) {
          if (fav.map_id === map.id){
            map.isFav = true;
          }
        }
      }
      const templateVars = {
        maps,
        user: userID,
        title: 'My Maps'
      }
      res.render('maps', templateVars);

    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });



});

// /users/:id/favourites
router.get('/:id/favourites', (req, res) => {
  const userID = req.params.id;

  if (userID !== req.session.user_id) {
    return res.status(401).send('Unauthorized');
  }

  favQueries.getFavMapsByUserId(userID)
    .then(maps => {
      for (const map of maps) {
        map.isFav = true;
      }
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
      // res.json({ pins });
      const templateVars = { pins: pins, user: userID };
      res.render('my_pins', templateVars);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
})
module.exports = router;

