<?php
	function chargerClasse($classe){ 
	    require 'classes/' . $classe . '.php'; 
	}
	spl_autoload_register('chargerClasse');
?>