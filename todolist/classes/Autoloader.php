<?php
class Autoloader {
	static function register(){
		spl_autoload_register(array(__CLASS__, 'autoload'));
	}

	static function autoload($classe){
	    require 'classes/' . $classe . '.php';
	}
}