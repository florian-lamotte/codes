import {
    TAILLE_TUILE,
    DIRECTION,
    DUREE_DEPLACEMENT,
    NOMBRE_IMAGES_ANIMATION,
    DUREE_FILE_COMMANDES
} from "./config.js";

export class Personnage {
    constructor(url, x, y, direction) {
        this.url = url;
        this.x = x;
        this.y = y;
        this.direction = direction;

        this.largeur = 0;
        this.hauteur = 0;

        this.deplacement = null;
        this.directionEnAttente = null;
        this.dateCommande = 0;

        this.image = new Image();
        this.promesseImage = this.chargerSprite();
    }

    // ================================================
    // CHARGEMENT DU SPRITE
    // ================================================

    chargerImage() {
        return this.promesseImage;
    }

    chargerSprite() {
        return new Promise((resolve, reject) => {
            this.image.onload = () => {
                try {
                    this.validerDimensionsSprite();
                    this.calculerDimensionsSprite();

                    this.nettoyerEvenementsImage();
                    resolve(this);
                } catch (erreur) {
                    this.nettoyerEvenementsImage();
                    reject(erreur);
                }
            };

            this.image.onerror = () => {
                this.nettoyerEvenementsImage();

                reject(
                    new Error(
                        `Impossible de charger le personnage : ${this.url}`
                    )
                );
            };

            this.image.src = `sprites/${this.url}`;
        });
    }

    validerDimensionsSprite() {
        const largeur = this.image.naturalWidth;
        const hauteur = this.image.naturalHeight;

        const dimensionsValides =
            largeur > 0 &&
            hauteur > 0 &&
            largeur % NOMBRE_IMAGES_ANIMATION === 0 &&
            hauteur % 4 === 0;

        if (!dimensionsValides) {
            throw new Error(
                `Dimensions de sprite invalides : ${this.url}`
            );
        }
    }

    calculerDimensionsSprite() {
        this.largeur =
            this.image.naturalWidth / NOMBRE_IMAGES_ANIMATION;

        this.hauteur = this.image.naturalHeight / 4;
    }

    nettoyerEvenementsImage() {
        this.image.onload = null;
        this.image.onerror = null;
    }

    // ================================================
    // DIRECTIONS ET CASES ADJACENTES
    // ================================================

    estDirectionValide(direction) {
        return Object.values(DIRECTION).includes(direction);
    }

    getCoordonneesAdjacentes(direction) {
        switch (direction) {
            case DIRECTION.BAS:
                return { x: this.x, y: this.y + 1 };

            case DIRECTION.HAUT:
                return { x: this.x, y: this.y - 1 };

            case DIRECTION.GAUCHE:
                return { x: this.x - 1, y: this.y };

            case DIRECTION.DROITE:
                return { x: this.x + 1, y: this.y };

            default:
                return null;
        }
    }

    // ================================================
    // COMMANDES DE DÉPLACEMENT
    // ================================================

    demanderDeplacement(
        direction,
        maintenant = performance.now()
    ) {
        if (!this.estDirectionValide(direction)) {
            return false;
        }

        // La dernière commande remplace la précédente.
        this.directionEnAttente = direction;
        this.dateCommande = maintenant;

        return true;
    }

    deplacer(
        direction,
        carte,
        maintenant = performance.now()
    ) {
        if (
            this.deplacement !== null ||
            !this.estDirectionValide(direction)
        ) {
            return false;
        }

        this.direction = direction;

        const destination =
            this.getCoordonneesAdjacentes(direction);

        if (
            destination === null ||
            !carte.estAccessible(
                destination.x,
                destination.y,
                this
            )
        ) {
            return false;
        }

        this.demarrerDeplacement(
            destination.x,
            destination.y,
            maintenant
        );

        return true;
    }

    demarrerDeplacement(arriveeX, arriveeY, maintenant) {
        this.deplacement = {
            departX: this.x,
            departY: this.y,
            arriveeX,
            arriveeY,
            debut: maintenant
        };

        // Réserve immédiatement la destination pour les collisions.
        this.x = arriveeX;
        this.y = arriveeY;
    }

    // ================================================
    // MISE À JOUR DU DÉPLACEMENT
    // ================================================

    mettreAJour(
        maintenant = performance.now(),
        carte
    ) {
        this.mettreAJourDeplacement(maintenant);

        // Attendre la fin de l'animation en cours.
        if (this.deplacement !== null) {
            return;
        }

        this.traiterCommandeEnAttente(maintenant, carte);
    }

    mettreAJourDeplacement(maintenant) {
        if (this.deplacement === null) {
            return;
        }

        if (this.calculerProgression(maintenant) >= 1) {
            this.deplacement = null;
        }
    }

    traiterCommandeEnAttente(maintenant, carte) {
        if (this.directionEnAttente === null) {
            return;
        }

        // Supprimer les commandes trop anciennes.
        if (
            maintenant - this.dateCommande >
            DUREE_FILE_COMMANDES
        ) {
            this.directionEnAttente = null;
            return;
        }

        const direction = this.directionEnAttente;

        this.directionEnAttente = null;

        if (carte) {
            this.deplacer(direction, carte, maintenant);
        }
    }

    calculerProgression(maintenant) {
        if (this.deplacement === null) {
            return 0;
        }

        return Math.max(
            0,
            Math.min(
                (maintenant - this.deplacement.debut) /
                    DUREE_DEPLACEMENT,
                1
            )
        );
    }

    // ================================================
    // DESSIN DU PERSONNAGE
    // ================================================

    dessinerPersonnage(
        context,
        maintenant = performance.now()
    ) {
        if (!this.spriteEstPret()) {
            return;
        }

        const progression =
            this.calculerProgression(maintenant);

        const position = this.calculerPositionAffichee(
            progression
        );

        const frame = this.calculerFrame(progression);

        this.dessinerSprite(
            context,
            position.x,
            position.y,
            frame
        );
    }

    spriteEstPret() {
        return (
            this.image.complete &&
            this.image.naturalWidth > 0 &&
            this.largeur > 0 &&
            this.hauteur > 0
        );
    }

    calculerPositionAffichee(progression) {
        if (this.deplacement === null) {
            return {
                x: this.x,
                y: this.y
            };
        }

        const deplacement = this.deplacement;

        return {
            x: deplacement.departX +
                (deplacement.arriveeX - deplacement.departX) *
                    progression,

            y: deplacement.departY +
                (deplacement.arriveeY - deplacement.departY) *
                    progression
        };
    }

    calculerFrame(progression) {
        if (this.deplacement === null) {
            return 0;
        }

        return Math.min(
            NOMBRE_IMAGES_ANIMATION - 1,
            Math.floor(
                progression * NOMBRE_IMAGES_ANIMATION
            )
        );
    }

    dessinerSprite(context, x, y, frame) {
        context.drawImage(
            this.image,
            frame * this.largeur,
            this.direction * this.hauteur,
            this.largeur,
            this.hauteur,
            x * TAILLE_TUILE -
                this.largeur / 2 +
                TAILLE_TUILE / 2,
            y * TAILLE_TUILE -
                this.hauteur +
                24,
            this.largeur,
            this.hauteur
        );
    }
}