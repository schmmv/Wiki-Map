let map;

function initMap() {
  const vancouver = { lat: 49.2578262, lng: -123.1941156 };
  map = new google.maps.Map(document.getElementById("map"), {
    center: vancouver,
    zoom: 12,
  });
  const ubc = { lat: 49.26410715655254, lng: -123.24569741813465};
  const marker = new google.maps.Marker({
    position: ubc,
    map: map,
    title: 'UBC'
  });
}

window.initMap = initMap;
