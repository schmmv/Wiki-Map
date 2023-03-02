/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const db = require('../db/queries/users');

router.get('/:id', (req, res) => {
  const userID = req.session.user_id;
  db.getUserById(userID)
  .then(user => {
    return res.render('users',{ user });
  })

});

module.exports = router;
