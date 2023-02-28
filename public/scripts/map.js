let map, infoWindow;


const vancouver = { lat: 49.2578262, lng: -123.1941156 };
const ubc = { lat: 49.26410715655254, lng: -123.24569741813465};

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: vancouver,
    zoom: 12,
  });

  map.addListener("click", (e) => {
    addPin(e.latLng, map);
  });


  const marker = new google.maps.Marker({
    position: ubc,
    map: map,
    title: 'UBC'
  });

  infoWindow = new google.maps.InfoWindow();

  const locationButton = document.createElement("button");

  locationButton.textContent = "Show Current Location";
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

          // infoWindow.setPosition(pos);
          // infoWindow.setContent("Location found.");
          // infoWindow.open(map);
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

// User-Added Marker Function
const addPin = function (latLng, map) {
  // Populates an infoWindow with a form
  // write an HTML file with this in it and then add AJAX GET request to url
  let formString = '<div id="form">' +
  '<form>' +
  '<label for="name">Name:</label><br>' +
  '<input type="text" id="Name" name="name"><br>' +
  '<label for="pinDescription">What makes it special:</label><br>' +
  '<input type="text" id="description" name="description">' +
  '</form>';
  // Add POST AJAX request to pin api to add to database
  let pin = new google.maps.Marker({
    position: latLng,
    map: map,
  });
  map.panTo(latLng);
  pin.addListener("click", () => {
    infoWindow.setContent(formString);
    infoWindow.open({
      anchor: pin,
      map,
    });

  });
}









window.initMap = initMap;
