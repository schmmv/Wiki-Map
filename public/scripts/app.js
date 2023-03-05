// Client facing scripts here
$(document).ready(function() {
  $('.card').data('id');
  $('.card').click(function(event) {
    console.log('in click');
    const $mapId = $(this).data('id');

    $.ajax({
      method: 'POST',
      data: $mapId,
      url: `/maps/${$mapId}`,
    });

  });
});
