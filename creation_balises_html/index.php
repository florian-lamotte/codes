<?php

require_once 'autoload.php';

$generateur = new GenerateurHtml();

$texte = $generateur->message('Bonjour !', 'h1');
// échappement à prévoir pour div
$titre = $generateur->div($texte, [
    'id' => 'accueil',
    'class' => 'conteneur'
]);

$monFormulaire = $generateur->form([
    $generateur->input('text', [
        'id' => 'nom',
        'name' => 'nom',
        'placeholder' => 'Ton nom',
        'required' => true
    ]),

    $generateur->input('email', [
        'id' => 'email',
        'name' => 'email',
        'placeholder' => 'Ton adresse e-mail',
        'required' => true
    ]),

    $generateur->button('Envoyer', [
        'type' => 'submit'
    ])
], [
    'id' => 'inscription',
    'class' => 'formulaire',
    'action' => 'traitement.php',
    'method' => 'POST'
]);

$lien = $generateur->link('Accueil', 'index.php', [
    'class' => 'lien',
    'id' => 'accueil'
]);

$textarea = $generateur->textarea('Mon commentaire', [
    'name' => 'commentaire',
    'id' => 'commentaire',
    'rows' => 5,
    'cols' => 40,
    'placeholder' => 'Écris ici...'
]);

$titreRadio1 = $generateur->message('Oui', 'label', [
    'for' => 'oui'
]);
$radio1 = $generateur->radio([
    'name' => 'choix',
    'id' => 'oui',
    'value' => 'oui'
]);

$titreRadio2 = $generateur->message('Non', 'label', [
    'for' => 'non'
]);
$radio2 = $generateur->radio([
    'name' => 'choix',
    'id' => 'non',
    'value' => 'non'
]);

$contenu = $generateur->div(
    $generateur->message('Bienvenue', 'h1')
    . $generateur->message('Voici ma présentation.', 'p')
    . $generateur->link('En savoir plus', 'apropos.php'),
    [
        'id' => 'accueil',
        'class' => 'conteneur'
    ]
);

$generateur->html([
    $titre,
    $monFormulaire,
    $lien,
    $textarea,
    $titreRadio1,
    $radio1,
    $titreRadio2,
    $radio2,
    
    $generateur->checkbox([
        'name' => 'conditions',
        'id' => 'conditions',
        'value' => 'acceptees',
        'required' => true
    ]),
    
    $generateur->submit('Valider', [
        'id' => 'validation',
        'class' => 'bouton'
    ]),

    $contenu,
]);

?>