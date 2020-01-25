<?php
	if(isset($_POST['creer']) && isset($_POST['nom_projet'])){
		$projet = htmlspecialchars($_POST['nom_projet']);
		$nom_bdd = htmlspecialchars($_POST['nom_bdd']);
		$utilisateur_bdd = htmlspecialchars($_POST['utilisateur_bdd']);
		$mdp_bdd = htmlspecialchars($_POST['mdp_bdd']);
		if(empty($utilisateur_bdd)){ $utilisateur_bdd = 'root'; }

		if(isset($_POST['type_projet']) && $_POST['type_projet'] == 'Simple'){
			if(!file_exists('../' . $projet)){ mkdir('../' . $projet); }
			if(!file_exists('../' . $projet . '/css')){ mkdir('../' . $projet . '/css'); }
			if(!file_exists('../' . $projet . '/js')){ mkdir('../' . $projet . '/js'); }
			if(!file_exists('../' . $projet . '/fonts')){ mkdir('../' . $projet . '/fonts'); }
			if(!file_exists('../' . $projet . '/images')){ mkdir('../' . $projet . '/images'); }
			if(!file_exists('../' . $projet . '/classes')){ mkdir('../' . $projet . '/classes'); }

			if(!file_exists('../' . $projet . '/index.php')){ 
				$fichier = fopen('../' . $projet . '/index.php', 'a+');
				$contenu = "<!DOCTYPE html>\n<html>\n<head>\n\t<meta charset=\"utf-8\">\n\t<title></title>\n\t<link href=\"css/style.css\" rel=\"stylesheet\">\n</head>\n<body>\n\t<script src=\"js/jquery.js\"></script>\n\t<script src=\"js/script.js\"></script>\n</body>\n</html>";
				fwrite($fichier, $contenu);
				fclose($fichier);
			}

			if(!file_exists('../' . $projet . '/css/style.css')){
				$fichier = fopen('../' . $projet . '/css/style.css', 'a+');
				fclose($fichier);
			}

			if(!file_exists('../' . $projet . '/js/script.js')){
				$fichier = fopen('../' . $projet . '/js/script.js', 'a+');
				fclose($fichier);
			}

			if(isset($_POST['type_bdd']) && isset($_POST['type_bdd']) == 'MySQL'){
				if(!file_exists('../' . $projet . '/classes/ConnectDb.php')){
					$fichier = fopen('../' . $projet . '/classes/ConnectDb.php', 'a+');
					$contenu = "<?php\nclass ConnectDb\n{\n\tprotected function ConnectDb(){\n\t\t" . '$db' . " = new PDO('mysql:host=localhost;dbname=" . $nom_bdd . ";charset=utf8', '" . $utilisateur_bdd . "', '" . $mdp_bdd . "');\n\t\treturn " . '$db' . ";\n\t}\n}";
					fwrite($fichier, $contenu);
					fclose($fichier);
				}

				if(!file_exists('../' . $projet . '/classes/' . ucfirst($projet) . '.php')){
					$fichier = fopen('../' . $projet . '/classes/' . ucfirst($projet) . '.php', 'a+');
					$contenu = "<?php\nrequire_once('ConnectDb.php');\n\nclass " . ucfirst($projet) . " extends ConnectDb \n{\n\tfunction __construct(){\n\t}\n}";
					fwrite($fichier, $contenu);
					fclose($fichier);
				}
			} else {
				if(!file_exists('../' . $projet . '/classes/' . ucfirst($projet) . '.php')){
					$fichier = fopen('../' . $projet . '/classes/' . ucfirst($projet) . '.php', 'a+');
					$contenu = "<?php\nclass " . ucfirst($projet) . " \n{\n\tfunction __construct(){\n\t}\n}";
					fwrite($fichier, $contenu);
					fclose($fichier);
				}
			}
		} else if(isset($_POST['type_projet']) && $_POST['type_projet'] == 'MVC'){
			if(!file_exists('../' . $projet)){ mkdir('../' . $projet); }
			if(!file_exists('../' . $projet . '/public')){ mkdir('../' . $projet . '/public'); }
			if(!file_exists('../' . $projet . '/public/css')){ mkdir('../' . $projet . '/public/css'); }
			if(!file_exists('../' . $projet . '/public/js')){ mkdir('../' . $projet . '/public/js'); }
			if(!file_exists('../' . $projet . '/public/fonts')){ mkdir('../' . $projet . '/public/fonts'); }
			if(!file_exists('../' . $projet . '/public/images')){ mkdir('../' . $projet . '/public/images'); }
			if(!file_exists('../' . $projet . '/vendor')){ mkdir('../' . $projet . '/vendor'); }
			if(!file_exists('../' . $projet . '/classes')){ mkdir('../' . $projet . '/classes'); }
			if(!file_exists('../' . $projet . '/controllers')){ mkdir('../' . $projet . '/controllers'); }
			if(!file_exists('../' . $projet . '/models')){ mkdir('../' . $projet . '/models'); }
			if(!file_exists('../' . $projet . '/views')){ mkdir('../' . $projet . '/views'); }

			if(!file_exists('../' . $projet . '/index.php')){ 
				$fichier = fopen('../' . $projet . '/index.php', 'a+');
				$contenu = "<!DOCTYPE html>\n<html>\n<head>\n\t<meta charset=\"utf-8\">\n\t<title></title>\n\t<link href=\"css/style.css\" rel=\"stylesheet\">\n</head>\n<body>\n\t<script src=\"js/jquery.js\"></script>\n\t<script src=\"js/script.js\"></script>\n</body>\n</html>";
				fwrite($fichier, $contenu);
				fclose($fichier);
			}

			if(!file_exists('../' . $projet . '/public/css/style.css')){
				$fichier = fopen('../' . $projet . '/public/css/style.css', 'a+');
				fclose($fichier);
			}

			if(!file_exists('../' . $projet . '/public/js/script.js')){
				$fichier = fopen('../' . $projet . '/public/js/script.js', 'a+');
				fclose($fichier);
			}

			if(!file_exists('../' . $projet . '/controllers/controller.php')){
				$fichier = fopen('../' . $projet . '/controllers/controller.php', 'a+');
				fclose($fichier);
			}

			if(!file_exists('../' . $projet . '/models/model.php')){
				$fichier = fopen('../' . $projet . '/models/model.php', 'a+');
				fclose($fichier);
			}

			if(!file_exists('../' . $projet . '/views/template.php')){
				$fichier = fopen('../' . $projet . '/views/template.php', 'a+');
				fclose($fichier);
			}

			if(!file_exists('../' . $projet . '/classes/ConnectDb.php')){
				$fichier = fopen('../' . $projet . '/classes/ConnectDb.php', 'a+');
				$contenu = "<?php \nclass ConnectDb \n{ \n\tprotected function ConnectDb(){\n\t\t" . '$db' . " = new PDO('mysql:host=localhost;dbname=test;charset=utf8', 'root', ''); \n\t\treturn " . '$db' . ";\n\t}\n}";
				fwrite($fichier, $contenu);
				fclose($fichier);
			}
		}
	}
