import { TAILLE_TUILE, DIRECTION } from "./config.js";
import { Carte } from "./Map.js";
import { Personnage } from "./Personnage.js";

async function demarrerJeu() {
    const canvas = document.getElementById("canvas");

    if (!canvas) {
        throw new Error("Le canvas est introuvable.");
    }

    const context = canvas.getContext("2d");

    if (!context) {
        throw new Error("Le contexte 2D est indisponible.");
    }

    const carte = await Carte.charger("chemin");

    const joueur = new Personnage(
        "perso.png",
        7,
        14,
        DIRECTION.BAS
    );

    await joueur.chargerImage();

    if (!carte.estAccessible(joueur.x, joueur.y)) {
        throw new Error(
            "La position initiale du joueur est inaccessible."
        );
    }

    carte.addPersonnage(joueur);

    canvas.width = carte.getLargeur() * TAILLE_TUILE;
    canvas.height = carte.getHauteur() * TAILLE_TUILE;

    const directionsClavier = {
        arrowup: DIRECTION.HAUT,
        arrowdown: DIRECTION.BAS,
        arrowleft: DIRECTION.GAUCHE,
        arrowright: DIRECTION.DROITE,
        z: DIRECTION.HAUT,
        w: DIRECTION.HAUT,
        s: DIRECTION.BAS,
        q: DIRECTION.GAUCHE,
        a: DIRECTION.GAUCHE,
        d: DIRECTION.DROITE
    };

    // Conserve l'ordre des touches enfoncées.
    const touchesMaintenues = new Map();

    function obtenirDirectionTouche(event) {
        return directionsClavier[event.key.toLowerCase()];
    }

    window.addEventListener("keydown", event => {
        const direction = obtenirDirectionTouche(event);

        if (direction === undefined) {
            return;
        }

        event.preventDefault();

        const touche = event.key.toLowerCase();

        // Ignore les répétitions automatiques du navigateur :
        // nous gérons nous-mêmes la répétition.
        if (event.repeat) {
            return;
        }

        touchesMaintenues.delete(touche);
        touchesMaintenues.set(touche, direction);

        joueur.demanderDeplacement(direction);
    });

    window.addEventListener("keyup", event => {
        touchesMaintenues.delete(event.key.toLowerCase());
    });

    // Évite de continuer à marcher si la fenêtre perd le focus.
    window.addEventListener("blur", () => {
        touchesMaintenues.clear();
    });

    function boucle(maintenant) {
        joueur.mettreAJour(maintenant, carte);

        // Si aucune commande n'attend et que le joueur
        // maintient une touche, prépare le prochain mouvement.
        if (
            joueur.deplacement === null &&
            joueur.directionEnAttente === null &&
            touchesMaintenues.size > 0
        ) {
            const direction = Array.from(
                touchesMaintenues.values()
            ).pop();

            joueur.demanderDeplacement(direction, maintenant);
        }

        context.clearRect(
            0, 0, canvas.width, canvas.height
        );

        carte.dessinerMap(context);

        requestAnimationFrame(boucle);
    }

    requestAnimationFrame(boucle);
}

demarrerJeu().catch(erreur => {
    console.error("Erreur au démarrage du jeu :", erreur);
});