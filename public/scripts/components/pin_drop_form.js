// this is the form containing data users input about their pin

$(() => {

  const $pinDropForm = $(`
  <form id="pindrop-form" = method="POST" action="/api/pins">
  <label for="name">Name:</label><br>
  <input type="text" id="Name" name="name"><br><br>
  <label for="pinDescription">What makes it special:</label><br>
  <input type="text" id="description" name="description"><br><br>
  </form>
  <button type="submit" form="pindrop-form" value="Submit">Save Pin</button>
  <button type="button" form="pindrop-form" value="Submit">Cancel</button>
  `);

  window.$pinDropForm = $pinDropForm;

  $pinDropForm.on('submit', function (e) {
  e.preventDefault();

    const data = $(this).serialize();
    submitPinInfo(data)
    .then((json) => {
      header.update(json.data);
    })
    .catch((error) => {
      console.error(error);
    })
  });

});

