Template.header.helpers({
   isUserNeigborhoodSet: function(){
      //return Meteor.users.findOne({_id: Meteor.userId(), 'profile.neighborhood' : {$exists: true}}, {fields: {profile: 1}});
      return Meteor.user() && Meteor.user().profile.neighborhood;
   }
});

/**
 * global helper method that can be used in all templates
 */
Template.registerHelper('isCurrentUserNeighborhoodSet', function(){
    return Meteor.user() && Meteor.user().profile.neighborhood;
});