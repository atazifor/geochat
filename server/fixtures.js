if(Posts.find().count() === 0){
	var now = new Date().getTime();

	//insert neighborhood
	var neighborhoodId = Neighborhoods.insert({
		"type" : "Feature",
		"geometry" : {
			"type" : "Polygon",
			"coordinates" : [
				[
					[
						-86.1589632000000170,
						39.7684445000000010
					],
					[
						-86.1584876717418520,
						39.7680990084971880
					],
					[
						-86.1586693073738840,
						39.7675399915028080
					],
					[
						-86.1592570926261490,
						39.7675399915028080
					],
					[
						-86.1594387282581240,
						39.7680990084971880
					],
					[
						-86.1589632000000170,
						39.7684445000000010
					]
				]
			]
		},
		"properties" : {
			"name" : "Downtown Indianapolis"
		},
		"id" : "ByWFzmG8nqjad9xwm"
	});
	// create two users
	var aminId = Meteor.users.insert({
		profile: {
			name: 'Amin Tazifor',
			"neighborhoodId" : neighborhoodId
		}
	});
	var amin = Meteor.users.findOne(aminId);

	var peterId = Meteor.users.insert({
		profile: {
			name: 'Peter Chuba',
			"neighborhoodId": neighborhoodId
		}
	});
	var peter = Meteor.users.findOne(peterId);

	var blockPartyId = Posts.insert({
		"message" : "Block Party Today",
		"tags" : [
			"HOA",
			"football"
		],
		"userId" : amin._id,
		"neighborhoodId" : neighborhoodId,
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
		"userId" : peter._id,
		"neighborhoodId": neighborhoodId,
		"author" : peter.profile.name,
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

	for (i = 0; i < 10; i++){
		Posts.insert({
			"message" : "Pagination Added " + i,
			"tags" : [
				"page",
				"add"
			],
			"userId" : peter._id,
			"author" : peter.profile.name,
			"neighborhoodId": "s0meFake1ID",
			"submitted" : new Date(now - 7 * 3600 * 1000),
			commentsCount: 0
		});
	}
}