const submitPinInfo = function (data) {
  return $.ajax({
    method: "POST",
    url: "/api/pins",
    data,
  });
}

exports.submitPinInfo = submitPinInfo;


const addPinToDb = function (pin) {
  const queryParams = [
    pin.user_id,
    pin.map_id,
    pin.title,
    pin.description,
    pin.image_url,
    pin.latitude,
    pin.longitude
  ];

  const queryString = `
  INSERT INTO pins (user_id, map_id, title, description, image_url, latitude, longitude)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *`;

  return db.query(queryString, queryParams)
    .then((result) => result.rows[0])
    .catch((err) => {
      console.error(err);
      throw err;
    })
};

exports.addPinToDb = addPinToDb;

