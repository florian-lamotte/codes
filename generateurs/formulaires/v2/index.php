<!DOCTYPE html>
<html>
<head>
	<title></title>
</head>
<body>
<?php
	require 'autoload.php';

	$form = new Formulaire();
	
	$form->class('i') . $form->id('i') . $form->input('text');
	$form->class('b') . $form->id('b') . $form->button('valider');
?>
</body>
</html>