<!DOCTYPE html>
<html>
<head>
	<title></title>
	<link rel="stylesheet" type="text/css" href="style.css">
</head>
<body>
	<div class="container">
		<div class="boite-verte relative">relative</div>

		<div class="boite-verte relative">relative
			<div class="boite-bleue absolute">absolute</div>
		</div>

		<div class="boite-verte absolute">absolute
			<div class="boite-bleue absolute volante">
				absolute<br>
				top:100px;<br>
				left:100px;<br>
			</div>
		</div>

		<div class="boite-saumon absolute volante">
			absolute<br>
			top:100px;<br>
			left:100px;<br>
		</div>

		<div class="boite-verte absolute loin">
			absolute<br>
			top:100px;<br>
			left:1400px;<br>
			<div class="boite-bleue relative volante">
				relative<br>
				top:100px;<br>
				left:100px;<br>
			</div>
		</div>
	</div>
</body>
</html>