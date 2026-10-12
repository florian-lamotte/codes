import { Carte } from "../js/Map.js";
import { Tileset } from "../js/Tileset.js";
import { TAILLE_TUILE } from "../js/config.js";

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
        "Une erreur était attendue, mais aucune erreur n'a été levée."
    );

    if (messageAttendu !== null) {
        verifier(
            erreurDetectee.message.includes(messageAttendu),
            `Le message d'erreur devrait contenir : "${messageAttendu}". Message reçu : "${erreurDetectee.message}"`
        );
    }
}

async function avecFetchSimulee(reponse, action) {
    const ancienneFetch = globalThis.fetch;

    try {
        globalThis.fetch = async () => reponse;
        await action();
    } finally {
        globalThis.fetch = ancienneFetch;
    }
}

test("Une case libre est accessible", () => {
    const carte = creerCarteTest();

    verifier(carte.estAccessible(0, 0));
});

test("Une case hors de la carte est inaccessible", () => {
    const carte = creerCarteTest();

    verifier(!carte.estAccessible(-1, 0));
    verifier(!carte.estAccessible(3, 0));
    verifier(!carte.estAccessible(0, 3));
});

test("Une coordonnée non entière est refusée", () => {
    const carte = creerCarteTest();

    verifier(!carte.estAccessible(0.5, 0));
});

test("Une tuile bloquante est inaccessible", () => {
    const carte = creerCarteTest();

    verifier(!carte.estAccessible(1, 1));
});

test("Un personnage bloque sa position actuelle", () => {
    const carte = creerCarteTest();

    const personnage = {
        x: 0,
        y: 1,
        deplacement: null
    };

    carte.addPersonnage(personnage);

    verifier(!carte.estAccessible(0, 1));
});

test("Le personnage ignoré ne bloque pas sa case", () => {
    const carte = creerCarteTest();

    const personnage = {
        x: 0,
        y: 1,
        deplacement: null
    };

    carte.addPersonnage(personnage);

    verifier(carte.estAccessible(0, 1, personnage));
});

test("Une destination réservée est inaccessible", () => {
    const carte = creerCarteTest();

    carte.addPersonnage({
        x: 2,
        y: 2,
        deplacement: {
            arriveeX: 1,
            arriveeY: 0
        }
    });

    verifier(!carte.estAccessible(1, 0));
});

test("Un personnage ne peut pas être ajouté deux fois", () => {
    const carte = creerCarteTest();

    const personnage = {
        x: 0,
        y: 0,
        deplacement: null
    };

    carte.addPersonnage(personnage);
    carte.addPersonnage(personnage);

    verifier(carte.personnages.length === 1);
});

test("Une structure de carte valide est acceptée", () => {
    const donnees = {
        tileset: "terrain",
        terrain: [
            [1, 2],
            [3, 1]
        ]
    };

    Carte.validerDonnees(donnees);
});

test("Une carte sans terrain est refusée", async () => {
    await verifierErreur(() => {
        Carte.validerDonnees({
            tileset: "terrain",
            terrain: []
        });
    }, "Données de carte invalides");
});

test("Un terrain non rectangulaire est refusé", async () => {
    await verifierErreur(() => {
        Carte.validerDonnees({
            tileset: "terrain",
            terrain: [
                [1, 2],
                [1]
            ]
        });
    }, "rectangulaire");
});

test("Une tuile égale à zéro est refusée", async () => {
    await verifierErreur(() => {
        Carte.validerDonnees({
            tileset: "terrain",
            terrain: [[1, 0]]
        });
    }, "tuiles valides");
});

test("Une tuile absente du tileset est refusée", () => {
    let erreurDetectee = false;

    try {
        Carte.validerTuilesTerrain(
            [[1, 2, 5]],
            { largeur: 2, hauteur: 2 }
        );
    } catch {
        erreurDetectee = true;
    }

    verifier(erreurDetectee);
});

test("Les tuiles sont dessinées aux bonnes coordonnées", () => {
    const appels = [];

    const tileset = {
        dessinerTile(numero, context, x, y) {
            appels.push({ numero, x, y });
        }
    };

    const carte = new Carte(
        {
            terrain: [
                [1, 2],
                [3, 4]
            ]
        },
        tileset
    );

    carte.dessinerMap({});

    verifier(
        appels.length === 4,
        "Les quatre tuiles doivent être dessinées"
    );

    const positionsAttendues = [
        { numero: 1, x: 0, y: 0 },
        { numero: 2, x: TAILLE_TUILE, y: 0 },
        { numero: 3, x: 0, y: TAILLE_TUILE },
        {
            numero: 4,
            x: TAILLE_TUILE,
            y: TAILLE_TUILE
        }
    ];

    verifier(
        JSON.stringify(appels) ===
        JSON.stringify(positionsAttendues),
        "Les tuiles doivent être dessinées dans le bon ordre"
    );
});

