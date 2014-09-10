Jackpot = new Meteor.Collection('jackpot');
LastRegisteredUsers = new Meteor.Collection('lastusers');
LastCombinations = new Meteor.Collection('lastcombinations');
LastWins = new Meteor.Collection('lastwins');
PromoCodes = new Meteor.Collection('promocodes');
Settings = new Meteor.Collection('settings');

//------------------capped collectios
var userQuery = LastRegisteredUsers.find({});
var userHandler = userQuery.observeChanges({
	added: function(username, time){
		if(LastRegisteredUsers.find().count() > 5){
			var lastInSet = LastRegisteredUsers.findOne({}, {sort:{time: 1}, limit: 1});
			id = LastRegisteredUsers.remove({_id: lastInSet._id});
		}
	},
});

var combinationQuery = LastCombinations.find({});
var combinationHandler = combinationQuery.observeChanges({
	added: function(combination, time){
		if(LastCombinations.find().count() > 5){
			var lastInSet = LastCombinations.findOne({}, {sort:{time: 1}, limit: 1});
			id = LastCombinations.remove({_id: lastInSet._id});
		}
	},
});

var combinationQuery = LastCombinations.find({});
var combinationHandler = combinationQuery.observeChanges({
	added: function(combination, time){
		if(LastCombinations.find().count() > 5){
			var lastInSet = LastCombinations.findOne({}, {sort:{time: 1}, limit: 1});
			id = LastCombinations.remove({_id: lastInSet._id});
		}
	},
});

var winsQuery = LastWins.find({});
var winsHandler = winsQuery.observeChanges({
	added: function(combination, time){
		if(LastWins.find().count() > 5){
			var lastInSet = LastWins.findOne({}, {sort:{time: 1}, limit: 1});
			id = LastWins.remove({_id: lastInSet._id});
		}
	},
});
//---------------------end of capped collections


//---------jackpot init
Meteor.startup(function(){
	if(!Jackpot.findOne())
		Jackpot.insert({value: 1000});
	if(!Settings.findOne())
		Settings.insert({gameType: {num: 5, from: 36}});
});

Meteor.publish('jackpotPub', function(){
	return Jackpot.find({});
});

Meteor.publish('lastregistered', function(){
	return LastRegisteredUsers.find({}, {sort:{time: -1}, limit: 5});
});

Meteor.publish('lastcombinations', function(){
	return LastCombinations.find({}, {sort:{time: -1}, limit: 5});
});

Meteor.publish('lastwins', function(){
	return LastWins.find({}, {sort:{time: -1}, limit: 5});
});

Meteor.publish('settings', function(){
	return Settings.find({});
});

Meteor.methods({
	sendVerificationEmail: function(){
		Accounts.sendVerificationEmail(Meteor.userId());
		LastRegisteredUsers.insert({username: Meteor.user().username, time: new Date});
	},
	isWalletExist: function(){
		self = this;
		if(this.userId){
			if (!Meteor.user().profile.address){
				var callback_id = MD5.hex(CONF.salt + this.userId);
				HTTP.get("https://blockchain.info/ru/api/receive",
					{params: {method: "create", address: CONF.wallet_address,
					callback: CONF.callback_url +'?secrete='+ callback_id}},
					function(err, res){
						if(res){
							var address = res.data.input_address;
							Meteor.users.update({_id: self.userId},
								{$set: {payment_secrete: callback_id, profile: {address: address}}});
						}else{
							console.log(err);
						}
					})
			}
		}
	},
});


