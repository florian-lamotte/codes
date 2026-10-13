function creerURL(dossier, nom, extension = "") {
    const fichier = `${encodeURIComponent(nom)}${extension}`;

    return new URL(`../${dossier}/${fichier}`, import.meta.url);
}

export function urlCarte(nom) {
    return creerURL("maps", nom, ".json");
}

export function urlSprite(nom) {
    return creerURL("sprites", nom);
}

export function urlTileset(nom) {
    return creerURL("tilesets", nom);
}