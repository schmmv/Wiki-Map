/*
 * All routes for User Data are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /api/users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const userQueries = require('../db/queries/users');

router.get('/', (req, res) => {
  userQueries.getUsers()
    .then(users => {
      res.json({ users });
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

router.get('/:id/maps', (req, res) => {
  const userID = req.session.user_id;

  userQueries.getMapsByUserId(userID)
    .then(maps => {
      return res.render('my_maps', { maps, user: {id: userID } });
    });
})
module.exports = router;
