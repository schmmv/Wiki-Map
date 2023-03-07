let map, infoWindow, pin, formString;


const vancouver = { lat: 49.2578262, lng: -123.1941156 };
const ubc = { lat: 49.26410715655254, lng: -123.24569741813465};
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: vancouver,
    zoom: 14,
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

  let pin;
  // Drop a pin on user click
  map.addListener('click', (e) => {
    pin = new google.maps.Marker({
      position: e.latLng, // map coordinates where user clicked
      map: map,
      draggable: true, // set pin to draggable
    });

    // content structure of pin info window for user to add info
    const formString = `<div class="pin-info-window">
      <form id="pindrop-form" = method="POST" action="/api/pins">
        <input type="hidden" name="lat" value="${position.lat}">
        <input type="hidden" name="lng" value="${position.lng}">
        <label for="name">Name:</label><br>
        <input type="text" id="Name" name="name"><br><br>
        <label for="pinDescription">Description:</label><br>
        <input type="text" id="description" name="description"><br><br>
       </form>
      <button type="submit" form="pindrop-form" value="Submit">Save Pin</button>
      <button name="remove-marker" class="remove-marker" title="Remove Marker">Remove Pin</button>
      </div>
    `;

    // const infoWindow = new google.maps.InfoWindow();


    infowindow.setContent(formString[0]);
    pin.addListener('click', (e) => {
			infowindow.open(map,pin); // click on pin opens info window
    })
    //###### remove marker #########/
    let removeBtn = formString.find('button.remove-marker')[0];
    map.addDomListener(removeBtn, "click", function(event) {
      marker.setMap(null);
    });
  })



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
