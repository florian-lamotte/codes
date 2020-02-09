<?php
// source: http://www.devdesign.fr/utilisation-json-comme-base-de-donnees/

class Liste{
    private $json = "liste.json";
    private $texte = "liste.txt";
    private $id;
    private $data;
    private $feuilles;
    private $feuillesParCategorie = [];
    public $categories = [];

    public function __construct(){
        // les fichiers sont créés s'ils n'existent pas déjà
        if(!file_exists($this->json)){
            $this->creationFichiers();
        }
    }

    public function creationFichiers(){
        /* fopen ouvre puis ferme les fichiers en lecture/écriture 
        pour créer les fichiers json et texte */
        $fopen_json = @fopen($this->json, "a+"); // @ supprime l'alerte E_WARNING
        $fopen_texte = @fopen($this->texte, "a+"); // a+ ouvre et ferme le fichier

        if($fopen_json && $fopen_texte){
            fclose($fopen_json);
            fclose($fopen_texte);
        }
    }

    public function liste(){
        if(isset($this->feuilles)) return $this->feuilles;
        $contents = file_get_contents($this->json);
        // [chaine de caractères -1] supprime la dernière virgule pour avoir
        // un format [{"id":1,"titre":"t","contenu":"c"},{"id":2,"titre":"t","contenu":"c"}]
        $this->feuilles = json_decode("[" . substr($contents, 0, -1) . "]");
        return $this->feuilles;
    }

    public function listeParCategorie($categorie){
        foreach($this->liste() as $feuille){
            if(isset($feuille->categorie) && $feuille->categorie == $categorie){
                $this->feuillesParCategorie[] = $feuille;
            }
        }

        return $this->feuillesParCategorie;
    }

    public function id(){
        // créé un identifiant incrémental
        if($txt = @fopen($this->texte, "r+")){
            $this->id = fgets($txt); // récupère la ligne courante sur laquelle se trouve le pointeur du fichier
            $this->id = intval($this->id); // retourne la valeur numérique entière équivalente d'une variable
            $this->id++;
            fseek($txt, 0); // place le curseur au début du fichier
            fputs($txt, $this->id); // met le nouvel ID
            fclose($txt);
            return $this->id;
        } else {
            return null;
        }
    }

    public function ajouter($feuille){
        $this->data = $feuille;
        $this->id = $this->id(); // récupération de l'id

        if($this->id !== null){
            // insertion d'une liste dans le fichier liste.json
            $this->data = array('id' => $this->id) + $this->data;
            $file = @fopen($this->json, "a+");
            fputs($file, json_encode($this->data) . ',');
            fclose($file);
        }
    }

    public function supprimer($id){
        $this->id = $id;
        $this->feuilles = $this->liste();

        if($fopen_json = @fopen($this->json, "w+")){
            $this->data = "";
            foreach($this->feuilles as $cle => $valeur){
                if($valeur->id == $this->id){
                    unset($this->feuilles[$cle]);
                } else {
                    $this->data .= json_encode($valeur).',';
                }
            }
            fputs($fopen_json, $this->data);
            fclose($fopen_json);
            return true;
        }
    }

    public static function cmp($a, $b){
        if ($a == $b) {
            return 0;
        }
        return ($a > $b) ? -1 : 1;
    }

    public function bbcode($texte){
        $texte = preg_replace('#\[gras\](.+)\[/gras\]#isU', '<strong>$1</strong>', $texte);
        $texte = preg_replace('#\[italique\](.+)\[/italique\]#isU', '<em>$1</em>', $texte);
        $texte = preg_replace('#\[lien\](.+)\[/lien\]#isU', '<a href="$1" target="_blank">$1</a>', $texte);
        $texte = preg_replace('#\[image\](.+)\[/image\]#isU', '<img src="images/$1">', $texte);
        $texte = preg_replace('#(http://[^ ]+)#', '<a href="$1" target="_blank">$1</a>', $texte);
        $texte = preg_replace('#(https://[^ ]+)#', '<a href="$1" target="_blank">$1</a>', $texte);

        return $texte;
    }
}
?>