<?php
class Formulaire {
	private $class;
	private $id;

	public function __construct(){}

	public function input($type = null, $name = null, $value = null){
		$champ = '<input id="' . $this->id . '" 
		class="' . $this->class . '" 
		type="' . htmlspecialchars($type) . '" 
		name="' . htmlspecialchars($name) . '"
		value="' . htmlspecialchars($value) . '">';

		echo $champ;
	}

	public function button($value = null, $name = null, $disabled = false, $type = null){
		if(htmlspecialchars($disabled) === true || htmlspecialchars($disabled) === 'true'){
			$dis = 'disabled';
		} else {
			$dis = '';
		}

		$champ = '<button id="' . $this->id . '" 
		class="' . $this->class . '" 
		type="' . htmlspecialchars($type) . '" 
		name="' . htmlspecialchars($name) . '" ' . $dis . '>' 
		. htmlspecialchars($value) . '</button>';

		echo $champ;
	}

	public function checkbox(){}

	public function radio(){}

	public function textarea(){}

	public function submit(){}

	public function class($class){
		return $this->class = htmlspecialchars($class);
	}
	
	public function id($id){
		return $this->id = htmlspecialchars($id);
	}
}
?>