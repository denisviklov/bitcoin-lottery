Jackpot = new Meteor.Collection('jackpot');
LastRegisteredUsers = new Meteor.Collection('lastusers');
LastCombinations = new Meteor.Collection('lastcombinations');
LastWins = new Meteor.Collection('lastwins');
PromoCodes = new Meteor.Collection('promocodes');
Settings = new Meteor.Collection('settings');
History = new Meteor.Collection('history');
Tickets = new Meteor.Collection('tickets');
Sequences = new Meteor.Collection('sequences');
SeqTimestamp = new Meteor.Collection('seqtimestamp');


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
	if(!Settings.findOne()){
		Settings.insert({gameType: {num: 5, from: 36}});
		Settings.insert({ticket_price: 0.00000001});
	}
	if(!SeqTimestamp.findOne())
		SeqTimestamp.insert({lasttime: new Date})
	//settings
	if(!process.env.MAIL_URL)
  		process.env.MAIL_URL = 'smtp://postmaster%40bitcoinlottery.rocks:81d80b0d2449e1cdff907e8f6ad761b5@smtp.mailgun.org:587';
  	if(!process.env.ROOT_URL)
  		process.env.ROOT_URL = 'http://bitcoinlottery.rocks'
  	if(!ServiceConfiguration.configurations.findOne({service: 'facebook'}))
  		ServiceConfiguration.configurations.insert({service: 'facebook',
  										appId: '1936365749835664',
  										secrete: '810703d3cbce79ab3218f5d6270e38f6'});
  	if(!ServiceConfiguration.configurations.findOne({service: 'google'}))
  		ServiceConfiguration.configurations.insert({service : "google", clientId : "240654706988-edvgfd4cg6gakobtdfsothc8gc1nunu1.apps.googleusercontent.com", secret : "MAmS_D6WlR8wWevxoLbPGlQb"});

});
/*
Social credentials
{ "service" : "facebook", "appId" : "1936365749835664", "secret" : "810703d3cbce79ab3218f5d6270e38f6"}
{ "service" : "google", "clientId" : "240654706988-edvgfd4cg6gakobtdfsothc8gc1nunu1.apps.googleusercontent.com", "secret" : "MAmS_D6WlR8wWevxoLbPGlQb"}
*/

//----- publishings
Meteor.publish("userData", function () {
  if (this.userId) {
    return Meteor.users.find({_id: this.userId},
                             {fields: {'balance': 1}});
  } else {
    this.ready();
  }
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

Meteor.publish('history', function(){
	return History.find({user_id: this.userId});
});

Meteor.publish('countdown', function(){
	return SeqTimestamp.find({});
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
	getBitcoinAddress: function(){
		return Meteor.user().profile.address;
	},
	getBalance: function(){
		return Meteor.user().balance;
	},
	buyTicket: function(ticket){
		var insertTicket = function(userId, ticket){
			Tickets.insert({userId: userId, combination: ticket,
				date: new Date(), is_used: false});
			return true;
		};

		var balance = Meteor.user().balance;
		if(Meteor.user().balance.bitcoins){
			//do smth with coins
			if(Meteor.user().balance.bitcoins > Settings.findOne().ticket_price){
				Meteor.users.update(Meteor.userId(),
					{$set: {balance: {bitcoins: Meteor.user().balance.bitcoins - Settings.findOne().ticket_price,
						tickets: balance.tickets}}});
				insertTicket(Meteor.userId(), ticket);
				return {status: 'success', msg: 'Your have bought a ticket'};
			}else{}
		}
		if(Meteor.user().balance.tickets){
			//do with tickets
			Meteor.users.update(Meteor.userId(),
				{$set: {balance: {tickets: Meteor.user().balance.tickets - 1,
					bitcoins: balance.tickets}}});
			insertTicket(Meteor.userId(), ticket);
			return {status: 'success', msg: 'Your have bought a ticket'};
		}
		return {status: 'error', msg: 'Insuffucient funds'};
	},
	getCountdown: function(){
		var minutes = 5;
		var count = SeqTimestamp.findOne().lasttime;
		return count.setMinutes(count.getMinutes() + minutes);
	}
});


