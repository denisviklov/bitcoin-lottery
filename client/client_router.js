Router.onBeforeAction('loading');

Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  before: function(){
    if(!Meteor.user() && this.route.name !== 'landing')
      $('body').addClass('coming-soon');
    if(Meteor.user()){
      $('body').removeClass('coming-soon');
      Router.go('game');
      Meteor.call('getBalance', function(err, res){
        if(res){
          //console.log(res);    
          Session.set('balanceBitcoins', res.bitcoins);
          Session.set('balanceTickets', res.tickets);
        }
      });
    }
    if(this.route.name == 'logout'){
      this.pause();
      Meteor.logout();
      Router.go('/');
      return;
    }
  },
});

Router.map(function(){
  this.route('landing', {
    path: '/',
    onBeforeAction: function() {
      //$('body').addClass('coming-soon');
    },
  });

  this.route('signUp');
  this.route('login', {
    onBeforeAction: function() {
      //$('body').removeClass('coming-soon');
    },
  });
  this.route('logout', {
    path: '/logout',
    onRun: function(){
      Meteor.logout();
      Router.go('landing');
    }
  });

  this.route('verifyEmail', {
    path: '/verify-email/:token',
    onRun: function(){
      Accounts.verifyEmail(this.params.token, function(err){
        //strange behaviour here, load is call two times
        Router.go('main');
        //if(err){showAlert({alertClass: 'danger', txt: err.reason});}
        //else{Router.go('home');}
      });
    },
  });

  this.route('game', {
  waitOn: function() { return Meteor.subscribe('settings')},
  });
  this.route('deposit', {
    onBeforeAction: function(){
      Meteor.call('isWalletExist', function(err, res){
        if(res){
          console.log(res);
        }else{
          console.log(err);
        } 
      });
    },
  });
  this.route('withdrawal');
  this.route('history');
  this.route('affilate');
});