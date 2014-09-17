Accounts.urls.verifyEmail = function (token) {
    return Meteor.absoluteUrl('verify-email/' + token);
}


Router.map(function(){
    this.route('blockchain', {
      where: 'server',
      path: '/blockchain/',
      action: function() {
        user = Meteor.users.findOne({payment_secrete: this.params.secrete});
        if(user.payment_secrete == this.params.secrete && user.profile.address == this.params.input_address){
            var userBalance = user.balance ? user.balance : 0;

            Meteor.users.update(user._id,
              {$set: {balance: userBalance + parseInt(this.params.value)}});

            History.insert({action: "deposit",
              user_id: user._id,
              txt: "add amount " + parseInt(this.params.value),
              date: new Date
            });
        }
        this.response.end('*ok*');
      }
    });
});
