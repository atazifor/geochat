Router.configure({
	layoutTemplate: 'ApplicationLayout', //main application layout
	loadingTemplate: 'loading', //template to display while data in waitOn is in the process of loading
	waitOn: function(){
		return Meteor.subscribe('posts');
	}
});

Router.route('/', function(){
	this.render('postsList') //name of the template to use
},
{
	name: 'postsList' //name of this route

});