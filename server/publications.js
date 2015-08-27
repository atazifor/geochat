Meteor.publish('posts', function(options) {
	check(options, {
		sort: Object,
		limit: Number
	});
	var userProfile = getUserProfile(this.userId);
	if(userProfile){
		//var user = Meteor.users.findOne({_id: this.userId}, {fields: {profile: 1}});
		return Posts.find({neighborhoodId : userProfile.profile.neighborhood}, options); //see only posts that are in your neighborhood
	}
	return Posts.find({}, options);
});

Meteor.publish('singlePost', function(id) {
	check(id, String);
	return Posts.find(id);
});

Meteor.publish('comments', function(postId) {
	check(postId, String);
	return Comments.find({postId: postId});
});

Meteor.publish('notifications', function() {
	return Notifications.find({userId: this.userId, read: false});
});

/**
 * publishes the neighborhood of a user
 */
Meteor.publish('neighborhood', function(userId){
	check(userId, String);
	var userProfile = getUserProfile(this.userId);
	return Neighborhoods.find({_id: userProfile.profile.neighborhood});
});

var getUserProfile = function(userId){
	if(userId)
		return Meteor.users.findOne({_id: userId}, {fields: {profile: 1}});
};