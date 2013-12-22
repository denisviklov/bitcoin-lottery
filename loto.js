if (Meteor.isClient) {
  Meteor.startup(function(){});

  Meteor.subscribe('jackpotPub');
  var Jackpot = new Meteor.Collection('jackpot');

  Meteor.subscribe('lastregistered');
  var LastRegisteredUsers = new Meteor.Collection('lastusers');

  Template.navBar.jackpot = function(){
    return Jackpot.findOne({});
  };
  Template.home.jackpot = function(){
    return Jackpot.findOne({});
  };
  Template.home.lastusers = function(){
    return LastRegisteredUsers.find({});
  };
  Template.signUp.events({
    'submit': function(event){
      event.preventDefault();
      event.stopPropagation();
      var form = $(event.currentTarget);
      var submit_btn = form.find('#submit');
      submit_btn.prop('disabled', 'disabled');
      var username = form.find('#inputUsername').val();
      var email = form.find('#inputEmail').val();
      var password = form.find('#inputPassword').val();
      var promoCode = form.find('#inputPromoCode').val();
      Accounts.createUser({username: username, email: email, password: password, promoCode: promoCode},
        function(err){
          if(err){
            showAlert({alertClass: 'danger', txt: err.reason});
            submit_btn.prop('disabled', false);
          }else{
            Meteor.call('sendVerificationEmail');
            showAlert({alertClass: 'success', txt: 'For confirm registration. \
              Please, check your email for further instructions'});
          }
        });
    },
  });
}


