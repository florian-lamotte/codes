<?php

$nom = $_POST['nom'] ?? '';

echo htmlspecialchars($nom, ENT_QUOTES, 'UTF-8');