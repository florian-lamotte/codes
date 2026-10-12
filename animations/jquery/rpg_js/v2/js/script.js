var map = new Map("chemin");
var joueur = new Personnage("perso.png", 7, 14, DIRECTION.BAS);

map.addPersonnage(joueur);

window.onload = function() {
	var canvas = document.getElementById('canvas');
	var context = canvas.getContext('2d');
	
	canvas.width = map.getLargeur() * 32;
	canvas.height = map.getHauteur() * 32;

	setInterval(function(){
		map.dessinerMap(context);
	}, 40); // redessine la carte toutes les 40 millisecondes (25 images par seconde)

	window.onkeydown = function(event){
		var e = event || window.event;
		var key = e.which || e.keyCode;

		switch(key){
			case 38 : case 122 : case 119 : case 90 : case 87 :
				joueur.deplacer(DIRECTION.HAUT, map);
				break;
			case 40 : case 115 : case 83 :
				joueur.deplacer(DIRECTION.BAS, map);
				break;
			case 37 : case 113 : case 97 : case 81 : case 65 :
				joueur.deplacer(DIRECTION.GAUCHE, map);
				break;
			case 39 : case 100 : case 68 :
				joueur.deplacer(DIRECTION.DROITE, map);
				break;
			default:
				return true;
		}

		return false; // le comportement normal de la touche ne se produit pas avec false
	}
}