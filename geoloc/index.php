<?php

function getPanoramaxBbox(string $nomCommune): ?string
{
    $url = 'https://geo.api.gouv.fr/communes?' . http_build_query([
        'nom' => $nomCommune,
        'boost' => 'population',
        'limit' => 1,
        'fields' => 'bbox',
        'format' => 'geojson',
        'geometry' => 'bbox'
    ]);

    $json = file_get_contents($url);

    if ($json === false) {
        return null;
    }

    $data = json_decode($json, true);

    if (empty($data['features'])) {
        return null;
    }

    $coords = $data['features'][0]['geometry']['coordinates'][0];

    $minLon = $coords[0][0];
    $minLat = $coords[0][1];
    $maxLon = $coords[2][0];
    $maxLat = $coords[2][1];

    return "$minLon,$minLat,$maxLon,$maxLat";
}

$bbox = getPanoramaxBbox('Lyon');

echo "https://api.panoramax.xyz/api/search?bbox=".$bbox;