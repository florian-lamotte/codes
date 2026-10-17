<?php
declare(strict_types=1);

class Liste {
    private string $jsonFile;

    public function __construct(string $titre)
    {
        $filename = strtolower($titre);

        $this->jsonFile = 'donnees/' . $filename . '.json';

        if (!file_exists($this->jsonFile)) {
            file_put_contents($this->jsonFile, json_encode([]));
        }
    }

    public function liste(): array
    {
        $content = file_get_contents($this->jsonFile);

        if ($content === false || empty($content)) {
            return [];
        }

        return json_decode($content, false) ?? [];
    }

    public function ajouter(array $feuille): bool
    {
        $feuilles = $this->liste();

        $feuille['id'] = $this->genererId($feuilles);

        $feuilles[] = $feuille;

        return $this->sauvegarder($feuilles);
    }

    public function supprimer(int $id): bool
    {
        $feuilles = $this->liste();

        $feuilles = array_filter(
            $feuilles,
            fn($feuille) => $feuille->id !== $id
        );

        return $this->sauvegarder(array_values($feuilles));
    }

    private function sauvegarder(array $data): bool
    {
        return file_put_contents(
            $this->jsonFile,
            json_encode(
                $data,
                JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
            ),
            LOCK_EX
        ) !== false;
    }

    private function genererId(array $feuilles): int
    {
        if (empty($feuilles)) {
            return 1;
        }

        $ids = array_map(
            fn($feuille) => $feuille->id,
            $feuilles
        );

        return max($ids) + 1;
    }

    public static function cmp(object $a, object $b): int
    {
        return $b->id <=> $a->id;
    }

    public function bbcode(string $texte): string
    {
        $texte = htmlspecialchars($texte, ENT_QUOTES, 'UTF-8');

        $replacements = [
            '#\[gras\](.*?)\[/gras\]#is' => '<strong>$1</strong>',
            '#\[italique\](.*?)\[/italique\]#is' => '<em>$1</em>',
            '#\[lien\](https?://.*?)\[/lien\]#is' => '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>',
            '#\[image\](.*?)\[/image\]#is' => '<img src="images/$1" alt="">',
            '#(https?://[^\s]+)#' => '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
        ];

        foreach ($replacements as $pattern => $replace) {
            $texte = preg_replace($pattern, $replace, $texte);
        }

        return $texte;
    }
}
?>