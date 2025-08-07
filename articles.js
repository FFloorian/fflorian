document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById("articles-container");
    
    // Charger les articles depuis le fichier JSON
    fetch('articles.json')
        .then(response => response.json())
        .then(articles => loadAllArticles(articles))
        .catch(error => {
            console.error('Erreur lors du chargement des articles:', error);
            container.innerHTML = '<p class="error-message">Une erreur est survenue lors du chargement des articles.</p>';
        });
    
    function loadAllArticles(articles) {
        try {
            // Ajouter l'URL pour chaque article
            articles.forEach(article => {
                article.url = `articles/${article.filename}`;
            });

            // Trier par date (du plus récent au plus ancien)
            articles.sort((a, b) => new Date(b.date) - new Date(a.date));

            // Afficher tous les articles
            displayAllArticles(articles);
        } catch (error) {
            console.error('Erreur lors du traitement des articles:', error);
            container.innerHTML = '<p class="error-message">Une erreur est survenue lors du traitement des articles.</p>';
        }
    }
    
    function displayAllArticles(articles) {
        if (articles.length === 0) {
            container.innerHTML = '<p>Aucun article trouvé.</p>';
            return;
        }
        
        // Grouper les articles par année
        const articlesByYear = groupArticlesByYear(articles);
        
        // Générer le HTML pour chaque année
        let html = '';
        for (const [year, yearArticles] of Object.entries(articlesByYear).sort((a, b) => b[0] - a[0])) {
            html += `<h2>${year}</h2>`;
            html += '<div class="year-articles">';
            
            html += yearArticles.map(article => `
                <article class="article-card">
                    ${renderArticleTags(article.tags)}
                    <div class="article-content">
                        <h3><a href="${article.url}">${escapeHtml(article.title)}</a></h3>
                        <div class="article-date">
                            Publié le ${formatDate(article.date)}
                            ${article.modified && article.modified !== article.date ? 
                              `<span class="article-modified-date">Mis à jour le ${formatDate(article.modified)}</span>` : ''}
                        </div>
                        ${article.excerpt ? `<div class="excerpt">${escapeHtml(article.excerpt)}</div>` : ''}
                    </div>
                </article>
            `).join('');
            
            html += '</div>';
        }
        
        container.innerHTML = html;
    }
    
    function groupArticlesByYear(articles) {
        return articles.reduce((acc, article) => {
            const year = new Date(article.date).getFullYear();
            if (!acc[year]) {
                acc[year] = [];
            }
            acc[year].push(article);
            return acc;
        }, {});
    }
    
    // Fonction utilitaire pour échapper le HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Fonction pour formater la date
    function formatDate(dateString) {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    }
    
    // Fonction pour générer le HTML des tags d'un article
    function renderArticleTags(tags) {
        if (!tags || !Array.isArray(tags) || tags.length === 0) {
            return '<div class="article-tags"></div>';
        }
        
        const tagsHtml = tags.map(tag => 
            `<span class="article-tag">${escapeHtml(tag)}</span>`
        ).join('');
        
        return `<div class="article-tags">${tagsHtml}</div>`;
    }
});
