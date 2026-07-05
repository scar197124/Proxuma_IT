# Proxuma IT GitHub Pages Ready Package

This package keeps the website files at the repository root and adds:

- `.nojekyll` so GitHub Pages publishes static files directly.
- `.github/workflows/static-pages.yml` for a clean GitHub Actions Pages deploy.

After uploading these files to the repo, set GitHub Pages to:

Settings → Pages → Build and deployment → Source: GitHub Actions

Then run the workflow named: Deploy static site to GitHub Pages.
