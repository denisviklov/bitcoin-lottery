Accounts.urls.verifyEmail = function (token) {
    return Meteor.absoluteUrl('verify-email/' + token);
}


Router.map(function(){
    this.route('blockchain', {
      where: 'server',
      path: '/blockchain/',
      action: function() {
        console.log(this.params);
        user = Meteor.users.findOne({payment_secrete: this.params.secrete});
        console.log(user);
        if(user.payment_secrete == this.params.secrete && user.profile.address == this.params.input_address){
            var userBalance = user.balance ? user.balance : 0;
            Meteor.users.update(user._id, {$set: {balance: userBalance + parseInt(this.params.value)}});
        }
        this.response.end('*ok*');
      }
    });
});
