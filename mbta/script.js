var DavisLatLng = {lat: 42.396797, lng: -71.121873};

var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 42.3501, lng: -71.0589},
    zoom: 8
  });

var davismarker = new google.maps.Marker({
    position: DavisLatLng,
    map: map,
    title: 'Davis Square'
        });
}