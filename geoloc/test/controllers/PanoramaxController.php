<?php

class PanoramaxController
{
    private PanoramaxService $panoramaxService;

    public function __construct()
    {
        $this->panoramaxService = new PanoramaxService();
    }

    public function index(): void
    {
        require __DIR__ . '/../frontend/index.php';
    }

    public function search(): void
    {
        header('Content-Type: application/json; charset=utf-8');

        $territoire = trim($_GET['territoire'] ?? '');

        if ($territoire === '') {
            http_response_code(400);

            echo json_encode([
                'success' => false,
                'message' => 'Veuillez renseigner un territoire.'
            ]);

            return;
        }

        $results = $this->panoramaxService->searchByCommune($territoire);

        if ($results === null) {
            http_response_code(404);

            echo json_encode([
                'success' => false,
                'message' => 'Impossible de trouver ce territoire.'
            ]);

            return;
        }

        echo json_encode([
            'success' => true,
            'bbox' => $results['bbox'],
            'results' => $results['results'],
        ]);
    }
}