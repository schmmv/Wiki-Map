let map, infoWindow;


const vancouver = { lat: 49.2578262, lng: -123.1941156 };
const ubc = { lat: 49.26410715655254, lng: -123.24569741813465};

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: vancouver,
    zoom: 12,
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


  // Add event listener to add a pin on user click
  map.addListener("click", (e) => {
    addPin(e.latLng, map);
  });

  // const marker = new google.maps.Marker({
  //   position: ubc,
  //   map: map,
  //   title: 'UBC'
  // });

  infoWindow = new google.maps.InfoWindow();
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
// Add AJAX call that retrieves /pindrop.html
const addPin = function (latLng, map) {
  // Populates an infoWindow with a form
  // write an HTML file with this in it and then add AJAX GET request to url
  // let formString = '<form id="pindrop-form" method="POST" action="/api/pins">' +
  // '<label for="name">Name:</label><br>' +
  // '<input type="text" id="Name" name="name"><br><br>' +
  // '<label for="pinDescription">What makes it special:</label><br>' +
  // '<input type="text" id="description" name="description"><br><br>' +
  // '</form>' +
  // '<button type="submit" form="pindrop-form" value="Submit">Save Pin</button>' +
  // '<button type="button" form="pindrop-form" value="Submit">Cancel</button>'
  // ;
  // Add POST AJAX request to pin api to add to database
  let pin = new google.maps.Marker({
    position: latLng,
    map: map,
  });
  map.panTo(latLng);
  console.log(latLng);
  pin.addListener("click", () => {
    // the click needs to access pinDropForm
    const advancedMarkerView = new google.maps.marker.AdvancedMarkerView({
      map,
      content: buildContent(),
      position: latLng,
      title: "hello world"
    });
  });
}


function buildContent(position) {
  const content = document.createElement("div");

  content.classList.add("pin");
  content.innerHTML = `
  <form id="pindrop-form" = method="POST" action="/api/pins">
    <input type="hidden" name="lat" value="${position.lat}">
    <input type="hidden" name="lng" value="${position.lng}">
    <label for="name">Name:</label><br>
    <input type="text" id="Name" name="name"><br><br>
    <label for="pinDescription">What makes it special:</label><br>
    <input type="text" id="description" name="description"><br><br>
  </form>
  <button type="submit" form="pindrop-form" value="Submit">Save Pin</button>
  <button type="button" form="pindrop-form" value="Submit">Cancel</button>
  `;
  return content;
}

// $(() => {


//   window.$pinDropForm = $pinDropForm;

//   $pinDropForm.on('submit', function (e) {
//     e.preventDefault();

//     const data = $(this).serialize();
//     submitPinInfo(data)
//     .then((json) => {
//       update(json.data);
//     })
//     .catch((error) => {
//       console.error(error);
//     })
//   });

// });




window.initMap = initMap;
