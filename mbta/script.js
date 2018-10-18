image1 = 'logo.png';
image2 = 'cl_icon.png';

var stops = [
    ['Alewife', 42.395428, -71.142483],
    ['Davis', 42.39674, -71.121815],
    ['Porter', 42.3884,-71.11914899999999],
    ['Havard',42.373362, -71.118956],
    ['Central', 42.365486, -71.103802],
    ['Kendall/MIT ', 42.36249079, -71.08617653],
    ['Charles/MGH', 42.361166, -71.070628],
    ['Park Street', 42.35639457, -71.0624242],
    ['Downtown Crossing', 42.355518, -71.060225],
    ['South Station', 42.352271, -71.05524200000001],
    ['Broadway', 42.342622, -71.056967],
    ['Andrew', 42.330154, -71.057655],
    ['JFK/UMass', 42.320685, -71.052391],
    ['Savin Hill', 42.31129, -71.053331],
    ['Fields Corner ', 42.300093, -71.061667],
    ['Shawmut', 42.29312583, -71.06573796000001],
    ['Ashmont', 42.284652, -71.06448899999999],
    ['North Quincy', 42.275275, -71.029583],
    ['Wollaston', 42.2665139, -71.0203369],
    ['Quincy Center', 42.251809, -71.005409],
    ['Quincy', 42.233391, -71.007153],
    ['Braintree', 42.2078543, -71.0011385]
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

infoWindow = new google.maps.InfoWindow;
// used when finding curr_pos, defined out here so it can be used later in the code
var curr_pos;
// used for the curr_pos marker, defined out here so it can be used later in the code
var curr_pos_marker;
// taken from google, this finds users geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            curr_pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

                curr_pos_marker = new google.maps.Marker({
                    position: curr_pos,
                    title: "Current location",
                    map: map,
                    icon: image2
                });
                map.setCenter(curr_pos);

                // finds nearest station and renders polyline, returns minimun distance to nearest stop
                var nearest_info = find_nearest_stop();

                // Add a listener for the click event
                curr_pos_marker.addListener('click', function(){
                    var min_dis = nearest_info[0];
                    var nearest_stop = nearest_info[1];

                    // this code takes off the decimal points after the hundredth place
                    var distance = (min_dis/1609.344) - ((min_dis/1609.344) % .01);

                    var infowindow = new google.maps.InfoWindow({
                    content: "Nearest stop: " + nearest_stop + "<br/> Distance: " + distance + " miles"
                    });

                    infowindow.open(map, curr_pos_marker);
                });

        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
            });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }


// function definitions below

// the code below finds the nearest station and renders a poly line between them
function find_nearest_stop() {
    // closest station will be found in the function
    var closest_stop;

    // It's initialized to a very high number so we can keep comparing to find the lowest distance
    var min_distance = 99999999999;

    // Handles click event on current location
    for (var i = 0; i < stops.length; i++) {
        var stop = stops[i];
        var latLngA =  new google.maps.LatLng(curr_pos);
        var latLngB =  new google.maps.LatLng(stop[1], stop[2]);
        // variable for the distance between current location and stop i
        var dist_i = google.maps.geometry.spherical.computeDistanceBetween(latLngA, latLngB);
        // if this distance is the new lowest distance, then the min_distance variable takes on its value
        if (dist_i < min_distance)
        {
            min_distance = dist_i;
            // and the station is recorded
            closest_stop = stops[i][0];
            closest_latlng = latLngB;
        }
    }

    //make a polyline between current location and nearest station
    var linePath3 = new google.maps.Polyline({
        path: [curr_pos, closest_latlng],
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });

    linePath3.setMap(map);

    // function retunrs the min distance to nearest station
    return [min_distance, closest_stop];

}
// Handles click event on current location
function opnewindow(nearest_info) {
    var min_dis = nearest_info[0];
    var nearest_stop = nearest_info[1];

    // this code takes off the decimal points after the hundredth place
    var distance = (min_dis/1609.344) - ((min_dis/1609.344) % .01);

    var infowindow = new google.maps.InfoWindow({
    content: "Nearest stop: " + nearest_stop + "<br/> Distance: " + distance + " miles"
    });

    infowindow.open(map, curr_pos_marker);
}

}