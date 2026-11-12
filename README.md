# Gsponer Lab website (draft redesign)

Static site for gsponerlab.msl.ubc.ca. Plain HTML, CSS and JavaScript. No build step, no backend, no dependencies.

## View it locally

```bash
python3 -m http.server 8000
```

Open http://localhost:8000.

## Where things are

| File | What it holds |
|---|---|
| `index.html` | Page structure: header with theme toggle, the pages (Home, Publications, People, Software, Databases, News), footer, people-page seeker |
| `js/data.js` | **Content**: people, publications, software, databases |
| `js/main.js` | Rendering, page switching, publication filter (Preprints and Published papers), light/dark toggle |
| `js/viewer.js` | The home-page 3D protein viewer (rotate only). Data in `js/complex-data.js`, made by `tools/prep_complex.py` from PDB 7JZU; cartoon drawing in `js/cartoon.js`; `vendor/three/` is three.js r128 (MIT) |
| `css/style.css` | Colours, fonts and layout (all colours are tokens at the top) |

## Common edits

- **Add a person or photo:** edit `GROUPS` in `js/data.js`. Put photos in `img/` and set `photo: 'img/name.jpg'`. Empty `email`, `linkedin` or `bio` fields show a dashed placeholder.
- **Add a publication:** add a row at the top of `PUBS` in `js/data.js`: `[year, authors, title, journal, url]`.
- **Add a news item:** add a row to `NEWS` in `js/data.js`: `[year, title, text]`.
- **Add software or a database:** edit `SW` or `DB` in `js/data.js`.

## Working together

Make a branch, edit, open a pull request. Keep changes small and review each other's PRs.

## Notes for IT review

- Static files only; nothing runs on a server.
- Fonts are loaded from Google Fonts. Self-host them if IT requires no third-party requests.
- The old MLnet link pointed to a bare IP address and is left unlinked.
- Draft content came from the old site and public profiles.
