// '<div id="pindrop-form">' +
//   '<form>' +
//   '<label for="name">Name:</label><br>' +
//   '<input type="text" id="Name" name="name"><br><br>' +
//   '<label for="pinDescription">What makes it special:</label><br>' +
//   '<input type="text" id="description" name="description"><br><br>' +
//   '</form>' +
//   '<button type="submit" form="pindrop-form" value="Submit">Save Pin</button>' +
//   '<button type="button" form="pindrop-form" value="Submit">Cancel</button>'
//   ;
// window.$signUpForm = $signUpForm;

// $signUpForm.on('submit', function(event) {
//   event.preventDefault();

//   const data = $(this).serialize();
//   signUp(data)
//     .then(getMyDetails)
//     .then((json) => {
//       header.update(json.user);
//       views_manager.show('listings');
//     });
// });
// copy everything but this below v
// $('body').on('click', '#sign-up-form__cancel', function() {
//   views_manager.show('listings');
//   return false;
// });

// });
