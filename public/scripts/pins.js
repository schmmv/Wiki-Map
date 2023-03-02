const submitPinInfo = function (data) {
  return $.ajax({
    method: "POST",
    url: "/api/pins",
    data,
  });
}