test("Le terrain est dessiné avant les personnages", () => {
    const ordre = [];

    const tileset = {
        dessinerTile() {
            ordre.push("tuile");
        }
    };

    const carte = new Carte(
        {
            terrain: [[1, 1]]
        },
        tileset
    );

    carte.addPersonnage({
        x: 0,
        y: 0,
        deplacement: null,
        dessinerPersonnage() {
            ordre.push("personnage");
        }
    });

    carte.dessinerMap({});

    verifier(
        ordre.join(",") ===
        "tuile,tuile,personnage",
        "Le terrain doit être dessiné avant les personnages"
    );
});

test("Tous les personnages sont dessinés", () => {
    let nombrePersonnagesDessines = 0;

    const tileset = {
        dessinerTile() {}
    };

    const carte = new Carte(
        {
            terrain: [[1]]
        },
        tileset
    );

    for (let i = 0; i < 3; i++) {
        carte.addPersonnage({
            x: i,
            y: 0,
            deplacement: null,
            dessinerPersonnage() {
                nombrePersonnagesDessines++;
            }
        });
    }

    carte.dessinerMap({});

    verifier(
        nombrePersonnagesDessines === 3,
        "Les trois personnages doivent être dessinés"
    );
});

test("Une carte valide est chargée correctement", async () => {
    const ancienneFetch = globalThis.fetch;
    const ancienCharger = (await import("../js/Tileset.js")).Tileset.prototype.charger;

    const { Tileset } = await import("../js/Tileset.js");

    try {
        globalThis.fetch = async () => ({
            ok: true,
            json: async () => ({
                tileset: "terrain",
                terrain: [
                    [1, 2],
                    [3, 4]
                ]
            })
        });

        Tileset.prototype.charger = async function () {
            this.largeur = 2;
            this.hauteur = 2;
        };

        const carte = await Carte.charger("test");

        verifier(carte.getLargeur() === 2);
        verifier(carte.getHauteur() === 2);
    } finally {
        globalThis.fetch = ancienneFetch;
        Tileset.prototype.charger = ancienCharger;
    }
});

test("Une erreur HTTP est correctement détectée", async () => {
    await avecFetchSimulee(
        { ok: false, status: 404 },
        () => verifierErreur(
            () => Carte.charger("inexistante"),
            "HTTP 404"
        )
    );
});

test("Un JSON invalide est refusé", async () => {
    const ancienneFetch = globalThis.fetch;

    try {
        globalThis.fetch = async () => ({
            ok: true,
            json: async () => ({
                tileset: "terrain",
                terrain: []
            })
        });

        let erreurDetectee = false;

        try {
            await Carte.charger("invalide");
        } catch {
            erreurDetectee = true;
        }

        verifier(erreurDetectee);
    } finally {
        globalThis.fetch = ancienneFetch;
    }
});

test("Une carte utilisant une tuile inexistante est refusée", async () => {
    const ancienneFetch = globalThis.fetch;
    const { Tileset } = await import("../js/Tileset.js");
    const ancienCharger = Tileset.prototype.charger;

    try {
        globalThis.fetch = async () => ({
            ok: true,
            json: async () => ({
                tileset: "terrain",
                terrain: [
                    [1, 5]
                ]
            })
        });

        // Le tileset ne contient que 4 tuiles.
        Tileset.prototype.charger = async function () {
            this.largeur = 2;
            this.hauteur = 2;
        };

        let erreurDetectee = false;

        try {
            await Carte.charger("tuiles-invalides");
        } catch (erreur) {
            erreurDetectee = erreur.message.includes(
                "tuiles absentes du tileset"
            );
        }

        verifier(
            erreurDetectee,
            "La carte aurait dû être refusée"
        );
    } finally {
        globalThis.fetch = ancienneFetch;
        Tileset.prototype.charger = ancienCharger;
    }
});

