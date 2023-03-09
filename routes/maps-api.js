/*
 * All routes for Map Data are defined here
 * Since this file is loaded in server.js into api/maps,
 *   these routes are mounted onto /api/maps
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const mapQueries = require('../db/queries/maps');
const key = process.env.API_KEY;



router.post('/', (req, res) => {
  const userId = req.session.user_id;
  console.log(req.body);
  // the createMap function comes from db/queries/maps.js
  let formData = {...req.body};
  console.log
  formData.user_id = userId;
  mapQueries.createMap(formData)
  .then(map => {
    console.log('map response:', map);
    res.send(map);
  })
  .catch(e => {
    console.error(e);
    res.send(e)
  });
})

module.exports = router;
