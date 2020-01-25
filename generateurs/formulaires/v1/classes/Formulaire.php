<?php
class Formulaire {
	private $objet;
	private $id;
	private $class;
	private $name;
	private $value;
	private $type;
	private $disabled;

	public function __construct(){}

	public function html($balises){
		$structure = '<!DOCTYPE html><html><head><title></title>';
		$structure .= '</head><body>';
		
		foreach($balises as $balise){
			$structure .= $balise;
		}

		$structure .= '</body></html>';

		echo $structure;
	}

	public function input($objet){
		$this->objet = $objet;
		$this->transformationJSON();
		$this->assignationValeurs();

		$champ = '<input id="' . $this->id . '" class="' . $this->class . '" name="' . $this->name . '" value="' . $this->value . '" type="' . $this->type . '"' . $this->disabled . '>';

		return $champ;
	}

	public function button($objet){
		$this->objet = $objet;
		$this->transformationJSON();
		$this->assignationValeurs();

		$champ = '<button id="' . $this->id . '" class="' . $this->class . '" name="' . $this->name . '" type="' . $this->type . '" ' . $this->disabled . '>' . $this->value . '</button>';

		return $champ;
	}

	public function transformationJSON(){
		$caracteres = ['#\s#', '#{#', '#}#', '#:#', '#,#'];
		$cotes = ['', '{"', '"}', '":"', '","'];
		$this->objet = preg_replace($caracteres, $cotes, $this->objet);	
	}

	public function assignationValeurs(){
		$objet = json_decode($this->objet);

		$this->id = isset($objet->id) ? $objet->id : null;
		$this->class = isset($objet->class) ? $objet->class : null;
		$this->name = isset($objet->name) ? $objet->name : null;
		$this->value = isset($objet->value) ? $objet->value : null;
		$this->type = isset($objet->type) ? $objet->type : null;

		if(isset($objet->disabled) && $objet->disabled == 'true'){
			$this->disabled = 'disabled';
		} else {
			$this->disabled = '';
		}
	}
}
?>