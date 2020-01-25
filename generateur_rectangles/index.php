<!DOCTYPE html>
<html>
<head>
	<title>Générateur de rectangles</title>
	<meta charset="utf-8">
</head>
<body>
	<form action="generate.php" method="post">
		<p>Nombre de rectangles</p>
		<input type="text" name="nombre"><br>
		<p>Hauteur</p>
		<input type="text" name="hauteur"><br>
		<p>Largeur</p>
		<input type="text" name="largeur"><br>
		<p>Couleur</p>
		<select name="couleur">
			<option value="green">Vert</option>
			<option value="blue">Bleu</option>
			<option value="red">Rouge</option>
		</select>
		<p><input type="checkbox" name="aleatoire" value="aleatoire">Aléatoire</p>
		<p><input type="submit"></p>
	</form>
</body>
</html>