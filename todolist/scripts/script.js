$('.bbcode').click(function(){
	var debut_balise = '[' + $(this).val().toLowerCase() + ']';
	var fin_balise = '[/' + $(this).val().toLowerCase() + ']';
	var message = document.getElementById('message');
	var debut_selection = message.selectionStart;
	var fin_selection = message.selectionEnd;
	var selection = message.value.substring(debut_selection, fin_selection);
	var avant_selection = message.value.substring(0, debut_selection);
	var apres_selection = message.value.substring(fin_selection, message.value.length);

	$('#message').val(avant_selection +  debut_balise + selection + fin_balise + apres_selection).focus();
});

var containerEl = document.querySelector('.container');

var mixer = mixitup(containerEl, {
    animation: {
        "animateResizeContainer": false,
        "duration": 250,
		"nudge": true,
		"reverseOut": false,
		"effects": "fade translateZ(-100px)"
   	}
});