?>

<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>Générateur de projets</title>
	<link rel="stylesheet" type="text/css" href="style.css">
</head>
<body>
	<form method="post" action="">
		<p>
			<input type="text" name="nom_projet" placeholder="Nom du projet">
		</p>
		<p>
			<input type="radio" name="type_bdd" id="choix_bdd_sql" value="MySQL">
			<label for="choix_bdd_sql">MySQL</label>
			<input type="radio" name="type_bdd" id="choix_bdd_json" value="JSON">
			<label for="choix_bdd_json">JSON</label>
			<input type="radio" name="type_bdd" id="choix_bdd_aucune" value="Aucune">
			<label for="choix_bdd_aucune">Aucune</label>
		</p>
		<p id="donnees_bdd">
			<input type="text" name="nom_bdd" id="nom_bdd" placeholder="Nom de la base">
			<input type="text" name="utilisateur_bdd" placeholder="Utilisateur">
			<input type="text" name="mdp_bdd" placeholder="Mot de passe">
		</p>
		<p>
			<input type="radio" name="type_projet" id="projet_simple" value="Simple">
			<label for="projet_simple">Simple</label>
			<input type="radio" name="type_projet" id="projet_mvc" value="MVC">
			<label for="projet_mvc">MVC</label>
		</p>
		<p>
			<input type="submit" name="creer" value="Créer">
		</p>
	</form>

	<script src="jquery.js"></script>
	<script src="script.js"></script>
</body>
</html>