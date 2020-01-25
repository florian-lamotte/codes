<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Grille d'échecs</title>
    <link rel="stylesheet" type="text/css" href="style.css">
</head>
<body>
    <table>
        <?php 
        for($i = 0; $i < 10; $i++){
            echo '<tr>';
            
            for($j = 0; $j < 10; $j++){ 
                if($i%2 == 0 && $j%2 == 0){
                    $couleur = "black";
                } else if($i%2 != 0 && $j%2 != 0){
                    $couleur = "black";
                } else {
                    $couleur = "white";
                }
                
                echo '<td id="'. $i . $j . '"></td>';
            }

            echo '</tr>';
        } ?>
    </table>

    <script src="https://code.jquery.com/jquery-3.4.1.min.js"
    integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo="
    crossorigin="anonymous"></script>
    <script src="script.js"></script>
</body>
</html>
