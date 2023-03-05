// Initialize and add the map
function initMap(mapObj) {
  // The location of Uluru
  const location = { latitude: mapObj.latitude, longitude: mapObj.longitude };
  // The map, centered at location
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: mapObj.zoom,
    center: location,
  });
  // // The marker, positioned at Uluru
  // const marker = new google.maps.Marker({
  //   position: uluru,
  //   map: map,
  // });
}


window.initMap = initMap;
