<?php

class PanoramaxService
{
    private string $url;
    private GeoApiService $geoApi;

    public function __construct()
    {
        $api = require __DIR__ . '/../config/Api.php';

        $this->url = rtrim($api['panoramax']['url'], '/');
        $this->geoApi = new GeoApiService();
    }

    public function searchByCommune(string $commune): ?array
    {
        $bbox = $this->geoApi->getCommuneBbox($commune);

        if ($bbox === null) {
            return null;
        }

        $url = $this->url . '/api/search?' . http_build_query([
            'bbox' => $bbox,
        ]);

        $json = file_get_contents($url);

        if ($json === false) {
            return null;
        }

        $data = json_decode($json, true);

        if ($data === null) {
            return null;
        }

        return [
            'bbox' => $bbox,
            'results' => $data,
        ];
    }
}