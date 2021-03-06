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
Meteor.publish('neighborhood', function(){
	var userProfile = getUserProfile(this.userId);
	if(userProfile){
		return Neighborhoods.find({_id: userProfile.profile.neighborhood});
	}
	return Neighborhoods.find({_id: 'notExist'});
});


/**
 * publish neighborhood(s) that the <strong>point</point> intersects
 */
Meteor.publish('neighborhoodsContainingPoint', function(point){
	check(point, {
		longitude: Number,
		latitude: Number
	});
	return Neighborhoods.find({
		geometry: {
			$geoIntersects: {
				$geometry: {
					type: "Point",
					coordinates: [point.longitude, point.latitude]
				}
			}
		}
	});
});

var getUserProfile = function(userId){
	if(userId)
		return Meteor.users.findOne({_id: userId}, {fields: {profile: 1}});
};
