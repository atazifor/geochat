Router.configure({
	layoutTemplate: 'ApplicationLayout', //main application layout
	loadingTemplate: 'loading', //template to display while data in waitOn is in the process of loading
	notFoundTemplate: 'notFoundTemplate', //handle invalid routes
	waitOn: function(){
		return Meteor.subscribe('posts');
	}
});

Router.route('/', {
	template: 'postsList', //name of the template to use
	name: 'postsList' //name of this route
});

Router.route('/posts/:_id', {
	template: 'postPage', 
	name: 'postPage',
	data: function(){
		return Posts.findOne({_id: this.params._id});
	}
});

Router.onBeforeAction('dataNotFound', {
  only: ['postPage']
  // or except: ['routeOne', 'routeTwo']
});