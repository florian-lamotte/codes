<?php
declare(strict_types=1);

$titre = 'Todolist';
$categories = [
	[
		'titre' => 'films', 
		'couleur' => 'blue'
	], 
	[
		'titre' => 'projets', 
		'couleur' => 'green'
	]
];

usort($categories, fn($a, $b) => strcmp($a['titre'], $b['titre']));

require 'routeur.php';
require 'base.php';
?>