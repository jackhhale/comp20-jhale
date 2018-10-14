image = 'logo.png';

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
    ['BraintreeLatLng', 42.2078543, -71.0011385],
    ['AshmontLatLng', 42.284652, -71.06448899999999],
    ['FieldsLatLng', 42.300093, -71.061667],
    ['ShawmutLatLng', 42.29312583, -71.06573796000001],
    ['NorthQuincyLatLng', 42.275275, -71.029583],
    ['QuincyCenterLatLng', 42.251809, -71.005409],
    ['QuincyAdamsLatLng', 42.233391, -71.007153]
];

var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 42.352271, lng: -71.05524200000001},
    zoom: 11
  });

// markers for all the stops

for (var i = 0; i < stops.length; i++) {
    var stop = stops[i];
    var marker = new google.maps.Marker({
        position: {lat: stop[1], lng: stop[2]},
        map: map,
        icon: image,
        title: stop[0]
    });
}

}