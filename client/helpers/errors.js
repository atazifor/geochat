Errors = new Mongo.Collection(null);

throwError = function(errorMessage){
    Errors.insert({errorMessage: errorMessage});
};