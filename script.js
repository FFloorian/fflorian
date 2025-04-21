/* script.js */

async function loadArticles() {
  try {
    const res = await fetch('articles.json');
    const articles = await res.json();
    const container = document.querySelector('.articles-grid');
    container.innerHTML = '';
    articles.forEach(article => {
      const card = document.createElement('article');
      card.className = 'card';
      const link = document.createElement('a');
      link.href = article.url;
      link.className = 'full-link';
      link.innerHTML = `<h2>${article.title}</h2><p>${article.excerpt}</p>`;
      card.appendChild(link);
      container.appendChild(card);
    });
  } catch (err) {
    console.error('Error loading articles:', err);
  }
}

async function loadDocs() {
  try {
    const res = await fetch('docs.json');
    const docs = await res.json();
    const container = document.querySelector('.articles-grid');
    container.innerHTML = '';
    docs.forEach(doc => {
      const card = document.createElement('article');
      card.className = 'card';
      const link = document.createElement('a');
      link.href = doc.url;
      link.className = 'full-link';
      link.innerHTML = `<h2>${doc.title}</h2><p>${doc.excerpt}</p>`;
      card.appendChild(link);
      container.appendChild(card);
    });
  } catch (err) {
    console.error('Error loading documents:', err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  if (path.includes('articles.html')) {
    loadArticles();
  } else if (path.includes('docs.html')) {
    loadDocs();
  }
});
