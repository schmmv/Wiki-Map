//mounted on /maps

const express = require('express');
const router = express.Router();
const mapsQueries = require('../db/queries/maps');

router.get('/:id', (req, res) => {
  const userID = req.session.user_id;
  console.log('in get');
  mapsQueries.getMapById(req.params.id)
    .then((map) => {
      res.render('one_map', { map, user: {id: userID} });
    });

});

router.post('/:id', (req, res) => {
  console.log('in post', req, res);
    res.send({ redirectTo: `/maps/${req.params.id}`});
});

module.exports = router;
