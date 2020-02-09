<?php
require 'classes/Autoloader.php';
Autoloader::register();

$liste = new Liste;

if(!empty($_POST['message'])){
    $liste->ajouter(
        array(
            'message' => $_POST['message'], 
            'categorie' => $_POST['categorie']
        )
    );
}

isset($_GET['sup']) ? $liste->supprimer($_GET['sup']) : null;
$feuilles = isset($_GET['categorie']) ? $liste->listeParCategorie($_GET['categorie']) : $liste->liste();
usort($feuilles, array("Liste", "cmp"));
asort($liste->categories); // tri par ordre alphabétique des catégories stockées dans la classe "Liste"
?>

<!DOCTYPE html>
<html>
<head>
    <title>Pense-bête</title>
    <meta charset="utf-8">
    <link rel="stylesheet" type="text/css" href="css/style.css">
</head>
<body>
    <div id="container">
        <form action="" method="post">
        	<p>
        		<input type="button" class="bbcode" value="Gras">
        		<input type="button" class="bbcode" value="Italique">
        		<input type="button" class="bbcode" value="Lien">
                <input type="file" class="image">
                <select name="categorie">
                    <option></option>
                    <?php foreach($liste->categories as $categorie){ ?>
                        <option value="<?= $categorie ?>"><?= ucfirst($categorie) ?></option>
                    <?php } ?>
                </select>
        	</p>
            <textarea name="message" id="message" placeholder="Message"></textarea>
            <input type="submit" value="Valider">
        </form>

        <ul>
        <?php foreach($liste->categories as $categorie){ ?>
            <li><a href="index.php?categorie=<?= $categorie ?>"><button><?= ucfirst($categorie) ?></button></a></li>
        <?php } ?>
        </ul>

        <div class="contenu">
        <?php foreach($feuilles as $feuille){
            echo '<div>
                <p>' . nl2br($liste->bbcode($feuille->message)) . '</p>
                <a href="index.php?sup=' . $feuille->id . '"><img src="delete-462216_960_720.png" alt="x" class="sup"></a>
            </div>';
        } ?>
        </div>
    </div>

    <script type="text/javascript" src="js/jquery.js"></script>
    <script type="text/javascript" src="js/script.js"></script>
</body>
</html>