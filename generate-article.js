const fs = require('fs');
const path = require('path');

// --- FONCTIONS DE BASE ---

function getLayout() {
    return fs.readFileSync('layout.html', 'utf8');
}

function getArticlesMetadata() {
    return JSON.parse(fs.readFileSync('articles.json', 'utf8'));
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// --- LOGIQUE DE GÉNÉRATION D'UN ARTICLE ---

function generateSingleArticle(article, layout) {
    const contentFilePath = path.join('articles', article.filename.replace('.html', '.content.html'));
    if (!fs.existsSync(contentFilePath)) {
        console.warn(` Fichier source manquant : ${contentFilePath}`);
        return;
    }

    const content = fs.readFileSync(contentFilePath, 'utf8');
    const modifiedDate = article.modified || article.date;

    let html = layout
        .replace(/{{TITLE}}/g, article.title)
        .replace(/{{PUBLISHED_DATE}}/g, article.date)
        .replace(/{{MODIFIED_DATE}}/g, modifiedDate)
        .replace(/{{PUBLISHED_DATE_FR}}/g, formatDate(article.date))
        .replace(/{{MODIFIED_DATE_FR}}/g, formatDate(modifiedDate))
        .replace(/{{CONTENT}}/g, content);

    // Affichage conditionnel du badge "épinglé"
    if (article.pinned) {
        html = html.replace(/{{#IF_PINNED}}/g, '').replace(/{{\/IF_PINNED}}/g, '');
    } else {
        html = html.replace(/{{#IF_PINNED}}[^]*?{{\/IF_PINNED}}/g, '');
    }

    // Affichage conditionnel de la date de modification
    if (article.date !== modifiedDate) {
        html = html.replace(/{{#IF_MODIFIED}}/g, '').replace(/{{\/IF_MODIFIED}}/g, '');
    } else {
        html = html.replace(/{{#IF_MODIFIED}}[^]*?{{\/IF_MODIFIED}}/g, '');
    }

    const outputFilePath = path.join('articles', article.filename);
    fs.writeFileSync(outputFilePath, html);
    console.log(`Article généré : ${outputFilePath}`);
}

// --- LOGIQUE PRINCIPALE ---

function main() {
    const targetFilename = process.argv[2] || null;
    const layout = getLayout();
    let articles = getArticlesMetadata();

    if (targetFilename) {
        // CAS 1: On cible un article spécifique
        const articleIndex = articles.findIndex(a => a.filename === targetFilename);
        if (articleIndex === -1) {
            console.error(`Erreur : Article "${targetFilename}" non trouvé dans articles.json.`);
            return;
        }

        // Mettre à jour la date de modification et sauvegarder
        const today = new Date().toISOString().split('T')[0];
        articles[articleIndex].modified = today;
        fs.writeFileSync('articles.json', JSON.stringify(articles, null, 2), 'utf-8');
        console.log(`Date de modification mise à jour pour ${targetFilename}.`);

        // Regénérer uniquement cet article
        generateSingleArticle(articles[articleIndex], layout);

    } else {
        // CAS 2: On régénère TOUS les articles
        console.log("Régénération de tous les articles...");
        articles.forEach(article => {
            generateSingleArticle(article, layout);
        });
        console.log("Terminé. Tous les articles ont été régénérés.");
    }
}

main();