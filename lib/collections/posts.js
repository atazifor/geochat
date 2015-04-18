Posts = new Mongo.Collection('posts');

Posts.allow({
    update: function(userId, doc){
        return ownsDocument(userId, doc);
    },
    remove: function(userId, doc){
        return ownsDocument(userId, doc);
    }
});

Posts.deny({
    update: function(userId, doc, fieldNames){
        //can only edit only message and tags
        return (_.without(fieldNames, 'message', 'tags').length > 0);
    }
});

//match comma separated string
CommaSeparatedString = Match.Where(function(value){
    check(value, NonEmptyString);
    var tagsArray = value.split(/\s*,\s*/);
    var isValid = true;
    _.each(tagsArray, function(tag){
        if(/\W+/.test(tag) || /\d+/.test(tag)){ //word contains non-word character like [,;.?] or number
            isValid = false;
            return;
        }
    });
    return isValid;
});

NonEmptyString = Match.Where(function (x) {
    check(x, String);
    return x.length > 0;
});

Meteor.methods({
   insertPost: function(postAttributes) {
       check(Meteor.userId(), NonEmptyString);
       check(postAttributes, {
           message: String,
           tags: String
       });
       check(postAttributes.message, NonEmptyString);
       check(postAttributes.tags, CommaSeparatedString);

       var user = Meteor.user();
       var post = {
           message: postAttributes.message,
           tags: postAttributes.tags.split(/\s*,\s*/), //convert comma separated string to an array (easy indexing in mongo)
           userId: user._id,
           author: user.username,
           submitted: new Date()
       };
       var postId = Posts.insert(post);
       return {
           _id: postId
       };
   }
});