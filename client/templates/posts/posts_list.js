/*
* should users be allowed to enter when a message should expire
*/
var postsData = [
  {
  	message: 'Anyone interested in playing basketball today?',
  	tags:['sports','basketball', 'running']
  },
  {
  	message: 'Trying to find people to prepare for the upcoming marathon',
  	tags: ['running','marathon','sports']
  }
];
Template.postsList.helpers({
	posts: postsData
});