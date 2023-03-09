/*
 * All routes for User Data are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /api/users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const pins = require('../db/queries/pins');

// we might want to add a /mypins route?
// and we might want to see all the pins in an area
router.get('/', (req, res) => {
  pins.getPinsByUserId(req.session.user_id)
    .then(pins => {
      res.json({ pins });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});


router.post('/', (req, res) => {
  const userId = req.session.user_id;
  console.log(req.body);
  // the create function comes from db/queries/pins.js
  let formData = {...req.body};
  formData.user_id = userId;
  pins.create(formData)
  .then(pin => {
    console.log('pin response:', pin);
    // sends the HTTP response. parameter describes the body to be send in the response.
    // it returns an object
    res.send(pin);
  })
  .catch(e => {
    console.error(e);
    res.send(e)
  });
});

/** Michele's routes for one-map view page
 * POST for edit and delete pins
 *******************************/
//edit pin /api/pins/:id
router.post('/:id', (req, res) => {
  // capture the pin id
  const pinId = req.params.id
  // capture the queryParams from the req.body
  console.log('sent data:', req.body);
  let formData = (req.body);

  pins.updatePin(pinId, formData)
  .then(pin => {
    console.log('pin response:', pin);
    res.send(pin);
  })
  .catch(e => {
    console.error(e);
    res.send(e)
  });
});

//delete pin /api/pins/:Id/delete
router.post('/:id/delete', (req, res) => {
  const pinId = req.params.id
  console.log(pinId);
  pins.remove(pinId, req.session.user_id).then(pin => {
    res.send("Pin deleted");
  })

});

/**Karilyn's routes
 * for edit/delete pins from root page
 **************************************/
router.put('/:id', (req, res) => {
  // capture the pin id
  const pinId = req.params.id
  // capture the queryParams from the req.body
  let formData = {...req.body};
  pins.update(pinId, formData, req.session.user_id)
  .then(pin => {
    console.log('pin response:', pin);
    res.send(pin);
  })
  .catch(e => {
    console.error(e);
    res.send(e)
  });
});


router.delete('/:id', (req, res) => {
  const pinId = req.params.id
  console.log(pinId);
  pins.remove(pinId, req.session.user_id).then(pin => {
    console.log("pin deleted");
    res.send("Pin deleted");
  })
})

module.exports = router;
