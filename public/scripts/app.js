
// Initialize and add the map
function initMapView() {
  console.log(mapData.lat, mapData.lng);

    const center = { lat: mapData.lat, lng: mapData.lng };
    // The map, centered at Uluru
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: mapData.zoom,
      center
    });
    const infoWindow = new google.maps.InfoWindow();
    const $formWindow = $('.pin-info-window');
  const $form = $('#pindrop-form');
    // The markers

    $.ajax({
      method: 'GET',
      url: `/api/pins/${mapData.id}`
    })
    .done((response) => {

      const pins = response.pins;

      for (const pin of pins) {
        const contentString = `<div id="info-window-content"><img width="100" src="${pin.image_url}"><h4>${pin.title}</h4><p>${pin.description}</p></div>`;
        const marker = new google.maps.Marker({
          position: { lat: pin.latitude, lng: pin.longitude },
          map: map,
          title: pin.title,
          // draggable: true,
          optimized: false,
        })
        //when pin it clicked:
        marker.addListener("click", () => {
          //pop up info window
          infoWindow.close();
          infoWindow.setContent(contentString);
          infoWindow.open(marker.getMap(),marker);

          //if pin belongs to me, pop up edit/delete form
          if (pin.isMine){
            $("#create_pin_button").hide();
            $("#edit_pin_button").show();
            $("#delete_pin_button").show();
            $form.find('textArea[name="title"]').val(pin.title);
            $form.find('textArea[name="description"]').val(pin.description);
            $form.find('textArea[name="img"]').val(pin.image_url);

            $form.find('input[name="lat"]').val(pin.latitude);
            $form.find('input[name="lng"]').val(pin.longitude);
            $formWindow.show();

            //if I save changes, edit pin in database
            $("#edit_pin_button").click((e) => {
              e.preventDefault();
              $.ajax({
                method: "POST",
                url: `/api/pins/${pin.id}`,
                // collect the serialized data from the form
                data: $form.serialize(),
                dataType: "json",
              })
              .done((response) => {
                  console.log('edited', response);
                  $formWindow.hide();
                  window.location.reload();
                })
              })

             //if I hit delete, delete pin from database
             $("#delete_pin_button").click((e) => {
              e.preventDefault();
              $.ajax({
                url: `/api/pins/${pin.id}/delete`,
                method: "POST",})
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
              e.preventDefault();
            });
          }
        })



      }
    })


  }

window.initMapView = initMapView;

