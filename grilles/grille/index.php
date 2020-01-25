<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Grille</title>
    <link rel="stylesheet" type="text/css" href="style.css">   
</head>
<body>
    <div class="container">
        <?php 
            for($i = 0; $i < 10; $i++){ 
                echo '<div class="row">';

                for($j = 0; $j < 10; $j++){
                    echo '<span id="'. $i . $j .'"></span>';
                }

                echo '</div>';
            } 
        ?>
    </div>

    <script src="https://code.jquery.com/jquery-3.4.1.min.js"
    integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo="
    crossorigin="anonymous"></script>
    <script src="script.js"></script>
</body>
</html>
