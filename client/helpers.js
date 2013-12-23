showAlert = function(opts){
	var classes_remove = 'alert-danger alert-success alert-info alert-warning';
	$('.alert').removeClass(classes_remove).addClass('alert-'+opts.alertClass).text(opts.txt).show().hide(10000);
}

function dateFormat(d){
	var d = new Date(d);
	return d.toISOString().split('T')[0].substr(2).split('-').reverse().join('-')+' '+d.toTimeString().split(' ')[0];
}

Handlebars.registerHelper('dateFormat', dateFormat);
