Posts = new Mongo.Collection('posts');
Posts.allow({
    insert: function(userId, document){
        return !! userId;
    }
});
