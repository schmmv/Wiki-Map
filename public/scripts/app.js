
//called from the one_map.ejs view template
// Initialize and add the map
let map, infoWindow, orphanMarker;

function addPinToMap(pin) {
  console.log(pin);

  const marker = new google.maps.Marker({
    position: { lat: pin.latitude, lng: pin.longitude },
    map: map,
    title: pin.title,
    draggable: true,
    //* what does this mean?
    optimized: false,
  });

  marker.pinData = pin;

  //when pin is clicked:
  marker.addListener("click", () => {
    //pop up info window
    infoWindow.close();
    console.log("this when marker is clicked:", this);
    const contentString = `<div id="info-window-content">
      <img width="100" src="${this.pinData.image_url}">
      <h4>${this.pinData.title}</h4>
      <p>${this.pinData.description}</p>
    </div>`;
    infoWindow.setContent(contentString);
    infoWindow.open(marker.getMap(),marker);

    //if pin belongs to me, pop up edit/delete form
    if (pin.isMine){
      $("#create_pin_button").hide();
      $("#edit_pin_button").show();
      $("#delete_pin_button").show();
      if (orphanMarker){
        orphanMarker.setMap(null);
      }

      const $form = $('#pindrop-form');
      const $formWindow = $('.pin-info-window');
      $form.find('input[name="title"]').val(pin.title);
      $form.find('input[name="description"]').val(pin.description);
      $form.find('input[name="img"]').val(pin.image_url);
      $form.find('input[name="lat"]').val(pin.latitude);
      $form.find('input[name="lng"]').val(pin.longitude);
      $formWindow.show();

      //if I save changes, edit pin in database
      $("#edit_pin_button").off('click');
      $("#edit_pin_button").click((e) => {
        e.preventDefault();
        $.ajax({
          type: "PUT",
          url: `/api/pins/${pin.id}`,
          // collect the serialized data from the form
          data: $form.serialize(),
          dataType: "json",
        })
        .done((response) => {
            console.log('edited', response);
            $formWindow.hide();
            // take the new content from the form
            infoWindow.close();
            marker.pinData = response;
            // window.location.reload();
          })

        });

      //if I hit delete, delete pin from database
      $("#delete_pin_button").off('click');
      $("#delete_pin_button").click((e) => {
        e.preventDefault();
        $.ajax({
          url: `/api/pins/${pin.id}`,
          type: "DELETE",})
          .done((data) => {
            console.log('deleted');
            $formWindow.hide();
            // remove marker from map
            marker.setMap(null);
          })
        });

        //if I hit Cancel, hide form
      $form.find('.remove-marker').click((e) => {
        //cancel, aka hide it
        $formWindow.hide();
        infoWindow.close();
        e.preventDefault();
      });
    }
  })
}

function initMapView() {

  //use mapData passed to ejs one_map template
  const center = { lat: mapData.lat, lng: mapData.lng };
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: mapData.zoom,
    center
  });
  map.addListener('center_changed', e => {
    const center = map.getCenter();
    const url = "/?loc=" + [center.lat(), center.lng()].join(",");
    window.history.replaceState(null , null, url);
  });

  //**new stuff */

  //* Google maps Places Search
  // Create the search box and link it to the UI element.
  const input = document.getElementById("pac-input");
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



  //* Google maps geolocation functionality
  let infoWindow2 = new google.maps.InfoWindow();
  // create Show Current Location button to geolocate users
  const locationButton = document.createElement("button");
  locationButton.textContent = "Pan to Current Location";
  locationButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(locationButton);
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
          handleLocationError(true, infoWindow2, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow2, map.getCenter());
    }
  });

//**end of new stuff */
  infoWindow = new google.maps.InfoWindow();
  const $formWindow = $('.pin-info-window');
  const $form = $('#pindrop-form');
  let orphanMarker;

  //allow users to add new pin by clicking on map
  map.addListener('click', (e) => {
    pin = new google.maps.Marker({
      position: e.latLng, // map coordinates where user clicked
      map: map,
      draggable: true
    });
    // this will remove a pin from the map if it doesn't get info added
    orphanMarker = pin;

    // set the value of the inputs in the pin form
    $form.find('input[name="title"]').val("");
    $form.find('input[name="description"]').val("");
    $form.find('input[name="img"]').val("");
    //add the lat and long from Google but keep it hidden
    $form.find('input[name="lat"]').val(e.latLng.lat);
    $form.find('input[name="lng"]').val(e.latLng.lng);
    $form.find("#create_pin_button").show();
    $formWindow.show();
    // hide edit and delete buttons when adding a new pin
    $("#edit_pin_button").hide();
    $("#delete_pin_button").hide();
    // remove the pin if the user clicks cancel
    $form.find('.remove-marker').click((e) => {
      e.preventDefault();
      //cancel, aka hide the form
      $formWindow.hide();
      pin.setMap(null);
    });

    // function will get executed on click of submit button
    $("#create_pin_button").off('click');
    $("#create_pin_button").click((e) => {
      e.preventDefault();
      const url = $form.attr('action');
      // ajax POST request to /api/pins
      $.post({
        url: url,
        data: $form.serialize(),
        dataType: "json",
        encode: true,
      }).done(function (newPin) {
        $formWindow.hide();
        // because the pin gets data it stays on the map
        orphanMarker = null;
        // window.location.reload();
        addPinToMap(newPin);
      });

    });
    $form.show();
  });

    //get pins to display on map
  $.ajax({
    method: 'GET',
    //* do we even need the map_id?
    url: `/api/pins`
  })
  .done((response) => {

    const pins = response.pins;
    //for each pin:
    //1- set the content of the info window
    //2- create the marker on the map
    //3- add listener for marker
    ///3.1 - if clicked, open info window, and if it belongs to the logged in user pop up edit form
    for (const pin of pins) {
      addPinToMap(pin);
    }
  })

  //* Save a map
  const $mapWindow = $(".save-map-form-window");
  const $mapForm = $('.map-form-container');
  $(".open-button").click((e) => {

    $(".open-button").hide();
    // set the value of the inputs in the pin form
    $mapForm.find('input[name="title"]').val("");
    $mapForm.find('input[name="category"]').val("");
    $mapForm.find("#save-map-btn").show();
    $mapWindow.show();
    // remove the popup if the user clicks cancel
    $mapForm.find('.btn-cancel').click((e) => {
      e.preventDefault();
      //cancel, aka hide the form
      $mapWindow.hide();
      // but pop the Save Map button again
      $(".open-button").show();
    });

    // function will get executed on click of submit button
    $("#save-map-btn").click((e) => {
      const center = map.getCenter();
      $mapForm.find('input[name=lat]').val(center.lat());
      $mapForm.find('input[name=lng]').val(center.lng());
      $mapForm.find('input[name=zoom]').val(map.getZoom())

      const url = $mapForm.attr('action');
      // ajax POST request to /api/maps

      $.post({
        url: url,
        data: $mapForm.serialize(),
        dataType: "json",
        encode: true
      }).done(function (data) {
        $mapWindow.hide();
      });
      e.preventDefault();
    });

    $mapForm.show();
  });
};


// new stuff
  //* Geolocation function
function handleLocationError(browserHasGeolocation, infoWindow2, pos) {
  infoWindow2.setPosition(pos);
  infoWindow2.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow2.open(map);
}

window.initMapView = initMapView;

