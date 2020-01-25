$('#donnees_bdd').hide();

$('#choix_bdd_sql').click(function(){
	$('#donnees_bdd').show();
	$('#nom_bdd').prop('required', true);
});

$('#choix_bdd_json').click(function(){
	$('#donnees_bdd').hide();
	$('#nom_bdd').prop('required', false);
});

$('#choix_bdd_aucune').click(function(){
	$('#donnees_bdd').hide();
	$('#nom_bdd').prop('required', false);
});