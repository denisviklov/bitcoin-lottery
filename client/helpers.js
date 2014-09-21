showAlert = function(opts){
	var classes_remove = 'alert-danger alert-success alert-info alert-warning';
    $('#alert-txt').text(opts.txt);
	$('.alert').removeClass(classes_remove).addClass('alert-'+opts.alertClass).show();
};

function dateFormat(d){
	var d = new Date(d);
	return d.toISOString().split('T')[0].substr(2).split('-').reverse().join('-')+' '+d.toTimeString().split(' ')[0];
};

function activeTab(){
    Session.get('activeTab');
    return 'class="active"'
}

Handlebars.registerHelper('dateFormat', dateFormat);

