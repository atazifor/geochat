/**
 * Created by ATazifor on 8/21/2015.
 */
Template.register.events({
    'submit form': function(event){
        event.preventDefault();
        var email = $('[name=email]').val();
        var password = $('[name=password]').val();
        Accounts.createUser({
            email:email,
            password: password
        });
        Router.go('postsList');
    }
});


Template.login.events({
    'submit form': function(event){
        event.preventDefault();
        var email = $('[name=email]').val();
        var password = $('[name=password]').val();
        Meteor.loginWithPassword(email, password);
    }
});

Template.header.events({
    'click .logout': function(event){
        event.preventDefault();
        Meteor.logout();
        Router.go('postsList');
    }
});