// Initialize and add the map
function initMap() {
  console.log(mapData.lat, mapData.lng);

    const center = { lat: mapData.lat, lng: mapData.lng };
    // The map, centered at Uluru
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: mapData.zoom,
      center
    });
    // The marker, positioned at Uluru
    const marker = new google.maps.Marker({
      position: center,
      map: map,
    });
  }

window.initMap = initMap;
