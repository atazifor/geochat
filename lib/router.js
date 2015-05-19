Router.configure({
	layoutTemplate: 'applicationLayout', //main application layout
	loadingTemplate: 'loading', //template to display while data in waitOn is in the process of loading
	notFoundTemplate: 'notFoundTemplate', //handle invalid routes
	waitOn: function(){
		return [Meteor.subscribe('posts'), Meteor.subscribe('notifications')];
	}
});

Router.route('/', {
	template: 'postsList', //name of the template to use
	name: 'postsList' //name of this route
});

Router.route('/posts/:_id', {
	template: 'postPage', 
	name: 'postPage',
	waitOn: function(){
		return Meteor.subscribe('comments', this.params._id);
	},
	data: function(){
		return Posts.findOne({_id: this.params._id});
	}
});

Router.route('/posts/:_id/edit', {
	template: 'editPost',
	name: 'editPost',
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
}
Router.onBeforeAction(requireLogin,{
	only:['newPost','editPost']
});