Jackpot = new Meteor.Collection('jackpot');
LastRegisteredUsers = new Meteor.Collection('lastusers');
LastCombinations = new Meteor.Collection('lastcombinations');
LastWins = new Meteor.Collection('lastwins');
PromoCodes = new Meteor.Collection('promocodes');

var userQuery = LastRegisteredUsers.find({});
var userHandler = userQuery.observeChanges({
	added: function(username, time){
		if(LastRegisteredUsers.find().count() > 5){
			var lastInSet = LastRegisteredUsers.findOne({}, {sort:{time: 1}, limit: 1});
			id = LastRegisteredUsers.remove({_id: lastInSet._id});
		}
	},
});

Meteor.startup(function(){
	if(!Jackpot.findOne())
		Jackpot.insert({value: 1000});
});

Meteor.publish('jackpotPub', function(){
	return Jackpot.find({});
});

Meteor.publish('lastregistered', function(){
	return LastRegisteredUsers.find({}, {sort:{time: -1}, limit: 5});
});

Meteor.methods({
	sendVerificationEmail: function(){
		Accounts.sendVerificationEmail(Meteor.userId());
	},
});


