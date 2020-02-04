<?php
function affichage($array, $i = 0){
	if(isset($array[$i])){
		echo $array[$i];
		affichage($array, $i + 1);
	}
}

function inversion($array, $i = 0){
	if(isset($array[$i])){
		inversion($array, $i + 1);
		echo $array[$i];
	}
}

function ajout($i){
	return $i + 1;
}

function map($array, $fonction, $i = 0){
	if(isset($array[$i])){		
		echo $fonction($array[$i]);
		map($array, 'ajout', $i + 1);
	}
}

function recherche($array, $recherche, $i = 0){
	if(!isset($array[$i])){
		echo $recherche . ' est introuvable !';
	} else {
		if($recherche != $array[$i]){
			recherche($array, $recherche, $i + 1);
		} else {
			echo $recherche . ' a été trouvé !';
		}
	}
}

$array = [1,2,3];

echo 'Tableau: ';
affichage($array);
echo '<br>';

echo 'Inversion: ';
inversion($array);
echo '<br>';

echo 'Valeurs + 1: ';
map($array, 'ajout');
echo '<br>';

echo 'Recherche fructueuse: ';
recherche($array, 3);
echo '<br>';

echo 'Recherche infructueuse: ';
recherche($array, 4);
echo '<br>';