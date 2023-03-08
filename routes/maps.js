// /maps router

const express = require("express");
const router = express.Router();
const mapQueries = require('../db/queries/maps');
const favQueries = require('../db/queries/favourites');
const key = process.env.API_KEY;

router.get('/', (req, res) => {
  const userID = req.session.user_id;

  Promise.all([mapQueries.getAllMaps(), favQueries.getFavsByUserId(userID)])
  .then((responses) => {
    const favs = responses[1];
    const maps = responses[0];
    for (const map of maps) {
      map.isFav = false;
      for (const fav of favs) {
        if (fav.map_id === map.id) {
          map.isFav = true;
        }
      }
    }
    const templateVars = {
      maps,
      user: userID,
      title: 'Maps',
      key
    }
    res.render('maps', templateVars);
  })
  .catch(err => {
    res.status(500).json({ error: err.message });
  });
});

router.get('/:id', (req, res) => {
  const mapID = req.params.id;
  const userID = req.session.user_id;

  mapQueries.getMapById(mapID)
  .then(map => {
    const templateVars = { map, user: userID, key }
    res.render('one_map', templateVars)
  })
})

module.exports = router;


