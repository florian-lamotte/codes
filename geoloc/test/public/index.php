<?php

require_once __DIR__ . '/../router.php';
require_once __DIR__ . '/../services/GeoApiService.php';
require_once __DIR__ . '/../services/PanoramaxService.php';
require_once __DIR__ . '/../controllers/PanoramaxController.php';

$router = new Router();

$router->get('/panoramax', [PanoramaxController::class, 'index']);
$router->get('/panoramax/search', [PanoramaxController::class, 'search']);

$router->dispatch(
    $_SERVER['REQUEST_URI'],
    $_SERVER['REQUEST_METHOD']
);