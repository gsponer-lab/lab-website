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
| `js/viewer.js` | The home-page 3D protein viewer (rotate only). Data in `js/complex-data.js`, made by `tools/prep_complex.py` from the lab's TAZ1 binder design (backbone trace only; the PDB file itself is not in the repo); cartoon drawing in `js/cartoon.js`; `vendor/three/` is three.js r128 (MIT) |
| `css/style.css` | Colours, fonts and layout (all colours are tokens at the top) |

## Common edits

- **Add a person or photo:** edit `GROUPS` in `js/data.js`. Put photos in `img/` and set `photo: 'img/name.jpg'`. Empty `email`, `linkedin` or `bio` fields show a dashed placeholder.
- **Add a publication:** add a row at the top of `PUBS` in `js/data.js`: `[year, authors, title, journal, url]`.
- **Add a news post:** add an entry to `NEWS` in `js/data.js` with `date`, `title`, `summary` (shown in the list), `body` (full text, paragraphs separated by `\n`), and optionally `photo` (a file in `img/news/`; several, one per line, make a gallery), `caption` and `link`. Each post gets its own page at `#news/<title-as-a-slug>`.
- **Add or edit a software tool:** edit its entry in `SW` in `js/data.js`: `name`, `summary` (the card text), `link` (the tool's own address), `note`, `body` (full description, paragraphs separated by `\n`), `links` (one `Label: https://address` per line) and optionally `photo` (a file in `img/software/`) and `caption`. Each tool gets its own page at `#software/<name-as-a-slug>`.
- **Add or edit a database:** same as a software tool, in `DB` in `js/data.js`. Each one gets its own page at `#databases/<name-as-a-slug>`.

## Working together

Make a branch, edit, open a pull request. Keep changes small and review each other's PRs.

## Notes for IT review

- Static files only; nothing runs on a server.
- Fonts are loaded from Google Fonts. Self-host them if IT requires no third-party requests.
- The old MLnet link pointed to a bare IP address and is left unlinked.
- Draft content came from the old site and public profiles.
