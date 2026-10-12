$(function(){
	/* création du canvas */
	var	canvas = $("#canvas")[0];
	var context = canvas.getContext('2d');
	canvas.width = 1000;
	canvas.height = 300;

	/* intégration du sprite du dragon au canvas */
	var dragonImage = new Image();
	dragonImage.src = 'dragon.png';

	var left = false; // touche gauche à false par défaut
	var right = false; // touche droite à false par défaut
	var up = false; // touche "saut" à false par défaut
	var x_speed = 0; // vitesse de course du personnage (immobile par défaut)
	var x = 0; // position horizontale d'origine du dragon dans le canvas
	var y = 0; // position verticale d'origine du dragon dans le canvas

	// création du sol
	function tiles(){
		var tile = new Image();
		tile.src = 'tiles.png';

		tile.onload = function(){
			for (var i = 0; i < 10; i++){
				/* context.drawImage(image,
					débutDécoupageX,débutDécoupageY,
					tailleDécoupageX,tailleDécoupageY,
					coordonnéePlacementImageX,coordonnéePlacementImageY,
					largeurImage,hauteurImage);
				*/
				context.drawImage(tile,0,0,100,100,i*100,canvas.height-50,100,100);
			}
		};
	}
	tiles(); // l'appel de la fonction créé le sol

	/* appel de la fonction sprite() avec un tableau en paramètre et stockage de 
	cette fonction dans une variable pour en simplifier son utilisation par la suite */
	var dragon = sprite({
		context: canvas.getContext('2d'),
		width: canvas.width, // longueur de la zone de sprite
		height: canvas.height-50, // hauteur de la zone de sprite (100 initialement)
		image: dragonImage, // image à charger
		nombreDeFrames: 4, // nombre de frames de l'image
		ticksPerFrame: 7 // vitesse d'animation du personnage
		// ne pas confondre avec la vitesse de course du personnage (x_speed)
	});
	
	// charge la fonction gameLoop() avec le sprite du personnage
	dragonImage.addEventListener("load", gameLoop);

	function gameLoop(){
		requestAnimationFrame(gameLoop); // notifie le navigateur qu'une animation doit avoir lieu
		if(left){ // tourne vers la gauche
			dragon.updateInverse();
			dragon.renderInverse();
			dragon.speed();
		} else if (right){ // tourne vers la droite
			dragon.update();
			dragon.render();
			dragon.speed();
		} else if (up){
			dragon.sauter();
		} else { // doit rester à sa position d'arrêt
			dragon.renderStatique();
		}
	}	

	function sprite(options){
		var that = {}, 
			frameIndex = 0,
			tickCount = 0,
			ticksPerFrame = options.ticksPerFrame || 0,
			nombreDeFrames = options.nombreDeFrames || 1;
		that.context = options.context;
		that.width = options.width;
		that.height = options.height;
		that.image = options.image;

		that.render = function(){
			// nettoyage de la zone de fond, nécessaire pour éviter les doublons du sprite en mouvement
			that.context.clearRect(0, 0, that.width, that.height);
			context.fillStyle = "rgb(146, 210, 237)"; // couleur de fond
			context.fillRect(0, 0, canvas.width, canvas.height-50); // mise en place du fond
			// mise en place du sprite
			that.context.drawImage( 
				that.image, // le sprite complet
				frameIndex * 96, // frame actuel du sprite
				37, // position de la pièce verticalement (0 initialement)
				96, // taille d'une frame (1000/9)
				that.height,
				x, // fait bouger le sprite animé dans le canvas horizontalement
				y, // fait bouger le sprite animé dans le canvas verticalement
				96, // taille d'une frame
				that.height);

			that.context.clearRect(0, 0, that.width, that.height-96);
			context.fillRect(0, 0, canvas.width, canvas.height-146);
		};

		that.renderInverse = function(){
			that.context.clearRect(0, 0, that.width, that.height);
			context.fillStyle = "rgb(146, 210, 237)";
			context.fillRect(0, 0, canvas.width, canvas.height-50);
			that.context.drawImage( 
				that.image,
				frameIndex * 96, // frame actuel du sprite
				-59, // position de la pièce verticalement (0 initialement)
				96, // taille d'une frame (1000/9)
				that.height,
				x, // fait bouger le sprite animé dans le canvas horizontalement
				y, // fait bouger le sprite animé dans le canvas verticalement
				96, // taille d'une frame
				that.height);

			that.context.clearRect(0, 0, that.width, that.height-96);
			context.fillRect(0, 0, canvas.width, canvas.height-146);
		};

		that.renderStatique = function(){
			that.context.clearRect(0, 0, that.width, that.height);
			context.fillStyle = "rgb(146, 210, 237)";
			context.fillRect(0, 0, canvas.width, canvas.height-50);
			that.context.drawImage( 
				that.image,
				frameIndex * 0, // frame actuel du sprite
				-156, // position de la pièce verticalement (0 initialement)
				96, // taille d'une frame (1000/9)
				that.height,
				x, // fait bouger le sprite animé dans le canvas horizontalement
				y, // fait bouger le sprite animé dans le canvas verticalement
				96, // taille d'une frame
				that.height);

			that.context.clearRect(0, 0, that.width, that.height-96);
			context.fillRect(0, 0, canvas.width, canvas.height-146);
		};

		that.speed = function(){
			if(left){
				x_speed--;
			}
			if(right){
				x_speed++;
			}

			x = x + x_speed;
			x_speed = x_speed * 0.70;
		};

		that.sauter = function(){
			if(up){
				console.log("saut.");
			}
		}

		that.update = function(){
			tickCount += 1;
			if(tickCount > ticksPerFrame){
				tickCount = 0;
				if(frameIndex < nombreDeFrames - 1){
					frameIndex += 1;
				} else {
					frameIndex = 0;
				}
			}
		};

		that.updateInverse = function(){
			tickCount += 1;
			if(tickCount > ticksPerFrame){
				tickCount = 0;
				// vérification que la frame actuelle du sprite soit entre 0 et 9
				if(frameIndex <= nombreDeFrames - 1 & frameIndex > 0){
					frameIndex -= 1; // les frames sont inversées
				} else {
					frameIndex = 3; // on repart de 9 au lieu de 0
				}
			}
		};

		return that;
	}

	$(window).keydown(function(event){
		var keypress;
		if(event == null){
			keypress = window.event.keyCode;
		} else {
			keypress = event.keyCode;
		}
		switch(keypress){
			case 32: 
				up = true; 
				break;
			case 81: 
				left = true; 
				break;
			case 68: 
				right = true; 
				break;
		}
	});

	$(window).keyup(function(event){
		var keypress;
		if(event == null){
			keypress = window.event.keyCode;
		} else {
			keypress = event.keyCode;
		}
		switch(keypress){
			case 32: 
				up = false; 
				break;
			case 81: 
				left = false; 
				break;
			case 68: 
				right = false; 
				break;
		}
	});
});