/*
 * All routes for User Data are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /api/users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const pinQueries = require('../db/queries/pins');

// we might want to add a /mypins route?
// and we might want to see all the pins in an area
router.get('/pins', (req, res) => {
  pinQueries.getPins()
    .then(pins => {
      res.json({ pins });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});


// router.post('/pins', (req, res) => {
//   pinQueries.addPin()
//   // look up how to do the request object
//     .then(pins => {
//       res.json({ pins });
//     })
//     .catch(err => {
//       res
//         .status(500)
//         .json({ error: err.message });
//     });
// });
module.exports = router;

// look at this for help
router.post('/pins', (req, res) => {
  const userId = req.session.userId;
  database.addPin({...req.body, owner_id: userId})
    .then(property => {
      res.send(property);
    })
    .catch(e => {
      console.error(e);
      res.send(e)
    });
});

return router;
