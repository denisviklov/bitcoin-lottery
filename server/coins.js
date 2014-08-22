bitcoin = Meteor.require('bitcoin');
client = new bitcoin.Client({
  host: 'localhost',
  port: 8332,
  user: 'denis',
  pass: 'random'
});
client.getBalance(function(err, result){console.log(result)});