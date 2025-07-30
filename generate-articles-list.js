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
    tags: ['jeu', 'python'],
    published: '2025-04-21',
    updated: '2025-05-16',
    pinned: true,
    content: 'Un jeu de démineur avec des graphismes effrayants et une atmosphère angoissante. Développé en Python avec Pygame.'
  },
  {
    title: 'Guide Streaming',
    description: 'Guide pour regarder des films et séries en streaming',
    url: 'articles/streaming.html',
    tags: ['streaming', 'guide'],
    published: '2025-04-22',
    updated: '2025-07-19',
    pinned: true,
    content: 'Découvrez les meilleures méthodes pour regarder vos films et séries préférés en streaming légalement et en haute qualité.'
  },
  {
    title: 'Configuration DNS',
    description: 'Comment configurer les DNS pour débloquer des sites',
    url: 'articles/dns.html',
    tags: ['dns', 'réseau', 'guide'],
    published: '2025-07-21',
    updated: '2025-07-21',
    pinned: false,
    content: 'Guide complet pour configurer les serveurs DNS sur différents appareils et systèmes d\'exploitation pour améliorer votre expérience de navigation.'
  }
];

// Écrire le fichier JSON
fs.writeFileSync(outputFile, JSON.stringify(articles, null, 2), 'utf-8');
console.log(`Fichier ${outputFile} généré avec succès avec ${articles.length} articles.`);
