//called from the one_map.ejs view template
// Initialize and add the map
function initMapView() {

    //use mapData passed to ejs one_map template
    const center = { lat: mapData.lat, lng: mapData.lng };

    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: mapData.zoom,
      center
    });
    const infoWindow = new google.maps.InfoWindow();
    const $formWindow = $('.pin-info-window');
    const $form = $('#pindrop-form');

    //allow users to add new pin by clicking on map
    map.addListener('click', (e) => {
      pin = new google.maps.Marker({
        position: e.latLng, // map coordinates where user clicked
        map: map,

      });

      // set the value of the inputs in the pin form
      $form.find('textArea[name="title"]').val("");
      $form.find('textArea[name="description"]').val("");
      $form.find('textArea[name="img"]').val("");
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
      $("#create_pin_button").click((e) => {
        e.preventDefault();
        // ajax POST request to /api/pins
        $.post({
          url: `/api/pins/${mapData.id}/add`,
          data: $form.serialize(),
          dataType: "json",

        }).done(function (data) {
          $formWindow.hide();
          window.location.reload();
        });

      });
    });

    //get pins to display on map
    $.ajax({
      method: 'GET',
      url: `/api/pins/${mapData.id}`
    })
    .done((response) => {

      const pins = response.pins;
      //for each pin:
      //1- set the content of the info window
      //2- create the marker on the map
      //3- add listener for marker
      ///3.1 - if clicked, open info window, and if it belongs to the logged in user pop up edit form
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

