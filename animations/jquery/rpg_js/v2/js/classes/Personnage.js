var DIRECTION = {
    "BAS"    : 0,
    "GAUCHE" : 1,
    "DROITE" : 2,
    "HAUT"   : 3
}

var DUREE_ANIMATION = 4;
var DUREE_DEPLACEMENT = 15;

this.etatAnimation = -1;

function Personnage(url, x, y, direction){
	this.x = x;
	this.y = y;
	this.direction = direction;

	this.image = new Image();
	this.image.referenceDuPerso = this;
	this.image.onload = function() {
		if(!this.complete){
			throw new Error("Erreur de chargement du tileset nommé \"" + url + "\".");
		}
		this.referenceDuPerso.largeur = this.width / 4;
		this.referenceDuPerso.hauteur = this.height / 4;
	}
	this.image.src = "sprites/" + url;
}

Personnage.prototype.dessinerPersonnage = function(context){
	var frame = 0;
	var decalageX = 0, decalageY = 0;

	if(this.etatAnimation >= DUREE_DEPLACEMENT){
		this.etatAnimation = -1;
	} else if(this.etatAnimation >= 0){
		frame = Math.floor(this.etatAnimation / DUREE_ANIMATION);
		if(frame > 3){
			frame %= 4;
		}

		var pixelsAParcourir = 32 - (32 * (this.etatAnimation / DUREE_DEPLACEMENT));

		if(this.direction == DIRECTION.HAUT){
			decalageY = pixelsAParcourir;
		} else if(this.direction == DIRECTION.BAS){
			decalageY = -pixelsAParcourir;
		} else if(this.direction == DIRECTION.GAUCHE){
			decalageX = pixelsAParcourir;
		} else if(this.direction == DIRECTION.DROITE){
			decalageX = -pixelsAParcourir;
		}

		this.etatAnimation++;
	}

	context.drawImage(
		this.image, 
		this.largeur * frame, this.direction * this.hauteur, 
		this.largeur, this.hauteur, 
		(this.x * 32) - (this.largeur / 2) + 16 + decalageX, (this.y * 32) - this.hauteur + 24 + decalageY,
		this.largeur, this.hauteur
	);
}

Personnage.prototype.getCoordonneesAdjacentes = function(direction){
	var coord = {'x':this.x, 'y':this.y}
	switch(direction){
		case DIRECTION.BAS:
			coord.y++;
			break;
		case DIRECTION.GAUCHE:
			coord.x--;
			break;
		case DIRECTION.DROITE:
			coord.x++;
			break;
		case DIRECTION.HAUT:
			coord.y--;
			break;
	}
	return coord;
}

Personnage.prototype.deplacer = function(direction, map){
	if(this.etatAnimation >= 0){
		return false;
	}

	this.direction = direction;

	var prochaineCase = this.getCoordonneesAdjacentes(direction);
	if(prochaineCase.x < 0 || prochaineCase.y < 0 || prochaineCase.x >= map.getLargeur() || prochaineCase.y >= map.getHauteur()){
		return false;
	}

	this.etatAnimation = 1;
	this.x = prochaineCase.x;
	this.y = prochaineCase.y;

	return true;
}