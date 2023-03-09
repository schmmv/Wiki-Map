
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
const pinQueries = require('../db/queries/pins');


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
  const userID = req.session.user_id;
  favQueries.getFavsByUserId(userID)
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
  const map_id = req.body.map;
  favQueries.addFavourite(user_id, map_id)
  .then((res) => {
    //do nothing?
    //res.redirect?
  })
  .catch((err) => {
    res.status(500).json({ error: err.message });
  });
});

// /api/favourites/:id (delete)
router.post('/favourites/:mapid', (req, res) => {

  const user_id = req.session.user_id;

  const map_id = Number(req.params.mapid);

 favQueries.getFavsByUserId(user_id)
  .then((res) => {
    let favId = null;
    for (const fav of res) {
      if (fav.map_id === map_id) {
        favId = fav.id;
      }
    }
    return favQueries.removeFavById(favId);
  })
  .then((res) => {
    //do nothing i guess?
  })
  .catch((err) => {
    res.status(500).json({ error: err.message });
  });

});

router.get('/pins/:mapId', (req, res) => {

  pinQueries.getPinsByMapId(req.params.mapId)
  .then((pins) => {
    for (const pin of pins) {
      pin.isMine = (pin.user_id === Number(req.session.user_id));
      delete pin.user_id;
    }
    res.json({ pins });
  })
  .catch(err => {
    res.status(500).json({ error: err.message });
  });
})

module.exports = router;
