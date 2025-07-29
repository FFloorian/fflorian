const fs = require('fs');
const path = require('path');

const articlesDir = path.join(__dirname, 'articles');
const outputFile = path.join(__dirname, 'articles-list.json');

// Liste des articles avec leurs métadonnées
const articles = [
  {
    title: 'Démineur Démoniaque',
    description: 'Un jeu de démineur revisité avec un thème effrayant',
    url: 'articles/premier-article.html',
    tags: ['jeu', 'python']
  },
  {
    title: 'Guide Streaming',
    description: 'Guide pour regarder des films et séries en streaming',
    url: 'articles/streaming.html',
    tags: ['streaming', 'guide']
  },
  {
    title: 'Configuration DNS',
    description: 'Comment configurer les DNS pour débloquer des sites',
    url: 'articles/dns.html',
    tags: ['dns', 'réseau', 'guide']
  }
];

// Écrire le fichier JSON
fs.writeFileSync(outputFile, JSON.stringify(articles, null, 2), 'utf-8');
console.log(`Fichier ${outputFile} généré avec succès avec ${articles.length} articles.`);
