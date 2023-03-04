const express = require('express');
const router  = express.Router();
const mapsQueries = require('../db/queries/maps');

router.get('/', (req, res) => {
  const userID = req.session.user_id;
  mapsQueries.getAllMaps()
    .then(maps => {
      return res.render('all_maps', { maps, user: {id: userID} });
    });
});

module.exports = router;
