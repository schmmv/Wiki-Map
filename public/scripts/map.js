let map, infoWindow, pin;


const vancouver = { lat: 49.2578262, lng: -123.1941156 };
const ubc = { lat: 49.26410715655254, lng: -123.24569741813465};

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: vancouver,
    zoom: 15,
    mapId: 'DEMO_MAP_ID'
  });

  // Create the search box and link it to the UI element.
  const input = document.getElementById("places-search");
  const searchBox = new google.maps.places.SearchBox(input);

  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(input);
  // Bias the SearchBox results towards current map's viewport.
  map.addListener("bounds_changed", () => {
    searchBox.setBounds(map.getBounds());
  });

  let markers = [];

  // Listen for the event fired when the user selects a prediction and retrieve more details for that place.
  searchBox.addListener("places_changed", () => {
    const places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }
    // Clear out the old markers.
    markers.forEach((marker) => {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    const bounds = new google.maps.LatLngBounds();

    places.forEach((place) => {
      if (!place.geometry || !place.geometry.location) {
        console.log("Returned place contains no geometry");
        return;
      }

      const icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25),
      };

      // Create a marker for each place.
      markers.push(
        new google.maps.Marker({
          map,
          icon,
          title: place.name,
          position: place.geometry.location,
        })
      );
      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });


  let infoWindow = new google.maps.InfoWindow();
  // create Show Current Location button to geolocate users
  const locationButton = document.createElement("button");
  locationButton.textContent = "Pan to Current Location";
  locationButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  locationButton.addEventListener("click", () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          map.setCenter(pos);
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });

  let pin;
  // Drop a pin on user click
  map.addListener('click', (e) => {
    pin = new google.maps.Marker({
      position: e.latLng, // map coordinates where user clicked
      map: map,
      draggable: true, // set pin to draggable
    });

    const $newPinForm = $('.pin-info-window');
    // set the value of the inputs in the pin form
    $newPinForm.find('textArea[name="title"]').val("");
    $newPinForm.find('textArea[name="description"]').val("");
    //look at the latLng object and see what it looks like
    $newPinForm.find('input[name="lat"]').val(e.latLng.lat);
    $newPinForm.find('input[name="lng"]').val(e.latLng.lng);
    $newPinForm.find("#create_pin_button").show();
    // hide the edit and delete buttons when adding a new pin
    $("#edit_pin_button").hide();
    $("#delete_pin_button").hide();
    $newPinForm.find('.remove-marker').click((e) => {
      //cancel, aka hide it
      $newPinForm.hide();
      pin.setMap(null);
      e.preventDefault();
    });
    // function will get executed on click of submit button
    $("#create_pin_button").click((e) => {
      const $form = $('#pindrop-form');
      const url = $form.attr('action');

      $.post({
        url: url,
        data: $form.serialize(),
        dataType: "json",
        encode: true,
      }).done(function (data) {
        $newPinForm.hide();
        console.log(data);
      });

      e.preventDefault();

    });

    $newPinForm.show();
  });

  $.get("/api/pins", (data, status) => {
    // iterate through pins
    data.pins.forEach(pin => {
      console.log(pin.title)
      // add marker for each pin
      let marker = new google.maps.Marker({
        position: {
          lat: pin.latitude,
          lng: pin.longitude,
        },
        map: map,
        draggable: true,
      });
      marker.addListener("click", () => {
        console.log(marker);
        // show the pin form and set the values for the pin form
        const $newPinForm = $('.pin-info-window');

        $("#create_pin_button").hide();
        $newPinForm.find('textArea[name="title"]').val(pin.title);
        $newPinForm.find('textArea[name="description"]').val(pin.description);
        $newPinForm.find('input[name="lat"]').val(pin.latitude);
        $newPinForm.find('input[name="lng"]').val(pin.longitude);
        $newPinForm.show();
        // if user clicks on the cancel button, the form will disappear
        $newPinForm.find('.remove-marker').click((e) => {
          //cancel, aka hide it
          $newPinForm.hide();
          e.preventDefault();
          textArea.value = '';
        });


        $("#delete_pin_button").click((e) => {

          $.ajax("/api/pins/" + pin.id, {
            type: "DELETE",
            success: (data) => {
              console.log('deleted');
              $newPinForm.hide();
              // remove marker from map
              marker.setMap(null);
            }
          });

          e.preventDefault();
        });

        $("#edit_pin_button").click((e) => {

          $.ajax("/api/pins/" + pin.id, {
            type: "PUT",
            success: (data) => {
              console.log('edited');
              $newPinForm.hide();
            }
          });
          e.preventDefault();
          textArea.value = '';
        })
      });
    });
    console.log(data);
  });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}

window.initMap = initMap;
