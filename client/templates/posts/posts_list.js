


/*
* should users be allowed to enter when a message should expire
*/

Template.postsList.helpers({
	posts: Posts.find({},{sort: {submitted: -1}})
});