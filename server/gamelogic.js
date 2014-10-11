function performWins(ticketId){
    var ticket = Tickets.findOne({_id: ticketId});
    var user = Meteor.users.findOne({_id: ticket.userId});
    var ticketPrice = Settings.findOne().ticket_price;
    var earned = 0;

    switch(ticket.win){
        case 2:
            earned = ticketPrice
            break
        case 3:
            earned = ticketPrice * 10
            break
        case 4:
            earned = ticketPrice * 100
            break
        case 5:
            earned = Jackpot.findOne().value
            break 
    }

    History.insert({action: 'win', txt: 'Your won ' + earned, date: new Date()});
    Meteor.users.update(ticket.userId,
        {
            $set: {balance: {bitcoins: user.balance.bitcoins + earned, tickets: user.balance.tickets}},
            $push:{'profile.messages': {id: Mongo.ObjectID(), txt: 'You predicted ' + ticket.win + ' and win ' + earned}}
        });
    return true;
};

function startDraw(){
    console.log('start draw');
    SeqTimestamp.update({}, {lasttime: new Date});
    var url = "http://www.random.org/sequences/?min=1&max=36&col=36&format=plain&rnd=new";
    resp = HTTP.get(url);
    if(resp.statusCode == 200){
        sq = resp.content.split('\t').slice(0, 5);
        Sequences.insert({value: sq, date: new Date});
        LastCombinations.insert({combination: sq, time: new Date});
        var tickets = Tickets.find({is_used: false});
        tickets.forEach(function(ticket){
            var win = 0;
            for(i=0; i < sq.length; i++){
                if(_.contains(ticket.combination, sq[i]))
                    win++;
            }
            Tickets.update({_id: ticket._id}, {$set:{is_used: true, win: win}});
            performWins(ticket._id);
        });
    }
};

//Meteor.setInterval(startDraw, 60000);