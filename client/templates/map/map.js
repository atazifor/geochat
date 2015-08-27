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

/**
 * Note: geojson points are of the form [longitude, latitude] while google map points are of form
 * (latitude, longitude)
 * @param numberOfSides
 * @param radius
 * @returns {{type: string, coordinates: *[]}}
 */
function getGeoJSONPolygonCoordinates(numberOfSides, radius){
    var polygon = []; //hold polygon to define area on map
    var theta = 2 * Math.PI / numberOfSides;
    //polygon.push([center.longitude, radius + center.latitude]);//ensures firs
    for (i = 0; i <= numberOfSides; ++i) {//ensures that you go 2Pi(360) degrees
        var x = radius * Math.cos(theta * i); //x coordinate
        var y = radius * Math.sin(theta * i);// y coordinate
        polygon.push([center.longitude + y, center.latitude + x]);
    }
    //polygon.push([center.longitude, center.latitude]);

    //console.log(JSON.stringify(getRegularPolygonCoordinates(numberOfSides, radius)));
    //console.log(JSON.stringify({"type": "Polygon",  "coordinates": [polygon]}));
    return {
        "type":"Polygon",
        "coordinates":[polygon]
    };
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
    //change the center to the user's current position 40.75597, -73.974228
    getCenterCoordinates(function (position) {
        center.latitude = position.latitude;
        center.longitude = position.longitude;
    });
});

Template.map.onCreated(function() {
    GoogleMaps.ready('map', function(map) {
        console.log("I'm ready!");
        neighborHoodBoundsGeoJSON =   {
            type: "Feature",
            id: Meteor.userId(), //polygon id equals id of person that created the boundaries
            geometry: getGeoJSONPolygonCoordinates(5, .0005),
            properties: {name: ""}
        };
        var style = {
            strokeColor: '#FF0000',
            strokeOpacity: 0.35,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.25,
            draggable: false,
            editable: true
        };
        map.instance.data.addGeoJson(neighborHoodBoundsGeoJSON);//add the geojson polygon to the map
        map.instance.data.setStyle(style);//set tje style of the map
        var infoWindow = new google.maps.InfoWindow({map: map.instance});
        infoWindow.setPosition({lat: center.latitude, lng: center.longitude});
        infoWindow.setContent('Your Location');
    });

    Session.set('neighborhoodErrors', {});//reset neighborhoodErrors each time template is created
});

Template.map.helpers({
    mapOptions: function() {
        if (GoogleMaps.loaded()) {
            return {
                center: new google.maps.LatLng(center.latitude, center.longitude),
                zoom: 18
            };
        }
    },
    errorMessage: function(field) {
        return Session.get('neighborhoodErrors')[field];
    },
    errorClass: function (field) {
        return !!Session.get('neighborhoodErrors')[field] ? 'has-error' : '';
    }
});

Template.map.events({
    'submit form': function(e) {
        e.preventDefault();
        var activeNeighborhood = null; //this is a geojson object; will be stores in neighboorhoods collection
        var mapFeature = GoogleMaps.maps.map.instance.data.getFeatureById(Meteor.userId()); //only one polygon feature matches this id
        mapFeature.toGeoJson(function(obj){
            activeNeighborhood = obj;
        });

        activeNeighborhood.properties.name = $(e.target).find('[name=neighborhood]').val();
        var errors = validateNeighborhoodName(activeNeighborhood);//build error object for empty fields

        if(errors.neighborhood){//if neighborhood name is not set, set post errors
            return Session.set('neighborhoodErrors', errors);
        }

        document.getElementById('info').innerHTML = JSON.stringify(activeNeighborhood);
        //call insert function. to be executed by the server since we are using Meteor.call
        Meteor.call('insertNeighborhood', activeNeighborhood, function(error, result){
            if(error){
                console.log(error.stack);
                return throwError(error.reason);
            }
            Router.go('postsList');
        });
    }
});
