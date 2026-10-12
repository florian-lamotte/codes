$(function(){
	jQuery.fn.arretDrt = function() {
		$(this).oneTime(400,function() {
			$(this).css({backgroundPosition:'left -33px'});
		}).oneTime(200,function() {
			$(this).css({backgroundPosition:'-122px -32px'});
		});
	};
	jQuery.fn.mouvArretDrt = function(){
		$(this).arretDrt();
		$(this).everyTime(1000,function(){
			$(this).arretDrt();
		});
	}	
	jQuery.fn.marcheDrt = function() {
		$(this).oneTime(150,function() {
			$(this).css({backgroundPosition:'left -144px'}).stop().animate({left: "+=10"}, 1);
		}).oneTime(300,function() {
			$(this).css({backgroundPosition:'-122px -150px'}).stop().animate({left: "+=10"}, 1);
		}).oneTime(450,function() {
			$(this).css({backgroundPosition:'-250px -152px'}).stop().animate({left: "+=10"}, 1);
		});
	};
	jQuery.fn.mouvMarcheDrt = function(){
		$(this).marcheDrt();
		$(this).everyTime(400,function(){
			$(this).marcheDrt();
		});
	}	
	jQuery.fn.arretGch = function() {
		$(this).oneTime(400,function() {
			$(this).css({backgroundPosition:'left -33px'});
		}).oneTime(200,function() {
			$(this).css({backgroundPosition:'-122px -32px'});
		});
	};
	jQuery.fn.mouvArretGch = function(){
		$(this).arretGch();
		$(this).everyTime(1000,function(){
			$(this).arretGch();
		});
	}
	jQuery.fn.marcheGch = function() {
		$(this).oneTime(150,function() {
			$(this).css({backgroundPosition:'left -144px'}).stop().animate({left: "-=10"}, 1);
		}).oneTime(300,function() {
			$(this).css({backgroundPosition:'-122px -150px'}).stop().animate({left: "-=10"}, 1);
		}).oneTime(400,function() {
			$(this).css({backgroundPosition:'-250px -152px'}).stop().animate({left: "-=10"}, 1);
		});
	};
	jQuery.fn.mouvMarcheGch = function(){
		$(this).marcheGch();
		$(this).everyTime(400,function(){
			$(this).marcheGch();
		});
	}
	$("#personnage").mouvArretDrt();

	var arret = 0;

	$(window).keydown(function(event) {
		if (event.keyCode == '68') {
			if (arret == 0) {
				arret = 1;
				$("#personnage").stopTime().removeClass('gch').mouvMarcheDrt();
			}
		}
		if (event.keyCode == '81') {
			if (arret == 0) {
				arret = 1;
				$("#personnage").stopTime().addClass('gch').mouvMarcheGch();
			}
		}
		if (event.keyCode == '32') {
			
		}
	});
	$(window).keyup(function(event) {
		if (arret == 1) {
			arret = 0;
			$("#personnage").stopTime().mouvArretDrt();
			$(".gch").stopTime().mouvArretGch();
		}
	});
});