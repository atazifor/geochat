Neighborhoods = new Mongo.Collection('neighborhoods');

Meteor.methods({
    insertNeighborhood: function(neighborhoodInfo){
        var errors = validateNeighborhoodName(neighborhoodInfo);
        if(errors.neighborhood){
            throw new Meteor.Error('invalid-neigborhood', "You must enter a name for your neighborhood/community");
        }

        check(Meteor.userId(), NonEmptyString); //user must be logged in
        check(neighborhoodInfo, { //all fields must be checked on the object passed into Meteor.methods; otherwise throwUnlessAllArgumentsHaveBeenChecked
            properties: Object,
            type: String,
            geometry: Object,
            id: String
        });
        check(neighborhoodInfo.properties.name, NonEmptyString); //name must be supplied
        var neighborhoodId = Neighborhoods.insert(neighborhoodInfo);

        //update user to show that neighborhood is set
        Meteor.users.update( { _id: Meteor.userId() }, { $set: { 'profile.neighborhood': neighborhoodId }} );
        return {
            _id: neighborhoodId
        };
    },
    updateUserNeighborhoodInfo: function(neighborhoodId){
        check(neighborhoodId, String);
        Meteor.users.update( { _id: Meteor.userId() }, { $set: { 'profile.neighborhood': neighborhoodId }} );
    }
});

validateNeighborhoodName = function (neighborhood) {
    var errors = {};
    if (!neighborhood.properties.name)
        errors.neighborhood = "Please enter your neighborhood name";
    return errors;
};