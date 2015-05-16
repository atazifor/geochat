if(Posts.find().count() === 0){
	var now = new Date().getTime();
	// create two users
	var aminId = Meteor.users.insert({
		profile: { name: 'Amin Tazifor' }
	});
	var amin = Meteor.users.findOne(aminId);

	var peterId = Meteor.users.insert({
		profile: { name: 'Peter Chuba' }
	});
	var peter = Meteor.users.findOne(peterId);

	var blockPartyId = Posts.insert({
		"message" : "Block Party Today",
		"tags" : [
			"HOA",
			"football"
		],
		"userId" : amin._id,
		"author" : amin.profile.name,
		"submitted" : new Date(now - 7 * 3600 * 1000),
		commentsCount: 2
	});
	Comments.insert({
		postId: blockPartyId,
		userId: amin._id,
		author: amin.profile.name,
		submitted: new Date(now - 5 * 3600 * 1000),
		body: 'What can I bring for the party?'
	});

	Comments.insert({
		postId: blockPartyId,
		userId: amin._id,
		author: amin.profile.name,
		submitted: new Date(now - 3 * 3600 * 1000),
		body: 'I am definitely interested. I will come with my wife. We shall bring hot dogs!'
	});

  	var marathodId = Posts.insert({
		"message" : "Marathon Training",
		"tags" : [
			"marathon",
			"running",
			"training"
		],
		"userId" : "ZPLwd8tdX2BrMnp58",
		"author" : "aminzifor",
		"submitted" : new Date(now - 7 * 3600 * 1000),
		commentsCount: 1
	});

	Comments.insert({
		postId: marathodId,
		userId: peter._id,
		author: peter.profile.name,
		submitted: new Date(now - 3 * 3600 * 1000),
		body: 'I am definitely interested. I will come with my wife. We shall bring hot dogs!'
	});
}