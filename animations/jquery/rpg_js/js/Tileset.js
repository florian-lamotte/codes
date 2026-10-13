import { TAILLE_TUILE } from "./config.js";
import { urlTileset } from "./ressources.js";

export class Tileset {
    constructor(url) {
        this.url = url;
        this.image = new Image();

        this.largeur = 0;
        this.hauteur = 0;

        // Promesse partagée entre les appels au chargement.
        this.chargement = null;
    }

    // ================================================
    // CHARGEMENT
    // ================================================

    charger() {
        // Un chargement est déjà en cours ou terminé.
        if (this.chargement !== null) {
            return this.chargement;
        }

        this.chargement = this.chargerImage()
            .then(() => {
                this.validerDimensions();
                this.calculerDimensions();

                return this;
            })
            .catch(erreur => {
                // Permet de réessayer après un échec.
                this.chargement = null;
                this.largeur = 0;
                this.hauteur = 0;

                throw erreur;
            });

        return this.chargement;
    }

    chargerImage() {
        return new Promise((resolve, reject) => {
            const terminer = () => {
                this.image.onload = null;
                this.image.onerror = null;
            };

            this.image.onload = () => {
                terminer();
                resolve();
            };

            this.image.onerror = () => {
                terminer();

                reject(
                    new Error(
                        `Impossible de charger le tileset : ${this.url}`
                    )
                );
            };

            this.image.src = urlTileset(this.url).href;
        });
    }

    // ================================================
    // VALIDATION ET DIMENSIONS
    // ================================================

    validerDimensions() {
        const largeur = this.image.naturalWidth;
        const hauteur = this.image.naturalHeight;

        const dimensionsValides =
            largeur >= TAILLE_TUILE &&
            hauteur >= TAILLE_TUILE &&
            largeur % TAILLE_TUILE === 0 &&
            hauteur % TAILLE_TUILE === 0;

        if (!dimensionsValides) {
            throw new Error(
                `Dimensions invalides pour le tileset ${this.url}`
            );
        }
    }

    calculerDimensions() {
        this.largeur =
            this.image.naturalWidth / TAILLE_TUILE;

        this.hauteur =
            this.image.naturalHeight / TAILLE_TUILE;
    }

    // ================================================
    // DESSIN DES TUILES
    // ================================================

    dessinerTile(numero, context, x, y) {
        if (!this.estNumeroTuileValide(numero)) {
            console.warn(`Tuile invalide : ${numero}`);
            return;
        }

        const { sourceX, sourceY } =
            this.calculerPositionSource(numero);

        context.drawImage(
            this.image,
            sourceX,
            sourceY,
            TAILLE_TUILE,
            TAILLE_TUILE,
            x,
            y,
            TAILLE_TUILE,
            TAILLE_TUILE
        );
    }

    estNumeroTuileValide(numero) {
        const nombreTuiles = this.largeur * this.hauteur;

        return (
            Number.isInteger(numero) &&
            numero >= 1 &&
            numero <= nombreTuiles
        );
    }

    calculerPositionSource(numero) {
        const index = numero - 1;

        return {
            sourceX:
                (index % this.largeur) * TAILLE_TUILE,

            sourceY:
                Math.floor(index / this.largeur) * TAILLE_TUILE
        };
    }
}