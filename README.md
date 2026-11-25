# Pumelela Mapukata — Portfolio

Built with Vite + Three.js.

## Run it
```bash
npm install
npm run dev
```
Open the link it prints (http://localhost:5173/Portfolio/).

## Work on one section on its own
- Hero (landing): `/Portfolio/src/sections/hero/preview.html`
- Ask me anything: `/Portfolio/src/sections/ama/preview.html`

## Where things live
| What | File |
| --- | --- |
| Colours and fonts (whole site) | `src/styles/theme.css` |
| Projects (text, links, pictures) | `src/data/projects.json` |
| Certificates | `src/data/certificates.json` |
| Ask me anything | `src/data/ama.json` |
| About, skills, contact | `src/data/site.json` |
| Project pictures | `public/images/projects/` |
| Certificate images | `public/certificates/` |
| 3D hero scene | `src/sections/hero/scene.js` |

## Adding a project picture
1. Save the picture in `public/images/projects/` (e.g. `genesis.webp`).
2. In `src/data/projects.json`, set that project's `"image"` to the file name.

## Deploy
Push to `main`. GitHub Actions builds and publishes to GitHub Pages
(one-time: repo Settings → Pages → Source: GitHub Actions).

Old lab version is kept in `old-lab/`.
