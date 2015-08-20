/**
 * Created by ATazifor on 8/20/2015.
 */

// used as the center to show on the map
var center = {
    latitude: -34.397,
    longitude: 150.644
};


/**
 * determine size of polygon to be shown on the map. ideally, phone or tablet screen size should be use
 * @param numberOfSides
 * @param radius
 * @returns {Array}
 */
function getRegularPolygonCoordinates(numberOfSides, radius){
    var polygon = []; //hold polygon to define area on map
    var theta = 2 * Math.PI / numberOfSides;
    for (i = 0; i < numberOfSides; ++i) {
        var x = radius * Math.cos(theta * i); //x coordinate
        var y = radius * Math.sin(theta * i);// y coordinate
        polygon.push({
            lat:center.latitude + x,
            lng:center.longitude + y
        });
    }
    return polygon;
}

function getCenterCoordinates(callback) {
    navigator.geolocation.getCurrentPosition(
        function (position) {
            var returnValue = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            }
            // callback function ensures that coordinates are available to the calling method
            callback(returnValue);
        }
    )
}

Meteor.startup(function() {
    GoogleMaps.load();
    //change the center to the user's current position
    getCenterCoordinates(function (position) {
        center.latitude = position.latitude;
        center.longitude = position.longitude;
    });

});

Template.map.onCreated(function() {
    GoogleMaps.ready('map', function(map) {
        console.log("I'm ready!");
        var poly = getRegularPolygonCoordinates(10, .001);
        // Construct the polygon.
        var bermudaTriangle = new google.maps.Polygon({
            paths: poly,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            draggable: true,
            editable: true
        });
        bermudaTriangle.setMap(map.instance);
    });
});

Template.map.helpers({
    mapOptions: function() {
        if (GoogleMaps.loaded()) {
            return {
                center: new google.maps.LatLng(center.latitude, center.longitude),
                zoom: 18
            };
        }
    }
});