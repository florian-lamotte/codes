<?php
	include("rectangles.php");

	$nombre = $_POST['nombre'];
	$hauteur = $_POST['hauteur'];
	$largeur = $_POST['largeur'];
	
	if(isset($_POST['aleatoire'])){
		$couleur = "#" . dechex(rand(0,255)) . dechex(rand(0,255)) . dechex(rand(0,255));
	} else {
		$couleur = $_POST['couleur'];
	}

	$rectangles = new Rectangles($hauteur, $largeur, $couleur);

	for($i = 1; $i <= $nombre; $i++){
		$rectangles->generate();
	}
?>