export const TAILLE_TUILE = 32;

export const DIRECTION = Object.freeze({
    BAS: 0,
    GAUCHE: 1,
    DROITE: 2,
    HAUT: 3
});

// Durée d'un déplacement d'une case, en millisecondes.
export const DUREE_DEPLACEMENT = 160;

// Nombre de colonnes de sprites pour chaque direction.
export const NOMBRE_IMAGES_ANIMATION = 4;

// Délai maximal de conservation d'une commande en attente.
export const DUREE_FILE_COMMANDES = 250;