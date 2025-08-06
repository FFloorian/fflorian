document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById("articles-container");
    let layoutTemplate = '';
    
    // Charger le template une seule fois
    fetch('layout.html')
        .then(response => response.text())
        .then(template => {
            layoutTemplate = template;
            return fetch('articles.json');
        })
        .then(response => response.json())
        .then(articles => loadArticles(articles))
        .catch(error => {
            console.error('Erreur lors du chargement du layout ou de articles.json:', error);
        });
    
    async function loadArticles(articles) {
        try {
            // Ajouter le champ url pour chaque article
            articles.forEach(article => {
                article.url = `articles/${article.filename}`;
            });

            // Trier par date (du plus récent au plus ancien)
            articles.sort((a, b) => new Date(b.date) - new Date(a.date));

            // Afficher les articles
            displayArticles(articles);
        } catch (error) {
            console.error('Erreur lors du chargement des articles:', error);
            container.innerHTML = '<p class="error-message">Impossible de charger les articles.</p>';
        }
    }
    
    function displayArticles(articles) {
        // Séparer épinglés et non épinglés
        const pinned = articles.filter(a => a.pinned === true);
        // Ne pas exclure les articles épinglés de la liste principale
        const others = articles;

        // Affichage épinglés
        const pinnedSection = document.getElementById('pinned-articles-section');
        const pinnedContainer = document.getElementById('pinned-articles-container');
        if (pinned.length > 0) {
            pinnedSection.style.display = '';
            pinnedContainer.innerHTML = pinned.map(article => `
                <article class="article-card pinned">
                    <h3><a href="${article.url}">${escapeHtml(article.title)}</a> <span class="pinned-badge">📌</span></h3>
                    ${article.date ? `<div class="article-date">Publié le ${formatDate(article.date)}</div>` : ''}
                    <div class="excerpt">${escapeHtml(article.excerpt || '')}</div>
                    
                </article>
            `).join('');
        } else {
            pinnedSection.style.display = 'none';
        }

        // Affichage derniers articles (hors épinglés)
        if (others.length === 0) {
            container.innerHTML = '<p>Aucun article trouvé.</p>';
            return;
        }
        container.innerHTML = others.map(article => `
            <article class="article-card">
                <h3><a href="${article.url}">${escapeHtml(article.title)}</a></h3>
                ${article.date ? `<div class="article-date">Publié le ${formatDate(article.date)}</div>` : ''}
                <div class="excerpt">${escapeHtml(article.excerpt || '')}</div>
                
            </article>
        `).join('');
    }
    
    // Fonction utilitaire pour échapper le HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Fonction pour formater la date
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    }
});