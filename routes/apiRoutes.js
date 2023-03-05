
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

router.get('/maps', (req, res) => {
    mapQueries.getAllMaps()
    .then(maps => {
      res.json({ maps });
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

module.exports = router;
