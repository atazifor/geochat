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
        //can only edit message and tags
        return (_.without(fieldNames, 'message', 'tags').length > 0);
    }
});

Posts.deny({
    update: function(userId, post, fieldNames, modifier) {
        var errors = validatePost(modifier.$set);
        return errors.message || errors.tags;
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
       var errors = validatePost(postAttributes);
       if(errors.message || errors.tags){
           throw new Meteor.Error('invalid-post', "You must set a message and enter tags for your post");
       }

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
           submitted: new Date(),
           commentsCount: 0
       };
       var postId = Posts.insert(post);
       return {
           _id: postId
       };
   }
});

validatePost = function (post) {
    var errors = {};
    if (!post.message)
        errors.message = "Please enter a message";
    if (!post.tags)
        errors.tags =  "Please fill in tags for your message";
    return errors;
}