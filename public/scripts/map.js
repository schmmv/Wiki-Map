let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 49.2578262, lng: -123.1941156 },
    zoom: 12,
  });
}

window.initMap = initMap;
