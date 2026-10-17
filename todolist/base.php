<!DOCTYPE html>
<html>
<head>
	<title><?= $titre ?></title>
	<link rel="stylesheet" type="text/css" href="styles/reset.css">
	<link rel="stylesheet" type="text/css" href="styles/style.css">
</head>
<body>
	<div class="controls">
		<button type="button" class="control" title="all" data-filter="all">All</button>
		
		<?php foreach ($categories as $categorie): ?>
			<button 
				type="button"
				class="control" 
				title="<?= htmlspecialchars($categorie['titre']) ?>"
				data-filter=".<?= htmlspecialchars($categorie['couleur']) ?>"
			>
				<?= ucfirst(htmlspecialchars($categorie['titre'])) ?>
			</button>
		<?php endforeach; ?>

		<button type="button" class="control" title="none" data-filter=".none">Autres</button>

		<form action="" method="post" class="ajout">
			<input type="button" class="bbcode" value="Image">
			
	        <textarea name="message" id="message" placeholder="Message"></textarea>

	       	<select name="categorie">
	            <option></option>

	            <?php foreach ($categories as $categorie): ?>
	                <option value="<?= htmlspecialchars($categorie['titre']) ?>">
	                	<?= ucfirst(htmlspecialchars($categorie['titre'])) ?>
	                </option>
	            <?php endforeach; ?>
	        </select>

	        <input type="submit" value="Valider">
	   	</form>
	</div>

	<div class="container">
		<?php $mapCategories = [];

		foreach ($categories as $categorie) {
		    $mapCategories[$categorie['titre']] = $categorie['couleur'];
		}

		foreach ($feuilles as $feuille):
		    $couleur = $mapCategories[$feuille->categorie] ?? 'none'; ?>

			<div class="mix <?= htmlspecialchars($couleur) ?>">
				<p><?= nl2br($liste->bbcode($feuille->message)) ?></p>
				<a href="index.php?sup=<?= (int) $feuille->id ?>" class="sup">
	    			<img src="images/delete-462216_960_720.png" alt="x">
	    		</a>
	    	</div>
		<?php endforeach; ?>
	</div>

	<script type="text/javascript" src="scripts/jquery.js"></script>
	<script type="text/javascript" src="scripts/mixitup.min.js"></script>
    <script type="text/javascript" src="scripts/script.js"></script>  
</body>
</html>