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

function croissant($array, $i = 0){
	if(isset($array[$i])){
		for($j = 0; $j < count($array); $j++){
			if($array[$i] < $array[$j]){
				$temp = $array[$j];
				$array[$j] = $array[$i];
				$array[$i] = $temp;
			}
		}
		
		croissant($array, $i + 1);
	} else {
		for($t = 0; $t < count($array); $t++){
			echo $array[$t];
		}
	}
}

function decroissant($array, $i = 0){
	if(isset($array[$i])){
		for($j = 0; $j < count($array); $j++){
			if($array[$i] > $array[$j]){
				$temp = $array[$j];
				$array[$j] = $array[$i];
				$array[$i] = $temp;
			}
		}
		
		decroissant($array, $i + 1);
	} else {
		for($t = 0; $t < count($array); $t++){
			echo $array[$t];
		}
	}
}

function tri($array, $tri){
	if($tri == 'croissant'){
		croissant($array);
	} else if($tri == 'decroissant'){
		decroissant($array);
	}
}

$array = [1,2,3];
$array2 = [2,8,4,3,9,6,5,1,7];

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

echo 'Tri croissant: ';
tri($array2, 'croissant');
echo '<br>';

echo 'Tri décroissant: ';
tri($array2, 'decroissant');
echo '<br>';