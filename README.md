Code de mon site fflorian.fr — version Quarto.

## Dev local

```bash
quarto preview
# ou
quarto render
```

Le site généré est dans `_site/` (déployé sur Netlify via `netlify.toml`).

## Structure

- `index.qmd` : accueil
- `articles/guide-streaming.qmd`
- `articles/guide-dns.qmd`
- `_quarto.yml` : config site
- `custom.scss` + `styles.css` : thème
- `logo.png` : favicon / logo
