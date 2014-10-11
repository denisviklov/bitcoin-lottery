
if (Meteor.isClient) {
  Meteor.startup(function(){
    Session.set('ticket', []);
  });

  Meteor.subscribe('jackpotPub');
  var Jackpot = new Meteor.Collection('jackpot');

  Meteor.subscribe('lastregistered');
  var LastRegisteredUsers = new Meteor.Collection('lastusers');

  Meteor.subscribe('lastcombinations');
  var LastCombinations = new Meteor.Collection('lastcombinations');

  Meteor.subscribe('lastwins');
  var LastWins = new Meteor.Collection('lastwins');

  Meteor.subscribe('settings');
  var Settings = new Meteor.Collection('settings');

  Meteor.subscribe('history');
  var History = new Meteor.Collection('history');

  Meteor.subscribe("userData");
  var UserData = new Meteor.Collection('userdata');

  Meteor.subscribe("countdown", function(){
    Session.set('sqstamp', true);    
  });
  var SeqTimestamp = new Meteor.Collection('countdown');

  Template.navBar.jackpot = function(){
    return Jackpot.findOne({});
  };

  Template.navBar.balance = function(){
    if(Meteor.user().balance)
      return Meteor.user().balance;
    else
      return {bitcoins: 0, tickets: 0};
  };  

  Template.layout.jackpot = function(){
    return Jackpot.findOne({});
  };

  Template.layout.helpers({
    prettyJackpot: function(jackpot){
      return String(jackpot).slice(0, 7);
    },
  });

  Template.layout.msg = function(){
    if(Meteor.user()){
      var messages = Meteor.user().profile.messages;
      _.each(messages, function(element, index, list){
        Notifications.info('warning', element.txt);
        Meteor.users.update( { _id: Meteor.userId() }, { $pull: { 'profile.messages': element.id}} );
      });
    }
  }

  Template.game.counter = function(){
    var cc = function(){
    Meteor.call('getCountdown', function(err, data){
      console.log(data);
      $('.countdown').countdown({date: data, template: '%i %s',
        onComplete: function(){
          $('.countdown').countdown('destroy');
          cc();
        },
      });
    })
    };
    //cc();
  }

  Template.game.events({
    'click #buy-ticket': function(event){
      //buy ticket functional there
      if(Session.get('ticket').length != 5)
        Notifications.warn('warning', 'Ticket must contains 5 digits');
        //showAlert({alertClass: 'warning', txt: 'Ticket should contain 5 digits'});
      else{
        Meteor.call('buyTicket', Session.get('ticket'), function(err, res){
          if(res){
            $('.fill_cell').removeClass('fill_cell');
            $('.on_cell').removeClass('on_cell');
            Session.set('ticket', []);
            if(res.status == 'success')
              Notifications.success('Success', res.msg);
            else
              Notifications.error('Error', res.msg)
          }
        })
      }
    },
  });

  Template.gameField.field = function(){
        //var type = '5/36';
        //console.log(Session.get("gameType"));
        var field = '';
        //settings.gameType = {};
        //settings.gameType.num = 5;
        //settings.gameType.from = 36;
        var z = 1;
        var setting = Settings.find().fetch()[0];
        for(i=0; i<setting.gameType.num; i++){
          field+="<tr>";
          for(j=0; j<parseInt(setting.gameType.from/setting.gameType.num) && z<=setting.gameType.from; j++){
            field+='<td class="ticket" touse=false><span>'+z+'</span></td>';
            z++;
          }
          z++;
          field+='</tr>';
        }
        return field;  
      };

  Template.game.ticket = function(){
    return Session.get('ticket');
  };

  var find_and_delete = function(arr, el){
    for(i=0; i < arr.length; i++){
      if(arr[i] == el){
        delete arr[i];
        return _.compact(arr);
      }
    }
    return arr;
  };

  Template.gameField.events({
    'mouseenter .ticket': function(event){
      if($(event.currentTarget).attr('touse') == 'false')
        //$(event.currentTarget).attr('bgcolor', '#c0c0c0');
        $(event.currentTarget).addClass('on_cell');
    },
    'mouseleave .ticket': function(event){
      if($(event.currentTarget).attr('touse') == 'false'){
        //$(event.currentTarget).attr('bgcolor', '#ffffff');
        $(event.currentTarget).removeClass('on_cell');
      }
    },
    'click .ticket': function(event){
      var ticket = Session.get('ticket');
      if($(event.currentTarget).attr('touse') == 'false'){
        if(Session.get('ticket').length == 5)
          //showAlert({alertClass: 'warning', txt: 'Only 5 digits allowed'});
          Notifications.warn('warning', 'Only 5 digits allowed');
        else{
          ticket.push($(event.currentTarget).text());
          Session.set('ticket', ticket);
          //$(event.currentTarget).attr('bgcolor', '#008000');
          $(event.currentTarget).addClass('fill_cell');
          $(event.currentTarget).attr('touse', 'true');
        }
      }else{
        //$(event.currentTarget).attr('bgcolor', '#ffffff');
        $(event.currentTarget).removeClass('fill_cell');
        $(event.currentTarget).attr('touse', 'false');
        ticket = find_and_delete(ticket, $(event.currentTarget).text());
        Session.set('ticket', ticket);
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
          Notifications.error('error', err.reason)
          //showAlert({alertClass: 'danger', txt: err.reason});
          submit_btn.prop('disabled', false);
        }else{
          Router.go('game');
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
            //showAlert({alertClass: 'danger', txt: err.reason});
            Notifications.success('error', err.reason);
            submit_btn.prop('disabled', false);
          }else{
            Meteor.call('sendVerificationEmail');
            Notifications.success('success', 'For confirm registration. Please, check your email for further instructions')
            Router.go('game');
            //showAlert({alertClass: 'success', txt: 'For confirm registration. \
              //Please, check your email for further instructions'});
          }
        });
    },
    'click .btn-facebook': function(evt){
      evt.preventDefault();
      Meteor.loginWithFacebook({requestPermissions: ['email'], style: 'popup'}, function(err){
        if(err)
          Notifications.error('Error', err.message)
        else
          Router.go('game');
      });
    },
    'click .btn-google-plus': function(evt){
      evt.preventDefault();
      Meteor.loginWithGoogle({style: 'popup'}, function(err){
        if(err)
          Notifications.error('Error', err.message)
        else
          Router.go('game');
      });
    },
  });

  Template.login.events({
    'click .btn-facebook': function(evt){
      evt.preventDefault();
      Meteor.loginWithFacebook({requestPermissions: ['email'], style: 'popup'}, function(err){
        if(err)
          Notifications.error('Error', err.message)
        else
          Router.go('game');
      });
    },
    'click .btn-google-plus': function(evt){
      evt.preventDefault();
      Meteor.loginWithGoogle({style: 'popup'}, function(err){
        if(err)
          Notifications.error('Error', err.message)
        else
          Router.go('game');
      });
    },
  });

  Template.navTabs.events({
    'click li': function(event){
      $('li').removeClass('active');
      $(event.currentTarget).addClass('active');
    },
  });

  Template.withdrawal.events({
    "submit": function(e){
      e.preventDefault();
      e.stopPropagation();
      var form = $(e.currentTarget);
      var sbt = form.find('button');
    }
  });

  Template.history.records = function(){
    return History.find();
  };

  Template.affilate.url = function(){
    return document.location.origin + '/welcome/' + Meteor.userId();
  };

  function jackpotWidget(){
    return String(Jackpot.findOne().value).slice(0, 7) + ' &#3647;';
  };
  Template.registerHelper('jackpotWidget', jackpotWidget);

  Template.deposit.rendered = function(){
    Meteor.call('getBitcoinAddress', function(err, res){
      if(res){
        //console.log(res);
        $('#qr').qrcode({text: res,width: 150,height: 150,});
        }
      });
  }
    //var bitcoinAddress = this.find('.bitcoin-address').value;
    //console.log(bitcoinAddress);
}

  
  
