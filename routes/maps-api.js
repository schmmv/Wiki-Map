const express = require('express');
const router  = express.Router();
const mapsQueries = require('../db/queries/maps');

router.get('/', (req, res) => {
  mapsQueries.getAllMaps()
    .then(maps => {
      res.json({ maps });
    });
});

module.exports = router;
