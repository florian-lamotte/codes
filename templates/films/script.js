$(function(){
	function recherche(array_choix, array_themes){
		var trueDonnee = false; // stockage des true / false

		// vérifie si chaque thème sélectionné fait parti des thèmes de chaque objet JSON
		$.each(array_choix, function(cle, choix){
		  	if($.inArray(choix, array_themes) == -1){
		  		trueDonnee = false;
		  		return false;
		  	} else {
		  		trueDonnee = true;
		  	}
		});

		return trueDonnee;
	}

	function item(titre, theme){
		return $('.contenu').append('<div class="col-xs-2 item"><h3>' + titre + 
			'</h3><img class="img-responsive" src="http://placehold.it/242x339" alt="">' + theme + 
			'</div>');
	}

	$.getJSON('donnees.json', function(data){
		var themes = [], annees = [], i = 0;

		/* stockage de tous les thèmes dans un tableau
		et stockage des années dans un tableau classé */
		$.each(data, function(cle, valeur){
  			for(i = 0; i < valeur.theme.length; i++){
  				if($.inArray(valeur.theme[i], themes) == -1){
		        	themes.push(valeur.theme[i]);
		        }
  			}

  			if($.inArray(valeur.annee, annees) == -1){
		        annees.push(valeur.annee);
		    }
  		});

		annees.sort().reverse();

  		// liste des années
  		for(i = 0; i < annees.length; i++){
  			$('.navigation-droite ul').append('<li class="annee">' + annees[i] + '</li>');
  		}

  		// liste des thèmes
  		for(i = 0; i < themes.length; i++){
  			$('.navigation-gauche ul').append('<li class="theme"><button value="' + themes[i] + '">' + themes[i] + '</button></li>');
  		}

  		// affiche l'année en titre
  		$('.annee').click(function(){
  			var val = $(this).text();

	  		$('.page-header span').text(val);
	  		$('.page-header small').text('');
	  		$('.contenu').html('');

	  		// affichage des images en fonction de l'année sélectionnée
	  		$.each(data, function(cle, valeur){
	  			if(val == valeur.annee){ // vérifie si l'année cliquée existe dans les données json
		  			item(valeur.titre, valeur.theme);
			    }
	  		});
	  	});	

  		// affiche le thème en titre
	  	$('.theme').click(function(){
	  		var val = $(this).text(); // titre
	  		var choix = [val]; // insère le titre en premier

  			$('.page-header span').text(val.toUpperCase()); // titre en majuscule
  			$('.page-header small').text(''); // remise à zéro du sous-titre qui affiche les autres thèmes
  			$('.contenu').html(''); // efface les données affichées

			// affiche les autres thèmes en sous-titres
			$.each(themes, function(cle, valeur){
				if(valeur != val){
					$('.page-header small').append('<button class="bouton">' + valeur + '</button>');
				}
			});

			// affiche les données en fonction du thème sélectionné
	  		$.each(data, function(cle, valeur){
	  			if($.inArray(val, valeur.theme) != -1){ // vérifie si le thème cliqué existe dans les données json
		  			item(valeur.titre, valeur.theme);
			    }
	  		});
			
			$('.bouton').click(function(){
				var val = $(this).text(); // valeur du bouton
				$('.contenu').html(''); // le contenu est d'abord vidé en cliquant sur un bouton "sous-thème"

				// rend le bouton actif et ajoute un theme pour l'affichage des images
				if($(this).hasClass('actif')){
					$(this).toggleClass('actif');

					choix.splice(choix.indexOf(val), 1); // enlève le thème cliqué du tableau des choix				
				} else { // rend le bouton inactif et enlève un theme pour l'affichage des images
					$(this).toggleClass('actif');

					if($.inArray(val, choix) == -1){
				    	choix.push(val); // ajoute le thème cliqué au tableau des choix
					}
				}
				
				$.each(data, function(cle, valeur){ // pour chaque objet JSON...
					// ...envoi à la fonction recherche() la liste des thèmes sélectionnés et les thèmes de chaque objet
			  		if(recherche(choix, valeur.theme) == true){ // si la fonction recherche() retourne true...
			  			// ...le contenu est rempli avec les données correspondantes 
			  			item(valeur.titre, valeur.theme);
			  		}
			  	});
	  		});
  		});
	});
});