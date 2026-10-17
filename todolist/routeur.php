<?php
require 'classes/Autoloader.php';
Autoloader::register();

$liste = new Liste($titre);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	$message = trim($_POST['message'] ?? '');
    $categorie = trim($_POST['categorie'] ?? '');

    if ($message !== '') {
	    $liste->ajouter([
	        'message' => $message, 
	        'categorie' => $categorie
	    ]);
	}
}

if (isset($_GET['sup'])) {
	$id = (int) $_GET['sup'];

	$liste->supprimer($id);

	header('Location: index.php');
	exit;
}

$feuilles = $liste->liste();

usort($feuilles, array("Liste", "cmp"));
?>