test("Le nom de la carte est encodé dans l'URL", async () => {
    const ancienneFetch = globalThis.fetch;
    let urlDemandee = "";

    try {
        globalThis.fetch = async url => {
            urlDemandee = url;

            return {
                ok: false,
                status: 404
            };
        };

        await verifierErreur(
            () => Carte.charger("ma carte"),
            "HTTP 404"
        );

        verifier(
            urlDemandee === "./maps/ma%20carte.json",
            `URL inattendue : ${urlDemandee}`
        );
    } finally {
        globalThis.fetch = ancienneFetch;
    }
});

test("Un nom de tileset vide est refusé", async () => {
    await verifierErreur(() => {
        Carte.validerDonnees({
            tileset: "   ",
            terrain: [[1]]
        });
    }, "Données de carte invalides");
});

test("Une liste de tuiles bloquantes invalide est refusée", async () => {
    await verifierErreur(() => {
        Carte.validerDonnees({
            tileset: "terrain",
            terrain: [[1]],
            tuilesBloquantes: ["1"]
        });
    }, "tuiles bloquantes");
});

test("Un personnage sans déplacement défini ne provoque pas d'erreur", () => {
    const carte = creerCarteTest();

    carte.addPersonnage({
        x: 2,
        y: 2
    });

    verifier(
        carte.estAccessible(1, 0),
        "Une case libre doit rester accessible"
    );
});

test("Un tileset valide est chargé et ses dimensions sont calculées", async () => {
    const AncienneImage = globalThis.Image;

    try {
        globalThis.Image = class {
            constructor() {
                this.naturalWidth = TAILLE_TUILE * 4;
                this.naturalHeight = TAILLE_TUILE * 2;
                this.complete = false;
            }

            set src(url) {
                this.url = url;
                this.complete = true;
                this.onload();
            }
        };

        const tileset = new Tileset("terrain.png");

        await tileset.charger();

        verifier(tileset.largeur === 4);
        verifier(tileset.hauteur === 2);
        verifier(tileset.image.url === "tilesets/terrain.png");
    } finally {
        globalThis.Image = AncienneImage;
    }
});

test("Un tileset aux dimensions invalides est refusé", async () => {
    const AncienneImage = globalThis.Image;

    try {
        globalThis.Image = class {
            constructor() {
                this.naturalWidth = TAILLE_TUILE + 1;
                this.naturalHeight = TAILLE_TUILE;
            }

            set src(url) {
                this.onload();
            }
        };

        const tileset = new Tileset("dimensions-invalides.png");

        await verifierErreur(
            () => tileset.charger(),
            "Dimensions invalides"
        );
    } finally {
        globalThis.Image = AncienneImage;
    }
});

test("Une tuile valide est dessinée aux bonnes coordonnées", () => {
    const tileset = new Tileset("terrain.png");

    tileset.largeur = 4;
    tileset.hauteur = 2;

    const appels = [];

    const context = {
        drawImage(...argumentsDessin) {
            appels.push(argumentsDessin);
        }
    };

    tileset.dessinerTile(2, context, 32, 64);

    verifier(appels.length === 1);

    const appel = appels[0];

    verifier(appel[1] === TAILLE_TUILE);
    verifier(appel[2] === 0);
    verifier(appel[3] === TAILLE_TUILE);
    verifier(appel[4] === TAILLE_TUILE);
    verifier(appel[5] === 32);
    verifier(appel[6] === 64);
});

test("Un chargement échoué peut être retenté", async () => {
    const AncienneImage = globalThis.Image;
    let tentatives = 0;

    try {
        globalThis.Image = class {
            constructor() {
                this.naturalWidth = TAILLE_TUILE * 2;
                this.naturalHeight = TAILLE_TUILE;
            }

            set src(url) {
                tentatives++;

                if (tentatives === 1) {
                    this.onerror();
                } else {
                    this.onload();
                }
            }
        };

        const tileset = new Tileset("terrain.png");

        await verifierErreur(
            () => tileset.charger(),
            "Impossible de charger le tileset"
        );

        await tileset.charger();

        verifier(tentatives === 2);
        verifier(tileset.largeur === 2);
        verifier(tileset.hauteur === 1);
    } finally {
        globalThis.Image = AncienneImage;
    }
});

function creerCarteTest() {
    return new Carte(
        {
            terrain: [
                [1, 1, 1],
                [1, 2, 1],
                [1, 1, 1]
            ],
            tuilesBloquantes: [2]
        },
        null
    );
}

async function executerTests() {
    let reussis = 0;
    let echoues = 0;

    console.group("Tests de Carte.js");

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