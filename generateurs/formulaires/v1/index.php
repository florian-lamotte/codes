<?php
	require 'autoload.php';

	$form = new Formulaire();
	
	$form->html([
		$form->input('{class:lo, id:yo}'),
		$form->button('{class:lo, id:yo, value:yolo}')
	]);
?>