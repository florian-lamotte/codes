import { TAILLE_TUILE } from "./config.js";
import { Tileset } from "./Tileset.js";

export class Carte {
    constructor(donnees, tileset) {
        this.terrain = donnees.terrain;
        this.tileset = tileset;
        this.personnages = [];

        // Numéros des tuiles qui empêchent le déplacement.
        this.tuilesBloquantes = new Set(
            donnees.tuilesBloquantes ?? []
        );
    }

    // ==================================================
    // CHARGEMENT ET VALIDATION
    // ==================================================

    static async charger(nom) {
        const donnees = await this.chargerDonnees(nom);

        this.validerDonnees(donnees);

        const tileset = new Tileset(donnees.tileset);
        await tileset.charger();

        this.validerTuilesTerrain(
            donnees.terrain,
            tileset
        );

        return new Carte(donnees, tileset);
    }

    static async chargerDonnees(nom) {
        const url = `./maps/${encodeURIComponent(nom)}.json`;
        const reponse = await fetch(url);

        if (!reponse.ok) {
            throw new Error(
                `Impossible de charger la carte : HTTP ${reponse.status}`
            );
        }

        return reponse.json();
    }

    static validerDonnees(donnees) {
        if (
            !donnees ||
            typeof donnees.tileset !== "string" ||
            donnees.tileset.trim().length === 0 ||
            !Array.isArray(donnees.terrain) ||
            donnees.terrain.length === 0
        ) {
            throw new Error("Données de carte invalides.");
        }

        if (
            donnees.tuilesBloquantes !== undefined &&
            (
                !Array.isArray(donnees.tuilesBloquantes) ||
                !donnees.tuilesBloquantes.every(numero =>
                    Number.isInteger(numero) && numero >= 1
                )
            )
        ) {
            throw new Error(
                "La liste des tuiles bloquantes est invalide."
            );
        }

        this.validerStructureTerrain(donnees.terrain);
    }

    static validerStructureTerrain(terrain) {
        const largeur = terrain[0]?.length;

        const terrainValide =
            Number.isInteger(largeur) &&
            largeur > 0 &&
            terrain.every(ligne =>
                Array.isArray(ligne) &&
                ligne.length === largeur &&
                ligne.every(numero =>
                    Number.isInteger(numero) && numero >= 1
                )
            );

        if (!terrainValide) {
            throw new Error(
                "Le terrain doit être rectangulaire et contenir des tuiles valides."
            );
        }
    }

    static validerTuilesTerrain(terrain, tileset) {
        const nombreTuiles =
            tileset.largeur * tileset.hauteur;

        const tuileInvalide = terrain.some(ligne =>
            ligne.some(numero => numero > nombreTuiles)
        );

        if (tuileInvalide) {
            throw new Error(
                "La carte utilise des tuiles absentes du tileset."
            );
        }
    }

    // ==================================================
    // DIMENSIONS DE LA CARTE
    // ==================================================

    getLargeur() {
        return this.terrain[0].length;
    }

    getHauteur() {
        return this.terrain.length;
    }

    estDansLesLimites(x, y) {
        return (
            Number.isInteger(x) &&
            Number.isInteger(y) &&
            x >= 0 &&
            y >= 0 &&
            x < this.getLargeur() &&
            y < this.getHauteur()
        );
    }

    // ==================================================
    // GESTION DES PERSONNAGES
    // ==================================================

    addPersonnage(personnage) {
        if (this.personnages.includes(personnage)) {
            return;
        }

        this.personnages.push(personnage);
    }

    // ==================================================
    // ACCESSIBILITÉ ET COLLISIONS
    // ==================================================

    estAccessible(x, y, personnageIgnore = null) {
        if (!this.estDansLesLimites(x, y)) {
            return false;
        }

        if (this.estTuileBloquante(x, y)) {
            return false;
        }

        return !this.estOccupeeParUnPersonnage(
            x,
            y,
            personnageIgnore
        );
    }

    estTuileBloquante(x, y) {
        return this.tuilesBloquantes.has(
            this.terrain[y][x]
        );
    }

    estOccupeeParUnPersonnage(
        x,
        y,
        personnageIgnore = null
    ) {
        return this.personnages.some(personnage => {
            if (personnage === personnageIgnore) {
                return false;
            }

            return (
                this.occupeCaseActuelle(personnage, x, y) ||
                this.occupeCaseReservee(personnage, x, y)
            );
        });
    }

    occupeCaseActuelle(personnage, x, y) {
        return personnage.x === x && personnage.y === y;
    }

    occupeCaseReservee(personnage, x, y) {
        const deplacement = personnage.deplacement;

        if (deplacement == null) {
            return false;
        }

        return (
            deplacement.arriveeX === x &&
            deplacement.arriveeY === y
        );
    }

    // ==================================================
    // AFFICHAGE DE LA CARTE
    // ==================================================

    dessinerMap(context) {
        this.dessinerTerrain(context);
        this.dessinerPersonnages(context);
    }

    dessinerTerrain(context) {
        const largeur = this.getLargeur();
        const hauteur = this.getHauteur();

        for (let y = 0; y < hauteur; y++) {
            for (let x = 0; x < largeur; x++) {
                this.dessinerTuile(context, x, y);
            }
        }
    }

    dessinerTuile(context, x, y) {
        const numeroTuile = this.terrain[y][x];

        this.tileset.dessinerTile(
            numeroTuile,
            context,
            x * TAILLE_TUILE,
            y * TAILLE_TUILE
        );
    }

    dessinerPersonnages(context) {
        for (const personnage of this.personnages) {
            personnage.dessinerPersonnage(context);
        }
    }
}