var getRandomArbitary = function(min, max){
  	return Math.round(Math.random() * (max - min) + min);
};
var names = ['john', 'dark', 'blade', 'rich', 'yama', 'zzz'];

var MyCron = new Cron(100);
var ts = Math.round((new Date()).getTime() / 1000);
var recur = function() {
	var ts = Math.round((new Date()).getTime() / 1000);
	var ran = Math.round(Math.random()*10);
	//console.log('schedule tick. I will get called again in ' + ran + ' second(s)');
	//console.log(getRandomArbitary(0,5));
	var name = names[getRandomArbitary(0,5)];
	LastRegisteredUsers.insert({username: name, time: new Date});
	MyCron.addScheduleJob(ts + ran, recur);
};

if(CONF.is_demo)
	recur();