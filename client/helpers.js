showAlert = function(opts){
	var classes_remove = 'alert-danger alert-success alert-info alert-warning';
	$('.alert').removeClass(classes_remove).addClass('alert-'+opts.alertClass).text(opts.txt).show().hide(10000);
}