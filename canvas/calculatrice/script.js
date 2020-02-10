var valeur = "";

$(".btn").click(function(){
	// récupération de la valeur de chaque bouton
	bouton = $(this).val();
	
	// chiffres et opérateurs mis bout à bout dans la variable "valeur"
	// = et reset stoppent le script (voir plus bas)
	if(bouton != "=" & bouton != "Reset")
		valeur += bouton;
	
	// affichage des valeurs des boutons dans le champs texte
	// valeurs du champs de texte converties en string (pour la fonction eval)
	$("#calcul").val(new String(valeur));
	affichage = $("#calcul").val();

	// résultat du calcul
	if(bouton == "="){
		resultat = eval(affichage); // fonction de calcul auto
		$("#calcul").val(resultat); // affichage du résultat d'eval
		valeur = ""; // remise à zéro pour les prochains calculs
	}
	// remise à zéro du calcul
	else if(bouton == "Reset"){
		valeur = "";
	}
});