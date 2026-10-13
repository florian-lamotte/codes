<?php
class GenerateurHtml
{
    /**
     * Assemble les éléments dans une page HTML complète.
     */
    public function html(array $balises): void
    {
        echo '<!DOCTYPE html>';
        echo '<html lang="fr">';
        echo '<head>';
        echo '<meta charset="UTF-8">';
        echo '<meta name="viewport" content="width=device-width, initial-scale=1.0">';
        echo '<title>Mon formulaire</title>';
        echo '</head>';
        echo '<body>';

        foreach ($balises as $balise) {
            echo $balise;
            echo "\n";
        }

        echo '</body>';
        echo '</html>';
    }

    /**
     * Transforme un tableau associatif en attributs HTML.
     */
    private function genererAttributs(array $attributs): string
    {
        $html = '';

        foreach ($attributs as $nom => $valeur) {
            // Évite les noms d'attributs invalides.
            if (!preg_match('/^[a-zA-Z_:][a-zA-Z0-9_.:-]*$/', $nom)) {
                continue;
            }

            // Les valeurs false et null signifient que
            // l'attribut ne doit pas être ajouté.
            if ($valeur === false || $valeur === null) {
                continue;
            }

            // Attributs booléens HTML.
            if (in_array($nom, [
                'disabled',
                'required',
                'checked',
                'readonly',
                'multiple',
                'autofocus'
            ], true)) {
                if ($valeur === true) {
                    $html .= ' ' . $nom;
                }

                continue;
            }

            $html .= ' ' . $nom . '="'
                . htmlspecialchars((string) $valeur, ENT_QUOTES, 'UTF-8')
                . '"';
        }

        return $html;
    }

    /**
     * Génère une balise HTML avec une ouverture et une fermeture.
     */
    public function balise(
        string $nom,
        string $contenu = '',
        array $attributs = []
    ): string {
        // Vérifie le nom de la balise.
        if (!preg_match('/^[a-z][a-z0-9-]*$/i', $nom)) {
            throw new InvalidArgumentException(
                'Nom de balise HTML invalide.'
            );
        }

        return '<' . $nom
            . $this->genererAttributs($attributs)
            . '>'
            . $contenu
            . '</' . $nom . '>';
    }

    /**
     * Crée un champ input.
     */
    public function input(
        string $type = 'text',
        array $attributs = []
    ): string {
        $attributs['type'] = $type;

        return '<input' . $this->genererAttributs($attributs) . '>';
    }

    /**
     * Crée un bouton radio.
     */
    public function radio(
        array $attributs = []
    ): string {
        $attributs['type'] = 'radio';

        return '<input'
            . $this->genererAttributs($attributs)
            . '>';
    }

    /**
     * Crée une case à cocher.
     */
    public function checkbox(
        array $attributs = []
    ): string {
        $attributs['type'] = 'checkbox';

        return '<input'
            . $this->genererAttributs($attributs)
            . '>';
    }

    /**
     * Crée une balise div.
     */
    public function div(
        string $contenu = '',
        array $attributs = []
    ): string {
        return $this->balise('div', $contenu, $attributs);
    }

    public function section(
        string $contenu = '',
        array $attributs = []
    ): string {
        return $this->balise('section', $contenu, $attributs);
    }

    public function article(
        string $contenu = '',
        array $attributs = []
    ): string {
        return $this->balise('article', $contenu, $attributs);
    }

    /**
     * Crée un bouton.
     */
    public function button(
        string $texte = 'Bouton',
        array $attributs = []
    ): string {
        $attributs['type'] = $attributs['type'] ?? 'button';

        return '<button'
            . $this->genererAttributs($attributs)
            . '>'
            . htmlspecialchars($texte, ENT_QUOTES, 'UTF-8')
            . '</button>';
    }

    /**
     * Crée un bouton d'envoi de formulaire.
     */
    public function submit(
        string $texte = 'Envoyer',
        array $attributs = []
    ): string {
        $attributs['type'] = 'submit';

        return '<button'
            . $this->genererAttributs($attributs)
            . '>'
            . htmlspecialchars($texte, ENT_QUOTES, 'UTF-8')
            . '</button>';
    }

    /**
     * Crée un lien HTML.
     */
    public function link(
        string $texte,
        string $url,
        array $attributs = []
    ): string {
        $attributs['href'] = $url;

        return '<a'
            . $this->genererAttributs($attributs)
            . '>'
            . htmlspecialchars($texte, ENT_QUOTES, 'UTF-8')
            . '</a>';
    }

    /**
     * Crée une zone de texte multiligne.
     */
    public function textarea(
        string $contenu = '',
        array $attributs = []
    ): string {
        return '<textarea'
            . $this->genererAttributs($attributs)
            . '>'
            . htmlspecialchars($contenu, ENT_QUOTES, 'UTF-8')
            . '</textarea>';
    }

    /**
     * Crée un message HTML.
     */
    public function message(
        string $texte,
        string $balise = 'p',
        array $attributs = []
    ): string {
        $balisesAutorisees = ['p', 'span', 'label', 'h1', 'h2', 'h3'];

        if (!in_array($balise, $balisesAutorisees, true)) {
            throw new InvalidArgumentException(
                'Balise de message non autorisée.'
            );
        }

        return $this->balise(
            $balise,
            htmlspecialchars($texte, ENT_QUOTES, 'UTF-8'),
            $attributs
        );
    }

    /**
	 * Crée un formulaire HTML.
	 */
	public function form(
	    array $elements,
	    array $attributs = []
	): string {
	    // Valeurs par défaut
	    $attributs['method'] = $attributs['method'] ?? 'POST';

	    // Sécurise et vérifie la méthode HTTP
	    $method = strtoupper((string) $attributs['method']);

	    if (!in_array($method, ['GET', 'POST'], true)) {
	        throw new InvalidArgumentException(
	            'La méthode doit être GET ou POST.'
	        );
	    }

	    $attributs['method'] = $method;

	    // Génère les attributs grâce à la méthode commune
	    $html = '<form' . $this->genererAttributs($attributs) . '>';

	    // Ajoute les éléments du formulaire
	    foreach ($elements as $element) {
	        $html .= "\n" . $element;
	    }

	    $html .= "\n</form>";

	    return $html;
	}
}
?>