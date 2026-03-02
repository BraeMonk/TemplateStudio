# Template Studio PWA

A fully offline Progressive Web App with **12 premium digital templates** across 4 niches. Fill in your details, generate PDFs instantly. No backend. No data leaves your device.

## Templates

| Niche | Templates |
|---|---|
| Resumes | Classic Professional, Modern Minimal, Creative Bold |
| Planners | Weekly Planner, Monthly Calendar, Daily Productivity |
| Finance | Monthly Budget Tracker, Savings Goal Planner, Debt Payoff Tracker |
| Social Media | 30-Day Content Calendar, Platform Strategy Planner, Analytics Tracker |

## Deploy to GitHub Pages

### 1. Create repo
Go to github.com/new, name it `template-studio`, set Private, create.

### 2. Push files
```bash
git init && git add . && git commit -m "init"
git remote add origin https://github.com/YOUR_USERNAME/template-studio.git
git push -u origin main
```

### 3. Enable GitHub Pages
Repo Settings > Pages > Source: Deploy from branch > main / root > Save.

Your app: `https://YOUR_USERNAME.github.io/template-studio/`

> GitHub Pages on private repos requires GitHub Pro/Team/Enterprise. Free alternative: drag the folder to netlify.com for instant free hosting.

## Install as Mobile App

**iPhone (Safari):** Share > Add to Home Screen  
**Android (Chrome):** Menu > Add to Home Screen  
**Desktop:** Click install icon in address bar

## File Structure
```
index.html        Entry point
manifest.json     PWA manifest
sw.js             Service worker (offline)
css/app.css       All styles
js/templates.js   12 template definitions
js/pdf-engine.js  PDF renderers (jsPDF)
js/app.js         SPA router + UI
icons/            PWA icons (8 sizes)
```

## Adding Templates

1. Add template object to `js/templates.js`
2. Add `renderYourTemplate(doc, data, pal)` to `js/pdf-engine.js`
3. Register in `renderMap` inside `generate()`

## Privacy
No backend, no tracking, no external requests for data. Form data saved to localStorage on your device only. Works fully offline after first load.
