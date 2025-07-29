// Fonction pour charger la liste des articles
async function loadArticles() {
    try {
        console.log('Chargement du fichier articles-list.json...');
        // Chemin relatif au fichier JSON à la racine du site
        const response = await fetch(window.location.pathname.includes('articles') ? '../articles-list.json' : 'articles-list.json');
        console.log('Réponse du serveur:', response.status, response.statusText);
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Articles chargés:', data);
        return data;
    } catch (error) {
        console.error('Erreur lors du chargement des articles:', error);
        return [];
    }
}

// Fonction pour normaliser le texte (supprimer les accents et caractères spéciaux)
function normalizeText(text) {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

// Fonction pour calculer la pertinence d'un article par rapport à la recherche
function calculateRelevance(article, searchTerm) {
    const title = normalizeText(article.title);
    const description = article.description ? normalizeText(article.description) : '';
    const tags = article.tags ? article.tags.join(' ').toLowerCase() : '';
    
    // Vérifier les correspondances exactes dans le titre
    if (title === searchTerm) return 100;
    
    // Vérifier si le terme est au début du titre
    if (title.startsWith(searchTerm)) return 90;
    
    // Vérifier si le terme est contenu dans le titre
    if (title.includes(searchTerm)) return 80;
    
    // Vérifier les correspondances dans les tags
    if (tags.includes(searchTerm)) return 70;
    
    // Vérifier les correspondances dans la description
    if (description.includes(searchTerm)) return 50;
    
    // Vérifier les correspondances partielles
    const searchWords = searchTerm.split(' ');
    const titleWords = title.split(' ');
    const matchingWords = searchWords.filter(word => 
        titleWords.some(tw => tw.startsWith(word))
    );
    
    if (matchingWords.length > 0) {
        return 30 + (matchingWords.length * 10);
    }
    
    return 0;
}

// Fonction pour effectuer la recherche
async function searchArticles(query) {
    console.log('Recherche lancée pour:', query);
    
    // Vérification de la requête
    if (!query || !query.trim()) {
        console.log('Requête vide');
        return [];
    }
    
    const searchTerm = normalizeText(query.trim());
    console.log('Terme de recherche normalisé:', searchTerm);
    
    // Si la recherche est très courte, on ne fait rien
    if (searchTerm.length < 2) {
        console.log('Terme de recherche trop court');
        return [];
    }
    
    // Chargement des articles
    const articles = await loadArticles();
    console.log('Nombre d\'articles chargés:', articles.length);
    
    // Recherche intelligente avec score de pertinence
    const results = articles
        .map(article => {
            const score = calculateRelevance(article, searchTerm);
            console.log(`Article: ${article.title}, Score: ${score}`);
            return {
                ...article,
                score: score
            };
        })
        .filter(article => article.score > 0)
        .sort((a, b) => b.score - a.score);
    
    console.log('Résultats de la recherche:', results);
    return results;
}

// Fonction pour afficher les résultats de la recherche
function displayResults(results) {
    const resultsContainer = document.getElementById('search-results');
    if (!resultsContainer) return;

    if (results.length === 0) {
        resultsContainer.innerHTML = '<div class="search-no-results">Aucun résultat trouvé</div>';
        return;
    }

    resultsContainer.innerHTML = results.map(article => `
        <a href="${article.url}" class="search-result-item">
            <div class="search-result-title">${article.title}</div>
            ${article.description ? `<div class="search-result-desc">${article.description}</div>` : ''}
        </a>
    `).join('');
}

// Initialisation de la barre de recherche
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    if (!searchInput) return;

    // Gestion de la recherche lors de la frappe
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value;
        
        if (searchResults) {
            searchResults.style.display = query ? 'block' : 'none';
        }

        searchTimeout = setTimeout(async () => {
            if (query.length < 2) {
                if (searchResults) searchResults.innerHTML = '';
                return;
            }
            
            const results = await searchArticles(query);
            displayResults(results);
        }, 300);
    });

    // Fermer les résultats quand on clique ailleurs
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            if (searchResults) searchResults.style.display = 'none';
        }
    });

    // Gestion de la touche Entrée
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && searchInput.value.trim()) {
            window.location.href = `search.html?q=${encodeURIComponent(searchInput.value.trim())}`;
        }
    });
});
