<?php
	class Rectangles{
		public $hauteur;
		public $largeur;
		public $couleur;

		public function __construct($hauteur, $largeur, $couleur){
			$this->setHauteur($hauteur);
			$this->setLargeur($largeur);
			$this->setCouleur($couleur);			
		}

		public function generate(){
			echo "<p><div style='height:".$this->hauteur.";
			width:".$this->largeur.";
			background-color:".$this->couleur."'>
			</div></p>";
		}

		public function setHauteur($hauteur){ $this->hauteur = $hauteur; }
		public function setLargeur($largeur){ $this->largeur = $largeur; }
		public function setCouleur($couleur){ $this->couleur = $couleur; }
	}
?>