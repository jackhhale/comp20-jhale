image1 = 'logo.png';
image2 = 'cl_icon.png';

var stops = [
    ['Alewife', 42.395428, -71.142483, "place-alfcl"],
    ['Davis', 42.39674, -71.121815, "place-davis"],
    ['Porter', 42.3884,-71.11914899999999, "place-portr"],
    ['Havard',42.373362, -71.118956, "place-harsq"],
    ['Central', 42.365486, -71.103802, "place-cntsq"],
    ['Kendall/MIT ', 42.36249079, -71.08617653, "place-knncl"],
    ['Charles/MGH', 42.361166, -71.070628, "place-chmnl"],
    ['Park Street', 42.35639457, -71.0624242, "place-pktrm"],
    ['Downtown Crossing', 42.355518, -71.060225, "place-dwnxg"],
    ['South Station', 42.352271, -71.05524200000001, "place-sstat"],
    ['Broadway', 42.342622, -71.056967, "place-brdwy"],
    ['Andrew', 42.330154, -71.057655, "place-andrw"],
    ['JFK/UMass', 42.320685, -71.052391, "place-jfk"],
    ['Savin Hill', 42.31129, -71.053331, "place-shmnl"],
    ['Fields Corner ', 42.300093, -71.061667, "place-fldc"],
    ['Shawmut', 42.29312583, -71.06573796000001, "place-smmnl"],
    ['Ashmont', 42.284652, -71.06448899999999, "place-asmnl"],
    ['North Quincy', 42.275275, -71.029583, "place-nqncy"],
    ['Wollaston', 42.2665139, -71.0203369, "place-wlsta"],
    ['Quincy Center', 42.251809, -71.005409, "place-qnctr"],
    ['Quincy Adams', 42.233391, -71.007153, "place-qamnl"],
    ['Braintree', 42.2078543, -71.0011385, "place-brntn"]
];

var markers = [];

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

        markers.push(marker);
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

                // Add a listener for the click event on current location
                curr_pos_marker.addListener('click', function(){
                    var min_dis = nearest_info[0];
                    var nearest_stop = nearest_info[1];

                    // this code takes off the decimal points after the hundredth place
                    var distance = (min_dis/1609.344).toFixed(2);

                    var infowindow = new google.maps.InfoWindow({
                    content: "Nearest stop: " + nearest_stop + "<br> Distance: " + distance + " miles"
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

        // info window with distance to nearest stop 
        var infowindow = new google.maps.InfoWindow({
        content: "Nearest stop: " + nearest_stop + "<br> Distance: " + distance + " miles"
        });

        infowindow.open(map, curr_pos_marker);
    }

    // adds event listeners on each of the stops which will display infowindow with train times when user clicks
    for (var i = 0; i < stops.length; i++) {

        markers[i].addListener('click', give_info(i))
        
        // Callback function which gets data from API and displays info window
        // The function "give_info" returns a function specific to the ith marker
        function give_info(i){
            return function() {
                var request;

                // makes instance of XHR object
                request = new XMLHttpRequest();
                // opens JSON file from a remote location
                request.open("GET", "https://chicken-of-the-sea.herokuapp.com/redline/schedule.json?stop_id=" + stops[i][3], true);
                // callback function for when HTTP request is returned
                request.onreadystatechange = function() {

                    if ((request.readyState == 4) && (request.status = 200))
                    {
                        var the_data = request.responseText;

                        var times = JSON.parse(the_data);

                        console.log(times);

                        // Put data into two arrays
                        var northbound_trains = [];
                        var southbound_trains = [];
                        for (var j = 0; j < times.data.length; j++) {
                            if (times.data[j].attributes.direction_id == 0) {
                                if (times.data[j].attributes.departure_time == null) {
                                    southbound_trains.push("departure Time Unavailable");
                                }
                                else {
                                    southbound_trains.push(convert_time(times.data[j].attributes.departure_time));
                                }
                            }
                            else if (times.data[j].attributes.direction_id == 1) {
                                if (times.data[j].attributes.departure_time == null) {
                                    northbound_trains.push("departure Time Unavailable");
                                }
                                else {
                                    northbound_trains.push(convert_time(times.data[j].attributes.departure_time));
                                }
                            }
                        }

                        // Sorting the times
                        northbound_trains = sort_times(northbound_trains);
                        southbound_trains = sort_times(southbound_trains);

                        console.log(stop[i]);

                        // What will be printed in infowindow
                        var info = "<strong>Upcoming Trains for " + stops[i][0] + ":</strong><br>(all times are departure times) <br> <br> <strong>Southbound Trains:</strong> ";
                        for (var j = 0; j < southbound_trains.length; j++) {
                            info = info + ("<br>" + southbound_trains[j]);
                        }
                        // user feedback if there are no trains
                        if (southbound_trains.length == 0) {
                            info = info + "<br> There are no trains at the moment";
                        }
                        // What will be printed in infowindow
                        info = info + "<br> <strong>Northbound Trains: </strong>"
                        for (var j = 0; j < northbound_trains.length; j++) {
                            info = info + ("<br>" + northbound_trains[j]);
                        }
                        // user feedback if there are no trains
                        if (northbound_trains.length == 0) {
                            info = info + "<br> There are no trains at the moment";
                        }
                        // displays infowindow
                        var infowindow = new google.maps.InfoWindow({
                        content: info
                        });

                        infowindow.open(map, markers[i]);
                    }
                }
                // Execute the request
                request.send();
            };
        }
    }
}

function convert_time(time){
    var new_time = time;
    // Deletes all the parts before the time
    for (var i = 0; i < time.length; i++) {
        if (time[i] == 'T')
            break;
        else 
            new_time = new_time.substr(1);
    }
    // Deletes the "T"
    new_time = new_time.substr(1);
    // Deletes the "-4:00"
    new_time = new_time.slice(0, -6);

    new_time = round_time(new_time);

    // converts military time into regular 12-hour time
    if (new_time.substring(0,2) >= 12) {
        // The hours of the time from military to regular time
        var hours = new_time.substring(0,2) % 12;

        // makes sure it doesn't say 00:xx
        if (hours == 0){
            hours = 12;
        }

        new_time = hours + new_time.substr(2) + " PM";
    }
    else {
        var hours = new_time.substring(0,2);

        // makes sure it doesn't say 00:xx
        if (hours == 0){
            hours = 12;

        new_time = hours + new_time.substr(2) + " AM";
        }
    }

    return new_time;
}

function round_time(time)
{
    // This was supposed to take off seconds and rounds to nearest minute, but I didn't finish it
    var seconds = time.substr(time.length - 2);
    var minutes = time.substring(3,5);
    var hours = time.substring(0,2);
    if (seconds >= 30) {
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
            hours++;
        }
        // to prevent minutes from being single digit (xx:x) instead of xx:0x
        if (minutes / 10 < 1) {
            minutes = "0" + minutes;
        }
        time = hours + ":" + minutes;
    }
    else {
        // takes off seconds
        time = time.slice(0, -3);
    }

    return time;
}

function sort_times(times)
{
    for (var i = times.size - 1; i >= 0; i--)
        for (var j = 0; j < i; j++)
        {
            if (times[j] > times[i])
            {
                var temp = times[i];
                times[i] = times[j];
                times[j] = temp;
            }
        }

    return times;
}