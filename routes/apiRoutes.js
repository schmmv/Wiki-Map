
/*
 * All routes for Data are defined here
 * Since this file is loaded in server.js into api,
 *   these routes are mounted onto /api/
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const db = require('../db/queries/users');
const mapQueries = require('../db/queries/maps');
const favQueries = require('../db/queries/favourites');


// /api/users
router.get('/users', (req, res) => {
  db.getUsers()
    .then(users => {
      res.json({ users });
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

// /api/maps
router.get('/maps', (req, res) => {
    mapQueries.getAllMaps()
    .then(maps => {
      res.json({ maps });
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

// /api/favourites
router.get('/favourites', (req, res) => {
  favQueries.getFavs()
  .then(favs => {
    res.json({ favs });
  })
  .catch(err => {
    res.status(500).json({ error: err.message });
  });
})

// /api/favourites/add
router.post('/favourites/add', (req, res) => {
  const user_id = req.session.user_id;
  const map_id = req.data;
  favQueries.addFavourite(user_id, map_id)
  .then((res) => {
    //do nothing?
    console.log(res);
    //res.redirect?
  })
  .catch((err) => {
    res.status(500).json({ error: err.message });
  });
});

module.exports = router;
