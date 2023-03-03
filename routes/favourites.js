const express = require('express');
const router  = express.Router();
const db = require('../db/queries/favs');

router.get('/:id', (req, res) => {
  const userID = req.session.user_id;

  db.getFavsByUserId(userID)
    .then(maps => {
      console.log(maps);
      return res.render('my_favs', { maps, user: {id: userID } });
    });
});

module.exports = router;
