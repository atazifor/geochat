Template.editPost.events({
    'submit form': function(e) {
        e.preventDefault();

        var postAttributes = {
            message: $(e.target).find('[name=message]').val(),
            tags: $(e.target).find('[name=tags]').val()
        };
        var errors = validatePost(postAttributes);//build error object for empty fields

        if(errors.message || errors.tags){//if there are empty fields, set post errors
            return Session.set('postSubmitErrors', errors);
        }

        var currentPostId = this._id;

        Posts.update(currentPostId, {$set: postAttributes}, function(error){
            if(error){
                throwError(error.reason);
            }else{
                Router.go('postPage', {_id: currentPostId});
            }
        });
    },
    'click .delete': function(e){
        e.preventDefault();
        if(confirm('Are you sure you want to delete this post?')){
            Posts.remove(this._id);
            Router.go('postsList');
        }
    }
});

Template.editPost.onCreated(function() {
    Session.set('postSubmitErrors', {});//reset postSubmitErrors each time template is created
});

Template.editPost.helpers({
    errorMessage: function(field) {
        return Session.get('postSubmitErrors')[field];
    },
    errorClass: function (field) {
        return !!Session.get('postSubmitErrors')[field] ? 'has-error' : '';
    }
});