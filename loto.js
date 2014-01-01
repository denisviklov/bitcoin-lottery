if (Meteor.isClient) {
  Meteor.startup(function(){});

  Meteor.subscribe('jackpotPub');
  var Jackpot = new Meteor.Collection('jackpot');

  Meteor.subscribe('lastregistered');
  var LastRegisteredUsers = new Meteor.Collection('lastusers');

  Meteor.subscribe('lastcombinations');
  var LastCombinations = new Meteor.Collection('lastcombinations');

  Meteor.subscribe('lastwins');
  var LastWins = new Meteor.Collection('lastwins');

  Template.navBar.jackpot = function(){
    return Jackpot.findOne({});
  };
  Template.layout.jackpot = function(){
    return Jackpot.findOne({});
  };

  Template.layout.helpers({
    prettyJackpot: function(jackpot){
      return String(jackpot).slice(0, 5);
    },
  });

  Template.gameField.helpers({
    getTicket: function(){
      var type = '5/36';
      var field = '';
      for(i=1; i<37; i++){
        if(i==1 || i==7 || i==13 || i==19 || i==25 || i==31)
          field+='<tr>';
        field += '<td class="ticket" touse=false><span>'+i+'</span></td>';
        if(i==6 || i==12 || i==18 || i==24 || i==30 || i==36)
          field+='</td>';
      }
      return field;
    },
  });

  Template.gameField.events({
    'mouseenter .ticket': function(event){
      if($(event.currentTarget).attr('touse') == 'false')
        $(event.currentTarget).attr('bgcolor', '#c0c0c0');
    },
    'mouseleave .ticket': function(event){
      if($(event.currentTarget).attr('touse') == 'false'){
        $(event.currentTarget).attr('bgcolor', '#ffffff');
      }
    },
    'click .ticket': function(event){
      if($(event.currentTarget).attr('touse') == 'false'){
        $(event.currentTarget).attr('bgcolor', '#008000');
        $(event.currentTarget).attr('touse', 'true');
      }else{
        $(event.currentTarget).attr('bgcolor', '#ffffff');
        $(event.currentTarget).attr('touse', 'false');
      }
    },
  });

  Template.stats.lastusers = function(){
    return LastRegisteredUsers.find({});
  };
  Template.stats.lastcombinations = function(){
    return LastCombinations.find({});
  };
  Template.stats.lastwins = function(){
    return LastWins.find({});
  };

  Template.login.events({
    'submit': function(event){
      event.preventDefault();
      event.stopPropagation();
      var form = $(event.currentTarget);
      var submit_btn = form.find('#submit');
      submit_btn.prop('disabled', 'disabled');
      var email = form.find('#inputEmail').val();
      var password = form.find('#inputPassword').val();
      Meteor.loginWithPassword(email, password, function(err){
        if(err){
          showAlert({alertClass: 'danger', txt: err.reason});
        }else{
          Router.go('main');
        }
      });      
    },
  });

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


