# STUDIO (Studio-LAGCC)

STUDIO is a place where LaGuardia students can discover and present projects from classes, clubs, internships, and independent work. It is a prototype built during the LaGuardia Maker Hub internship.

**Live site:** https://sunscar01.github.io/Studio-LAGCC/

## Team

- Shakira Kashif: UI/UX, visual design, and digital media
- Sanskar Dangal: front-end, data, and GitHub
- Aman Deula: UX, interaction and usability

## Run it locally

The site is plain HTML, CSS and JavaScript. There is nothing to install.

1. Clone the repo or download it as a ZIP and unzip it.
2. The gallery loads `data/projects.json` with `fetch`, and browsers block that when you open the file directly. Start a small local server from the project folder:
   ```
   python3 -m http.server 8000
   ```
3. Open http://localhost:8000 in your browser.

Or skip all that and use the live site above.

## Folder overview

| Folder / file | What it holds |
|---|---|
| `index.html`, `project.html`, `submit.html` | The three pages: gallery, project detail, submission form |
| `css/` | `variables.css` (colors, spacing), `styles.css` (base), `components.css` (cards, filters, etc.) |
| `js/` | One file per job: `data.js`, `filter.js`, `project.js`, `bookmarks.js`, `comments.js`, `auth.js`, `theme.js`, `form.js`, `app.js` |
| `data/projects.json` | The sample project data (fictional projects) |
| `assets/` | Images and logos |
| `docs/` | Data schema, component inventory, implementation specs, JS module layout |
| `.github/` | Pull request template and issue templates |

## How we work

- Every change goes through a **pull request**. Use the template and get a teammate to review before merging.
- Work is tracked as **issues** on the STUDIO MVP board, grouped into weekly **milestones**.
- File paths in the code are **relative** (no leading slash) so the site works on GitHub Pages.

## Status

Prototype. Likes, bookmarks, comments, login and sign-up, and the dark theme are demo-only and save to the browser (LocalStorage), not to a server.
