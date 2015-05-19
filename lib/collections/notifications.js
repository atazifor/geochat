Notifications = new Mongo.Collection('notifications');

Notifications.allow({
    update: function(userId, doc, fields){
        return ownsDocument(userId, doc) && fields.length === 1 && fields[0] == 'read';
    }
});

createCommentNotification = function(comment) {
    var post = Posts.findOne(comment.postId);
    if (comment.userId !== post.userId) {
    //make sure the user commenting does not own the post since there is no need to notify oneself
        Notifications.insert({
            userId: post.userId,
            postId: post._id,
            commentId: comment._id,
            commenterName: comment.author,
            read: false
        });
    }
};