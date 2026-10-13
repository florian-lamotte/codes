import { TAILLE_TUILE, DIRECTION } from "./config.js";
import { Carte } from "./Map.js";
import { Personnage } from "./Personnage.js";

const TOUCHES_DIRECTION = {
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

async function chargerJeu() {
    const canvas = document.getElementById("canvas");

    if (!(canvas instanceof HTMLCanvasElement)) {
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

    return { canvas, context, carte, joueur };
}

function creerGestionClavier(joueur) {
    const touchesMaintenues = new Map();

    function obtenirDirection(event) {
        return TOUCHES_DIRECTION[event.key.toLowerCase()];
    }

    function gererToucheEnfoncee(event) {
        const touche = event.key.toLowerCase();
        const direction = obtenirDirection(event);

        if (direction === undefined) {
            return;
        }

        event.preventDefault();

        if (event.repeat) {
            return;
        }

        touchesMaintenues.delete(touche);
        touchesMaintenues.set(touche, direction);

        joueur.demanderDeplacement(direction);
    }

    function gererToucheRelachee(event) {
        touchesMaintenues.delete(event.key.toLowerCase());
    }

    function libererTouches() {
        touchesMaintenues.clear();
    }

    function gererVisibilite() {
        if (document.hidden) {
            libererTouches();
        }
    }

    document.addEventListener(
        "visibilitychange",
        gererVisibilite
    );

    window.addEventListener("keydown", gererToucheEnfoncee);
    window.addEventListener("keyup", gererToucheRelachee);
    window.addEventListener("blur", libererTouches);

    return {
        touchesMaintenues,
        detruire() {
            window.removeEventListener(
                "keydown",
                gererToucheEnfoncee
            );

            window.removeEventListener(
                "keyup",
                gererToucheRelachee
            );

            window.removeEventListener(
                "blur",
                libererTouches
            );

            document.removeEventListener(
                "visibilitychange",
                gererVisibilite
            );

            libererTouches();
        }
    };
}

function creerBoucleJeu(context, canvas, carte, joueur, clavier) {
    let animationId = null;
    let actif = false;

    function boucle(maintenant) {
        animationId = null;

        if (!actif) {
            return;
        }

        joueur.mettreAJour(maintenant, carte);

        const touches = clavier.touchesMaintenues;

        if (
            joueur.deplacement === null &&
            joueur.directionEnAttente === null &&
            touches.size > 0
        ) {
            let direction;

            for (const valeur of touches.values()) {
                direction = valeur;
            }

            joueur.demanderDeplacement(direction, maintenant);
        }

        context.clearRect(0, 0, canvas.width, canvas.height);
        carte.dessinerMap(context, maintenant);

        if (actif) {
            animationId = requestAnimationFrame(boucle);
        }
    }

    function demarrer() {
        if (actif) {
            return;
        }

        actif = true;
        animationId = requestAnimationFrame(boucle);
    }

    function arreter() {
        actif = false;

        if (animationId !== null) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    }

    return { demarrer, arreter };
}

async function demarrerJeu() {
    const { canvas, context, carte, joueur } = await chargerJeu();

    const clavier = creerGestionClavier(joueur);

    const boucle = creerBoucleJeu(
        context,
        canvas,
        carte,
        joueur,
        clavier
    );

    boucle.demarrer();

    return {
        arreter() {
            boucle.arreter();
            clavier.detruire();
        }
    };
}

demarrerJeu().catch(erreur => {
    console.error("Erreur au démarrage du jeu :", erreur);
});