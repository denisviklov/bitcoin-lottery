Router.configure({
  before: function(){
    if(this.route.name == 'logout'){
      this.stop();
      Meteor.logout();
      Router.go('/');
      return;
    }
  },
  layoutTemplate: 'layout'
});

Router.map(function(){
  this.route('home', {path: '/', template: 'home'});
  this.route('signUp');
  this.route('login');
  this.route('verifyEmail', {
    path: '/verify-email/:token',
    load: function(){
      Accounts.verifyEmail(this.params.token, function(err){
        //strange behaviour here, load is call two times
        Router.go('main');
        //if(err){showAlert({alertClass: 'danger', txt: err.reason});}
        //else{Router.go('home');}
      });
    },
  });
  this.route('logout', {path: '/logout'});
  this.route('main', {path: 'innerMain', template: 'innerMain'});
});