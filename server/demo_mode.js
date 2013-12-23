var getRandomArbitary = function(min, max){
  	return Math.round(Math.random() * (max - min) + min);
};

var getRandomCombination = function(num, maxVal){
	var combination = [];
	while(num !== 0){
		var newNumber = getRandomArbitary(0, maxVal);
		if(_.contains(combination, newNumber)){
			while(_.contains(combination, newNumber)){
				newNumber = getRandomArbitary(0, maxVal);
			}
		}else{
			combination.push(newNumber);
		}
		num--;
	}
	return combination;
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
var recur_combinations = function() {
	var ts = Math.round((new Date()).getTime() / 1000);
	var ran = Math.round(Math.random()*10);
	LastCombinations.insert({combination: getRandomCombination(5, 36), time: new Date});
	MyCron.addScheduleJob(ts + ran, recur_combinations);
};
var recur_jackpot = function() {
	var ts = Math.round((new Date()).getTime() / 1000);
	var ran = Math.round(Math.random()*10);
	Jackpot.update({}, {$inc:{'value': 0.009}});
	MyCron.addScheduleJob(ts + ran, recur_jackpot);
};

if(CONF.is_demo)
	recur_jackpot();
	recur_combinations();
	recur();
	