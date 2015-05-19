Template.newPost.events({
    'submit form': function(e) {
        e.preventDefault();

        var post = {
            message: $(e.target).find('[name=message]').val(),
            tags: $(e.target).find('[name=tags]').val()
        };
        var errors = validatePost(post);//build error object for empty fields

        if(errors.message || errors.tags){//if there are empty fields, set post errors
           return Session.set('postSubmitErrors', errors);
        }

        Meteor.call('insertPost', post, function(error, result){
            if(error){
                return throwError(error.reason);
            }
            Router.go('postPage', {_id: result._id});
        });
    }
});

Template.newPost.onCreated(function() {
    Session.set('postSubmitErrors', {});//reset postSubmitErrors each time template is created
});

Template.newPost.helpers({
    errorMessage: function(field) {
        return Session.get('postSubmitErrors')[field];
    },
    errorClass: function (field) {
        return !!Session.get('postSubmitErrors')[field] ? 'has-error' : '';
    }
});