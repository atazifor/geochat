Router.configure({
	layoutTemplate: 'applicationLayout', //main application layout
	loadingTemplate: 'loading', //template to display while data in waitOn is in the process of loading
	notFoundTemplate: 'notFoundTemplate', //handle invalid routes
	waitOn: function(){
		return [Meteor.subscribe('notifications')];
	}
});

Router.route('/map',{
	template: 'map',
	name: 'map',
	waitOn: function(){
	}
});

Router.route('/register',{
	template: 'register',
	name: 'register',
	waitOn: function(){
	}
});

Router.route('/login',{
	template: 'login',
	name: 'login',
	waitOn: function(){
	}
});

Router.route('/posts/:_id', {
	template: 'postPage', 
	name: 'postPage',
	waitOn: function(){
		return[Meteor.subscribe('singlePost', this.params._id),
			 Meteor.subscribe('comments', this.params._id)];
	},
	data: function(){
		return Posts.findOne({_id: this.params._id});
	}
});

Router.route('/posts/:_id/edit', {
	template: 'editPost',
	name: 'editPost',
	waitOn: function(){
		return Meteor.subscribe('singlePost', this.params._id);
	},
	data: function(){
		return Posts.findOne({_id: this.params._id});
	}
});

Router.route('/createPost', {
	template: 'newPost', //name of the template to use
	name: 'newPost' //name of this route
});

Router.onBeforeAction('dataNotFound', {
  only: ['postPage']
  // or except: ['routeOne', 'routeTwo']
});

PostsListController = RouteController.extend({
	template: 'postsList',
	increment: 5,
	postsLimit: function() {
		return parseInt(this.params.postsLimit) || this.increment;
	},
	findOptions: function() {
		return {sort: {submitted: -1}, limit: this.postsLimit()};
	},
	subscriptions: function() {
		this.postsSub = Meteor.subscribe('posts', this.findOptions());
	},
	posts: function() {
		return Posts.find({}, this.findOptions());
	},
	neighborhood: function(){
		return Meteor.user() && Meteor.user().profile.neighborhood;
	},
	data: function() {
		var hasMore = this.posts().count() === this.postsLimit();
		var nextPath = this.route.path({postsLimit: this.postsLimit() + this.increment});
		return {
			posts: this.posts(),
			ready: this.postsSub.ready,
			neighborhood: this.neighborhood,
			nextPath: hasMore ? nextPath : null
		};
	},

});

Router.route('/:postsLimit?', {
	name: 'postsList'
});

var requireLogin = function(){
	if(!Meteor.userId()){//if user is not logged in
		if(Meteor.loggingIn()){
			this.render(this.loadingTemplate);
		}else{
			this.render('accessDenied');
		}//render notValidUser template}

	}else{
		this.next(); //do not holp up other hooks or route action functions
	}
};
Router.onBeforeAction(requireLogin,{
	only:['newPost','editPost']
});
