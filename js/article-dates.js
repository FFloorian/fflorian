// Fonction pour formater une date au format français
function formatDate(dateString) {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
}

// Fonction pour charger et afficher les métadonnées de l'article
async function loadArticleMetadata() {
    try {
        // Récupérer le nom du fichier courant
        const currentPath = window.location.pathname;
        const currentFile = currentPath.split('/').pop() || 'index.html';
        
        // Charger la liste des articles
        const basePath = currentPath.includes('/articles/') ? '..' : '.';
        const response = await fetch(`${basePath}/articles-list.json`);
        if (!response.ok) {
            console.error('Erreur lors du chargement des métadonnées:', response.statusText);
            throw new Error('Impossible de charger les métadonnées des articles');
        }
        
        const articles = await response.json();
        console.log('Articles chargés:', articles);
        
        // Afficher des informations de débogage
        console.log('Recherche de l\'article pour le fichier:', currentFile);
        
        // Fonction pour extraire le nom du fichier d'une URL
        const getFileName = (url) => {
            try {
                // Si c'est une URL complète
                if (url.startsWith('http')) {
                    const urlObj = new URL(url);
                    return urlObj.pathname.split('/').pop();
                }
                // Si c'est un chemin relatif
                return url.split('/').pop();
            } catch (e) {
                console.error('Erreur lors de l\'analyse de l\'URL:', url, e);
                return '';
            }
        };
        
        // Fonction pour extraire le nom de base (sans extension)
        const getBaseName = (fileName) => {
            if (!fileName) return '';
            const parts = fileName.split('.');
            if (parts.length > 1) {
                parts.pop(); // Supprimer l'extension
            }
            return parts.join('.');
        };

        // Trouver l'article courant en comparant les noms de base (sans extension)
        const currentArticle = articles.find(article => {
            const articleFile = getFileName(article.url);
            const articleBaseName = getBaseName(articleFile);
            const currentBaseName = getBaseName(currentFile);
            
            const match = articleBaseName && currentBaseName && articleBaseName.toLowerCase() === currentBaseName.toLowerCase();
            if(match) console.log(`Correspondance trouvée: ${currentBaseName} vs ${articleBaseName}`);
            return match;
        });
        
        if (!currentArticle) {
            console.error('Aucun article correspondant trouvé pour le fichier:', currentFile);
            console.log('Articles disponibles:', articles.map(a => getFileName(a.url)));
            return;
        }
        
        console.log('Article trouvé:', currentArticle);
        
        // Mettre à jour l'interface
        const articleHeader = document.querySelector('article h1');
        if (articleHeader) {
            // Créer le conteneur des métadonnées
            const metaContainer = document.createElement('div');
            metaContainer.className = 'article-meta';
            metaContainer.style.marginBottom = '1.5rem';
            metaContainer.style.color = 'var(--text-muted)';
            metaContainer.style.fontSize = '0.9rem';
            
            // Ajouter la date de publication
            if (currentArticle.published) {
                const publishedDate = document.createElement('div');
                publishedDate.innerHTML = `Publié le: <strong>${formatDate(currentArticle.published)}</strong>`;
                metaContainer.appendChild(publishedDate);
            }
            
            // Ajouter la date de mise à jour si différente de la publication
            if (currentArticle.updated && currentArticle.updated !== currentArticle.published) {
                const updatedDate = document.createElement('div');
                updatedDate.innerHTML = `Mis à jour le: <strong>${formatDate(currentArticle.updated)}</strong>`;
                updatedDate.style.marginTop = '0.25rem';
                metaContainer.appendChild(updatedDate);
            }
            
            // Insérer après le titre
            articleHeader.insertAdjacentElement('afterend', metaContainer);
        }
        
    } catch (error) {
        console.error('Erreur lors du chargement des métadonnées:', error);
    }
}

// Charger les métadonnées lorsque le DOM est prêt
document.addEventListener('DOMContentLoaded', loadArticleMetadata);
