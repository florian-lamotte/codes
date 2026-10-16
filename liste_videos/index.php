<?php

$jsonFile = __DIR__ . '/videos.json';

if (!file_exists($jsonFile)) {
    die('Le fichier videos.json est introuvable.');
}

$json = file_get_contents($jsonFile);
$videos = json_decode($json, true);

if (!is_array($videos)) {
    die('Le fichier videos.json est invalide.');
}

// Récupération des catégories
$categories = [];

foreach ($videos as $video) {
    if (!empty($video['category']) && !in_array($video['category'], $categories, true)) {
        $categories[] = $video['category'];
    }
}

sort($categories);

// Catégorie sélectionnée
$selectedCategory = $_GET['category'] ?? 'Toutes';

// Filtrage
if ($selectedCategory !== 'Toutes') {
    $videos = array_filter($videos, function ($video) use ($selectedCategory) {
        return isset($video['category']) && $video['category'] === $selectedCategory;
    });
}

?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Mes vidéos</title>

    <link rel="stylesheet" href="style.css">
</head>

<body>
    <header class="header">
        <div class="container">
            <h1>Mes vidéos</h1>
            <p>Ma sélection de vidéos YouTube</p>
        </div>
    </header>

    <main class="container">
        <nav class="categories">
            <a
                href="index.php"
                class="<?= $selectedCategory === 'Toutes' ? 'active' : '' ?>"
            >
                Toutes
            </a>

            <?php foreach ($categories as $category): ?>

                <a
                    href="?category=<?= urlencode($category) ?>"
                    class="<?= $selectedCategory === $category ? 'active' : '' ?>"
                >
                    <?= htmlspecialchars($category) ?>
                </a>

            <?php endforeach; ?>
        </nav>

        <section class="videos">
            <?php if (empty($videos)): ?>
                <p class="empty">
                    Aucune vidéo dans cette catégorie.
                </p>
            <?php else: ?>
                <?php foreach ($videos as $video): ?>
                    <?php
                    $id = $video['id'] ?? '';
                    $category = $video['category'] ?? '';

                    if (!$id) {
                        continue;
                    }
                    ?>

                    <article class="video-card">
                        <button
                            class="video-button"
                            type="button"
                            data-video-id="<?= htmlspecialchars($id) ?>"
                            aria-label="Lire la vidéo"
                        >
                            <div class="thumbnail">
                                <img
                                    src="https://img.youtube.com/vi/<?= htmlspecialchars($id) ?>/hqdefault.jpg"
                                    alt="Miniature de la vidéo"
                                    loading="lazy"
                                >

                                <span class="play">▶</span>
                            </div>
                        </button>

                        <div class="video-info">
                            <span class="category">
                                <?= htmlspecialchars($category) ?>
                            </span>
                        </div>
                    </article>
                <?php endforeach; ?>
            <?php endif; ?>
        </section>
    </main>

    <!-- MODALE -->
    <div
        class="modal"
        id="videoModal"
        aria-hidden="true"
    >
        <div class="modal-background"></div>

        <div class="modal-content">
            <button
                class="modal-close"
                id="modalClose"
                type="button"
                aria-label="Fermer"
            >
                &times;
            </button>

            <div class="player-container">
                <iframe
                    id="youtubePlayer"
                    src=""
                    title="Lecteur vidéo YouTube"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowfullscreen
                ></iframe>
            </div>
        </div>
    </div>

    <script>
    const modal = document.getElementById('videoModal');
    const player = document.getElementById('youtubePlayer');
    const closeButton = document.getElementById('modalClose');
    const background = document.querySelector('.modal-background');

    const videoButtons = document.querySelectorAll('.video-button');

    // Ouvrir la vidéo
    videoButtons.forEach(button => {
        button.addEventListener('click', () => {
            const videoId = button.dataset.videoId;

            player.src =
                'https://www.youtube.com/embed/' +
                encodeURIComponent(videoId) +
                '?autoplay=1&rel=0';

            modal.classList.add('open');
            modal.setAttribute('aria-hidden', 'false');

            document.body.classList.add('modal-open');
        });
    });

    // Fermer la modale
    function closeModal() {
        player.src = '';

        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');

        document.body.classList.remove('modal-open');
    }

    // Bouton X
    closeButton.addEventListener('click', closeModal);

    // Clic sur le fond
    background.addEventListener('click', closeModal);

    // Touche Échap
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && modal.classList.contains('open')) {
            closeModal();
        }

    });
    </script>
</body>
</html>