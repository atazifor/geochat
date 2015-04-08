if(Posts.find().count() === 0){
	Posts.insert({
  		message: 'Anyone interested in playing basketball today?',
  		tags:['sports','basketball', 'running']
  	});

  	Posts.insert({
  		message: 'Trying to find people to prepare for the upcoming marathon',
  		tags: ['running','marathon','sports']
  	});
}