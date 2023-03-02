// submitPinInfo is not currently being used - we might end up deleting this

const submitPinInfo = function (data) {
  return $.ajax({
    method: "POST",
    url: "/api/pins",
    data,
  });
}
