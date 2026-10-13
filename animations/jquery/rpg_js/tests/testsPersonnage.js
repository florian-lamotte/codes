import { Personnage } from "../js/Personnage.js";
import {
    DIRECTION,
    DUREE_DEPLACEMENT,
    DUREE_FILE_COMMANDES,
    TAILLE_TUILE,
    NOMBRE_IMAGES_ANIMATION
} from "../js/config.js";

const tests = [];

function test(description, action) {
    tests.push({ description, action });
}

function verifier(condition, message = "Résultat inattendu") {
    if (!condition) {
        throw new Error(message);
    }
}

async function verifierErreur(action, messageAttendu = null) {
    let erreurDetectee = null;

    try {
        await action();
    } catch (erreur) {
        erreurDetectee = erreur;
    }

    verifier(
        erreurDetectee !== null,
        "Une erreur était attendue."
    );

    if (messageAttendu !== null) {
        verifier(
            erreurDetectee.message.includes(messageAttendu),
            `Message d'erreur inattendu : ${erreurDetectee.message}`
        );
    }
}

function creerCarteTest(casesBloquees = []) {
    return {
        estAccessible(x, y) {
            return (
                x >= 0 &&
                y >= 0 &&
                x < 5 &&
                y < 5 &&
                !casesBloquees.some(
                    position => position.x === x && position.y === y
                )
            );
        }
    };
}

function creerPersonnageTest(x = 2, y = 2) {
    // Évite de lancer le chargement réel d'une image.
    const personnage = Object.create(Personnage.prototype);

    Object.assign(personnage, {
        x,
        y,
        direction: DIRECTION.BAS,
        largeur: 0,
        hauteur: 0,
        deplacement: null,
        directionEnAttente: null,
        dateCommande: 0
    });

    return personnage;
}

// ================================================
// DÉPLACEMENTS
// ================================================

test("Un déplacement vers une case libre est accepté", () => {
    const personnage = creerPersonnageTest();
    const carte = creerCarteTest();

    const resultat = personnage.deplacer(
        DIRECTION.DROITE,
        carte,
        100
    );

    verifier(resultat);
    verifier(personnage.x === 3);
    verifier(personnage.y === 2);
    verifier(personnage.deplacement !== null);
    verifier(personnage.deplacement.debut === 100);
});

test("Une direction invalide est refusée", () => {
    const personnage = creerPersonnageTest();
    const carte = creerCarteTest();

    verifier(!personnage.deplacer(99, carte, 100));
    verifier(personnage.x === 2);
    verifier(personnage.y === 2);
    verifier(personnage.deplacement === null);
});

test("Une case bloquée empêche le déplacement", () => {
    const personnage = creerPersonnageTest();
    const carte = creerCarteTest([{ x: 3, y: 2 }]);

    verifier(!personnage.deplacer(DIRECTION.DROITE, carte, 100));
    verifier(personnage.deplacement === null);
});

test("Un second déplacement est refusé pendant une animation", () => {
    const personnage = creerPersonnageTest();
    const carte = creerCarteTest();

    verifier(personnage.deplacer(DIRECTION.DROITE, carte, 100));

    verifier(!personnage.deplacer(DIRECTION.BAS, carte, 110));
});

// ================================================
// COMMANDES EN ATTENTE
// ================================================

test("Une commande valide est mémorisée", () => {
    const personnage = creerPersonnageTest();

    verifier(
        personnage.demanderDeplacement(DIRECTION.GAUCHE, 100)
    );

    verifier(personnage.directionEnAttente === DIRECTION.GAUCHE);
    verifier(personnage.dateCommande === 100);
});

test("Une commande invalide est refusée", () => {
    const personnage = creerPersonnageTest();

    verifier(!personnage.demanderDeplacement(99, 100));
    verifier(personnage.directionEnAttente === null);
});

test("La commande la plus récente remplace la précédente", () => {
    const personnage = creerPersonnageTest();

    personnage.demanderDeplacement(DIRECTION.GAUCHE, 100);
    personnage.demanderDeplacement(DIRECTION.HAUT, 150);

    verifier(personnage.directionEnAttente === DIRECTION.HAUT);
    verifier(personnage.dateCommande === 150);
});

test("Une commande en attente démarre après la fin du déplacement", () => {
    const personnage = creerPersonnageTest();
    const carte = creerCarteTest();

    personnage.deplacer(DIRECTION.DROITE, carte, 100);
    personnage.demanderDeplacement(DIRECTION.BAS, 120);

    personnage.mettreAJour(
        100 + DUREE_DEPLACEMENT,
        carte
    );

    verifier(personnage.deplacement !== null);
    verifier(personnage.deplacement.arriveeX === 3);
    verifier(personnage.deplacement.arriveeY === 3);
    verifier(personnage.directionEnAttente === null);
});

test("Une commande expirée ne déclenche pas de déplacement", () => {
    const personnage = creerPersonnageTest();
    const carte = creerCarteTest();

    personnage.demanderDeplacement(DIRECTION.DROITE, 100);

    personnage.mettreAJour(
        100 + DUREE_FILE_COMMANDES + 1,
        carte
    );

    verifier(personnage.deplacement === null);
    verifier(personnage.directionEnAttente === null);
    verifier(personnage.x === 2);
    verifier(personnage.y === 2);
});

// ================================================
// ANIMATION
// ================================================

test("Le déplacement se termine après sa durée", () => {
    const personnage = creerPersonnageTest();
    const carte = creerCarteTest();

    personnage.deplacer(DIRECTION.DROITE, carte, 100);

    personnage.mettreAJour(
        100 + DUREE_DEPLACEMENT,
        carte
    );

    verifier(personnage.deplacement === null);
    verifier(personnage.x === 3);
    verifier(personnage.y === 2);
});

// ================================================
// CHARGEMENT DU SPRITE
// ================================================

test("Un sprite aux dimensions invalides est refusé", async () => {
    const AncienneImage = globalThis.Image;

    try {
        globalThis.Image = class {
            constructor() {
                this.naturalWidth = NOMBRE_IMAGES_ANIMATION + 1;
                this.naturalHeight = 4;
            }

            set src(url) {
                this.onload();
            }
        };

        const personnage = new Personnage(
            "sprite-invalide.png",
            0,
            0,
            DIRECTION.BAS
        );

        await verifierErreur(
            () => personnage.chargerImage(),
            "Dimensions de sprite invalides"
        );
    } finally {
        globalThis.Image = AncienneImage;
    }
});

// ================================================
// EXÉCUTION DES TESTS
// ================================================

async function executerTests() {
    let reussis = 0;
    let echoues = 0;

    console.group("Tests de Personnage.js");

    for (const { description, action } of tests) {
        try {
            await action();
            reussis++;
            console.log(`✅ RÉUSSI : ${description}`);
        } catch (erreur) {
            echoues++;
            console.error(`❌ ÉCHEC : ${description}`, erreur);
        }
    }

    console.log(
        `Bilan : ${reussis} réussis, ${echoues} échoués.`
    );

    console.groupEnd();
}

executerTests();