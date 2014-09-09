/*bitcoin = Meteor.require('bitcoin');
client = new bitcoin.Client({
  host: 'localhost',
  port: 8332,
  user: 'denis',
  pass: 'random'
});
client.getBalance(function(err, result){console.log(result)});
code = 'b2accfc2741d7959be5754d25d103f7cd7d467a0a262a2428078d703d9b0f238';
api_key = 'd2872fe65183ba25981a2612405d4fa5a0b6e2473918ac193738ad0682355261';
url = 'https://dashboard.gocoin.com/auth?response_type=code&client_id=4a5caeba958198e5df53b5889e6f44810fa5b4424953669eb4ce04567d60fa1f&redirect_uri=http://localhost&scope=user_read_write&state=OPTIONAL';
gocoin = Meteor.require('gocoin');
client = new gocoin.Client();
client.setToken('add1b0b2fdbdefadd7dbe9bc98fc8edc8e165213cd94593f7b7816f8eebabfec');
Async.runSync(function(done){
    client.users.self(function(err, user){
        //console.log(user);
        console.log(done(err, user));
    });
});

Async.runSync(function(done){
    client.merchants.listCurrencies('c91bc83f-9859-498d-bcd3-40f7824a156a', function(err, result){
        console.log(done(err, result));
    });
});*/