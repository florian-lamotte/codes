$(function(){
	var	canvas = $("#canvas")[0];
	canvas.width = 1000;
	canvas.height = 100;

	var coinImage = new Image();
	coinImage.src = 'coin.png';

	var left = false;
	var right = false;
	var x_speed = 0;
	var x = 0;
	var y = 0;

	var coin = sprite({
		context: canvas.getContext('2d'),
		width: 1000,
		height: 100,
		image: coinImage,
		numberOfFrames: 10,
		ticksPerFrame: 1 // vitesse d'animation du personnage
		// ne pas confondre avec la vitesse de course du personnage (x_speed)
	});
	
	coinImage.addEventListener("load", gameLoop);	

	function gameLoop(){
		requestAnimationFrame(gameLoop);
		if(left){ // tourne vers la gauche
			coin.updateInverse();
			coin.render();
		} else if (right){ // tourne vers la droite
			coin.update();
			coin.render();
		} else { // doit rester à sa position d'arrêt
			//coin.update();
			coin.render();
		}
	}	

	function sprite(options){
		var that = {}, 
			frameIndex = 0,
			tickCount = 0,
			ticksPerFrame = options.ticksPerFrame || 0,
			numberOfFrames = options.numberOfFrames || 1;
		that.context = options.context;
		that.width = options.width;
		that.height = options.height;
		that.image = options.image;

		that.render = function(){
			that.context.clearRect(0, 0, that.width, that.height);
			that.context.drawImage(
				that.image, // le sprite complet
				frameIndex * that.width / numberOfFrames, // frame actuel du sprite
				0,
				that.width / numberOfFrames, // taille d'une frame (1000/9)
				that.height,
				x, // fait bouger le sprite animé dans le canvas horizontalement
				y, // fait bouger le sprite animé dans le canvas verticalement
				that.width / numberOfFrames, // taille d'une frame
				that.height);

			if(left){
				x_speed--;
			}
			if(right){
				x_speed++;
			}

			x = x + x_speed;
			x_speed = x_speed * 0.89;
		};

		that.update = function(){
			tickCount += 1;
			if(tickCount > ticksPerFrame){
				tickCount = 0;
				if(frameIndex < numberOfFrames - 1){
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
				if(frameIndex <= numberOfFrames - 1 & frameIndex > 0){
					frameIndex -= 1; // les frames sont inversées
				} else {
					frameIndex = 9; // on repart de 9 au lieu de 0
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
			case 37: left = true; break;
			case 39: right = true; break;
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
			case 37: left = false; break;
			case 39: right = false; break;
		}
	});
});