$(document).ready(function() {
  $('.fa-heart').click(function() {
    // console.log('before click:', $(this).attr('class'));
    const $mapId = $(this).attr('id');

    if ($(this).attr('class') === 'fa-regular fa-heart') {
      // add to favourites
      $.ajax({
        method: 'POST',
        url: '/api/favourites/add',
        data: {map : $mapId}
      })
    } else if ($(this).attr('class') === 'fa-solid fa-heart') {
      //delete from favourites
      $.ajax({
        method: 'POST',
        url: `/api/favourites/${$mapId}`
      })
    }

    $(this).toggleClass("fa-solid fa-heart fa-regular fa-heart")

  })
})
