const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function ask(question) {
    return new Promise(resolve => rl.question(question, answer => resolve(answer.trim())));
}

(async function() {
    console.log('=== Création d\'un nouvel article ===');
    const title = await ask('Titre de l\'article : ');
    let date;
    while (true) {
        date = await ask("Date de publication (YYYY-MM-DD) : ");
        if (/^\d{4}-\d{2}-\d{2}$/.test(date)) break;
        console.log("Format invalide ! Utilise YYYY-MM-DD (exemple : 2025-02-20)");
    }
    const excerpt = await ask('Extrait (optionnel) : ');
    console.log('Saisis le contenu de l\'article (finis par une ligne avec juste ".fin") :');
    let content = '';
    while (true) {
        const line = await ask('');
        if (line === '.fin') break;
        content += line + '\n';
    }
    // Générer le nom de fichier
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const filename = `${slug}.html`;
    const contentFilename = `${slug}.content.html`;
    const contentPath = path.join('articles', contentFilename);

    // 1. Créer le fichier .content.html
    fs.writeFileSync(contentPath, content.trim() + '\n');
    console.log(`Fichier créé : ${contentPath}`);

    // 2. Mettre à jour articles.json
    const articlesJsonPath = 'articles.json';
    let articles = [];
    if (fs.existsSync(articlesJsonPath)) {
        articles = JSON.parse(fs.readFileSync(articlesJsonPath, 'utf8'));
    }
    articles.push({
        filename,
        title,
        date,
        excerpt
    });
    fs.writeFileSync(articlesJsonPath, JSON.stringify(articles, null, 2));
    console.log('articles.json mis à jour.');

    // 3. Lancer la génération automatique
    const { execSync } = require('child_process');
    try {
        execSync('node generate-article.js', { stdio: 'inherit' });
        console.log('Article généré avec layout !');
    } catch (e) {
        console.error('Erreur lors de la génération automatique:', e.message);
    }

    rl.close();
})();
