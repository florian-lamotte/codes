<?php

class GeoApiService
{
    private string $url;

    public function __construct()
    {
        $api = require __DIR__ . '/../config/Api.php';

        $this->url = rtrim($api['geo_api']['url'], '/');
    }

    public function getCommuneBbox(string $nomCommune): ?string
    {
        $url = $this->url . '/communes?' . http_build_query([
            'nom' => $nomCommune,
            'boost' => 'population',
            'limit' => 1,
            'fields' => 'bbox',
            'format' => 'geojson',
            'geometry' => 'bbox',
        ]);

        $json = file_get_contents($url);

        if ($json === false) {
            return null;
        }

        $data = json_decode($json, true);

        if (
            !isset($data['features'][0]['geometry']['coordinates'][0])
        ) {
            return null;
        }

        $coords = $data['features'][0]['geometry']['coordinates'][0];

        if (count($coords) < 4) {
            return null;
        }

        $minLon = $coords[0][0];
        $minLat = $coords[0][1];

        $maxLon = $coords[2][0];
        $maxLat = $coords[2][1];

        return "$minLon,$minLat,$maxLon,$maxLat";
    }
}