image1 = 'logo.png';
image2 = 'cl_icon.png';

var stops = [
    ['DavisLatLng', 42.39674, -71.121815],
    ['DavisLatLng', 42.39674, -71.121815],
    ['PorterLatLng', 42.3884,-71.11914899999999],
    ['HavardLatLng',42.373362, -71.118956],
    ['CentralLatLng', 42.365486, -71.103802],
    ['KendallLatLng', 42.36249079, -71.08617653],
    ['MGHLatLng', 42.361166, -71.070628],
    ['ParkstLatLng', 42.35639457, -71.0624242],
    ['DowntownLatLng', 42.355518, -71.060225],
    ['SouthLatLng', 42.352271, -71.05524200000001],
    ['BroadwayLatLng', 42.342622, -71.056967],
    ['AndrewLatLng', 42.330154, -71.057655],
    ['JFKLatLng', 42.320685, -71.052391],
    ['Savin Hill', 42.31129, -71.053331],
    ['FieldsLatLng', 42.300093, -71.061667],
    ['ShawmutLatLng', 42.29312583, -71.06573796000001],
    ['AshmontLatLng', 42.284652, -71.06448899999999],
    ['NorthQuincyLatLng', 42.275275, -71.029583],
    ['Wollaston', 42.2665139, -71.0203369],
    ['QuincyCenterLatLng', 42.251809, -71.005409],
    ['QuincyAdamsLatLng', 42.233391, -71.007153],
    ['BraintreeLatLng', 42.2078543, -71.0011385]
];

var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 42.352271, lng: -71.05524200000001},
    zoom: 11
  });

// creates markers for all the stops
for (var i = 0; i < stops.length; i++) {
    var stop = stops[i];
    var marker = new google.maps.Marker({
        position: {lat: stop[1], lng: stop[2]},
        map: map,
        icon: image1,
        title: stop[0]
    });
}


// puts all the coordinates into an array (of latlng) which will be used to create the polyline
// the for loop runs 17 iterations because that's the line only including the left side of the fork
var lineCoordinates1 = [];
for (var i = 0; i < 17; i++) {
    var stop = stops[i];
    var location = {lat: stop[1], lng: stop[2]};
    lineCoordinates1.push(location);
    console.log(stops.length);
}

var lineCoordinates2 = [];

// this piece of code adds JFK/UMASS so the right side of the fork can be connected
var JFKstop = stops[12];
var JFKlocation = {lat: JFKstop[1], lng: JFKstop[2]};
lineCoordinates2.push(JFKlocation);

// the for loop starts at 17 because we only want the right side of the fork
for (var i = 17; i < stops.length; i++) {
    var stop = stops[i];
    var location = {lat: stop[1], lng: stop[2]};
    lineCoordinates2.push(location);
}

console.log(lineCoordinates2);

// Variables for the polylines
var linePath1 = new google.maps.Polyline({
    path: lineCoordinates1,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2
});

var linePath2 = new google.maps.Polyline({
    path: lineCoordinates2,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2
});


linePath1.setMap(map);
linePath2.setMap(map);

// taken from google, this finds users geolocation
infoWindow = new google.maps.InfoWindow;

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

                var marker = new google.maps.Marker({
                    position: pos,
                    title:"Current location",
                    map: map,
                    icon: image2
                });
                map.setCenter(pos);
        }, function() {
                handleLocationError(true, infoWindow, map.getCenter());
            });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }

}