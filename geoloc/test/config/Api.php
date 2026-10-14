<?php

return [
    'geo_api' => [
        'url' => $_ENV['GEO_API_URL'] ?? 'https://geo.api.gouv.fr',
    ],

    'panoramax' => [
        'url' => $_ENV['PANORAMAX_API_URL'] ?? 'https://api.panoramax.xyz',
    ],
];