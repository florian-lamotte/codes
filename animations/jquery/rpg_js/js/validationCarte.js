/**
 * Vérifie la structure et le contenu du terrain.
 *
 * @param {object} donnees - Données chargées depuis le JSON.
 * @throws {Error} Si les données sont invalides.
 */
export function validerDonneesCarte(donnees) {
    if (
        !donnees ||
        typeof donnees.tileset !== "string" ||
        !Array.isArray(donnees.terrain) ||
        donnees.terrain.length === 0
    ) {
        throw new Error("Données de carte invalides.");
    }

    const terrain = donnees.terrain;
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

/**
 * Vérifie que toutes les tuiles utilisées
 * existent dans le tileset chargé.
 *
 * @param {number[][]} terrain
 * @param {number} nombreTuiles
 * @throws {Error} Si une tuile est absente du tileset.
 */
export function validerTuilesTerrain(terrain, nombreTuiles) {
    const tuileInvalide = terrain.some(ligne =>
        ligne.some(numero => numero > nombreTuiles)
    );

    if (tuileInvalide) {
        throw new Error(
            "La carte utilise des tuiles absentes du tileset."
        );
    }
}