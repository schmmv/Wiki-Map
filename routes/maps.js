// /maps router

const express = require("express");
const router = express.Router();
const db = require('../db/queries/maps');

router.get('/', (req, res) => {
  const userID = req.session.user_id;
    db.getAllMaps()
    .then(maps => {
      const templateVars = { maps: maps, user: userID, title: 'Maps' };
      res.render('maps', templateVars);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

router.get('/:id', (req, res) => {
  const mapID = req.params.id;
  const userID = req.session.user_id;

  db.getMapById(mapID)
  .then(map => {
    const templateVars = { map, user: userID }
    res.render('index', templateVars)
  })
})

module.exports = router;


