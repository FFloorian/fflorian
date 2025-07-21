// Fonction pour changer le mode
function toggleTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    
    // Mettre à jour l'attribut data-theme
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Sauvegarder le choix dans le localStorage
    localStorage.setItem('theme', newTheme);
    
    // Mettre à jour l'icône du bouton
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.innerHTML = newTheme === 'dark' ? '🌙' : '☀️';
    }
}

// Appliquer le thème sauvegardé au chargement
function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Mettre à jour l'icône du bouton si elle existe
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.innerHTML = savedTheme === 'dark' ? '🌙' : '☀️';
    }
}

// Ajouter un écouteur d'événement pour le bouton de changement de thème
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
        applySavedTheme();
    }
});
