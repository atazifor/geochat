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
var MapProperties = {
    mapOptions: {},
    style: {
        strokeColor: '#FF0000',
        strokeOpacity: 0.35,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.25,
        draggable: false,
        editable: true
    }
};
MapInstance = {};
Template.map.onCreated(function() {
    var self = this;
    self.subscribe("neighborhoodsContainingPoint", center); //subscribe this (map) template to neighborhoodContainingPoint

    GoogleMaps.ready('map', function(map) {

        mapInstance = map.instance;

        neighborHoodBoundsGeoJSON =  Neighborhoods.findOne({});//first check if there is a neighborhood already set

        if(neighborHoodBoundsGeoJSON){ //there is at least one neighborhood already set in the user's location
            MapProperties.style.editable = false;
            //$('#neighborhood').attr('readonly', true);//make read only
            //setNeighborhoodName(neighborHoodBoundsGeoJSON.properties.name);
        }else {
            neighborHoodBoundsGeoJSON = {
                type: "Feature",
                id: Meteor.userId(), //polygon id equals id of person that created the boundaries. this is the feature ID
                geometry: getGeoJSONPolygonCoordinates(5, .0005),
                properties: {name: ""}
            };
        }
        mapInstance.data.addGeoJson(neighborHoodBoundsGeoJSON);//add the geojson polygon to the map
        mapInstance.data.setStyle(MapProperties.style);//set tje style of the map
        var marker = new google.maps.Marker({
            position: {lat: center.latitude, lng: center.longitude},
            map: mapInstance,
            title: 'Your Location'
        });

        MapInstance = mapInstance;
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
    neighborhoodsContainingUserLocation: function(){ //this location intersects any neighborhoods in the database?
        //only neighborhood(s) that contain user's location - center - exists (based on publish/subscribe neighborhoodsContainingPoint)
        return Neighborhoods.find({});
    },
    neighborhoodsContainingUserLocationCount: function(){
        return  Neighborhoods.find({}).count();
    },
    defaultNeighborhoodsContainingUserLocation: function(){
        return  Neighborhoods.findOne({});
    },
    //neighborhoodsContainingUserLocationCount: this.neighborhoodsContainingUserLocation().count(),
    errorMessage: function(field) {
        return Session.get('neighborhoodErrors')[field];
    },
    errorClass: function (field) {
        return !!Session.get('neighborhoodErrors')[field] ? 'has-error' : '';
    },
    formClass: function(){
        return Neighborhoods.find({}).count() ? 'existingNeighborhood' : 'newNeighborhood';
    },
    radioChecked: function(radioId){
        var nb =  Neighborhoods.findOne({});
        if(!!nb){
            return nb._id === radioId ? "checked" : "";
        }
    }
});

Template.map.events({
    'submit .newNeighborhood': function(e) {
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

        //document.getElementById('info').innerHTML = JSON.stringify(activeNeighborhood);
        //call insert function. to be executed by the server since we are using Meteor.call
        Meteor.call('insertNeighborhood', activeNeighborhood, function(error, result){
            if(error){
                console.log(error.stack);
                return throwError(error.reason);
            }
            Router.go('postsList');
        });
    },
    'submit .existingNeighborhood': function(e) {
        e.preventDefault();

        var nbId = $(e.target).find('input:checked[type=radio]').val();
        //document.getElementById('info').innerHTML = JSON.stringify(activeNeighborhood);
        //call insert function. to be executed by the server since we are using Meteor.call
        Meteor.call('updateUserNeighborhoodInfo', nbId, function(error, result){
           /* if(error){
                console.log(error.stack);
                return throwError(error.reason);
            }*/
            Router.go('postsList');
        });
    },
    'click input[type=radio]': function(e) {
        var elementId = $(e.target).val(); //neighborhood id
        var nb = Neighborhoods.findOne({_id: elementId}); //find neighborhood map (a google map geojson object) from the database

        var alreadyOnMap = false;
        //remove any polygons on the map before adding new one
        MapInstance.data.forEach(function(feature){
            //neighborhood.id is a feature id. only remove if feature id is different.
            //if there is only one neighborhood that matches user location, no need to remove and add each time user clicks on radio
            if(nb.id === feature.getId()){
                alreadyOnMap = true;
            }else if('Polygon' == feature.getGeometry().getType() && nb.id != feature.getId()){
                console.log("feature with Id: " + feature.getId() + " removed");
                MapInstance.data.remove(feature);
            }
        });
        if(!alreadyOnMap) {
            MapInstance.data.addGeoJson(nb);//add the geojson polygon to the map
            MapProperties.style.editable = false;//make map not editable
            MapInstance.data.setStyle(MapProperties.style);//set tje style of the map
            setNeighborhoodName(nb.properties.name);
        }

    }
});

/**
 * used to set neighborhood name when viewing map in read only mode
 * @param nbName
 */
var setNeighborhoodName = function(nbName){
    $('#neighborhood').val(nbName);
    //$('#neighborhood').attr('readonly', true);
}