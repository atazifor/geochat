Template.postItem.helpers({
	tags: function () {
		return this.tags;
	},
	ownsPost: function(){
		return Meteor.userId() === this.userId;
	}
});