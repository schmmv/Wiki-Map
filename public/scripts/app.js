let map;
// Initialize and add the map
function initMapView() {
  console.log(mapData.lat, mapData.lng);

    const center = { lat: mapData.lat, lng: mapData.lng };
    // The map, centered at Uluru
    map = new google.maps.Map(document.getElementById("map"), {
      zoom: mapData.zoom,
      center
    });
    const infoWindow = new google.maps.InfoWindow();
    // The markers

    $.ajax({
      method: 'GET',
      url: `/api/pins/${mapData.id}`
    })
    .done((response) => {

      const pins = response.pins;

      for (const pin of pins) {
        const contentString = `<div id="content"><img width="200" src="${pin.image_url}"><h4>${pin.title}</h4><p>${pin.description}</p></div>`;
        const marker = new google.maps.Marker({
          position: { lat: pin.latitude, lng: pin.longitude },
          map: map,
          title: pin.title,
          optimized: false,
        })
        marker.addListener("click", () => {
          infoWindow.close();
          infoWindow.setContent(contentString);
          infoWindow.open(marker.getMap(),marker);
        })
      }
    })


  }

window.initMapView = initMapView;

