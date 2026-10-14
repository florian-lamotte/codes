<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Panoramax</title>
</head>

<body>

    <h1>Recherche Panoramax</h1>

    <div>
        <label for="territoire">
            Territoire
        </label>

        <input
            type="text"
            id="territoire"
            placeholder="Ville, région…"
        >
    </div>

    <pre id="resultat"></pre>


    <script>
        const territoireInput = document.getElementById('territoire');
        const resultat = document.getElementById('resultat');

        territoireInput.addEventListener('keydown', async (event) => {

            if (event.key !== 'Enter') {
                return;
            }

            const territoire = territoireInput.value.trim();

            if (!territoire) {
                return;
            }

            resultat.textContent = 'Recherche en cours...';

            try {

                const response = await fetch(
                    `/panoramax/search?territoire=${encodeURIComponent(territoire)}`
                );

                const data = await response.json();

                if (!response.ok || !data.success) {
                    resultat.textContent = data.message ?? 'Une erreur est survenue.';
                    return;
                }

                resultat.textContent = JSON.stringify(
                    data,
                    null,
                    2
                );

            } catch (error) {

                console.error(error);

                resultat.textContent =
                    'Impossible de contacter le serveur.';
            }
        });
    </script>

</body>

</html>