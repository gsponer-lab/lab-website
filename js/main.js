/* ---------- render ---------- */
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const initials = n => n.split(' ').filter(Boolean).map(w => w[0]).slice(0,2).join('');
const photo = p => p.photo ? `<div class="photo"><img src="${esc(p.photo)}" alt="${esc(p.name)}"></div>` : `<div class="photo" aria-hidden="true"></div>`;
const links = p => (p.email || p.linkedin) ? `<div class="links">${p.email ? `<a href="mailto:${esc(p.email)}">${esc(p.email)}</a>` : ''}${p.linkedin ? `<a href="${esc(p.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>` : ''}</div>` : '';

document.getElementById('pi').innerHTML = `<div class="pi">${photo(PI)}<div>
  <div class="role">${esc(PI.role)}</div><h2>${esc(PI.name)}</h2>
  <div class="prose">${PI.bio.map(t => `<p>${esc(t)}</p>`).join('')}</div>
  <dl class="facts"><dt>Office</dt><dd>${esc(PI.office)}</dd><dt>Honours</dt><dd>${esc(PI.honours)}</dd></dl>
  ${links(PI)}</div></div>`;

document.getElementById('groups').innerHTML = GROUPS.map(g => `<div class="group g${Math.min(g.people.length, 3)}"><h2>${esc(g.title)}</h2><div class="grid">${g.people.map(p => `<article class="person">${photo(p)}<div><h3>${esc(p.name)}</h3><div class="role">${esc(p.role)}</div></div>${p.bio ? `<p class="bio">${esc(p.bio)}</p><button class="readmore" type="button" aria-expanded="false" hidden>Read more</button>` : '<p><span class="todo">add a short description</span></p>'}${links(p)}</article>`).join('')}</div></div>`).join('');

/* news text: blank-line-free paragraphs split on \n; bare web addresses become links */
const linkify = s => esc(s).replace(/https?:\/\/[^\s<]+/g, u => `<a href="${u}" target="_blank" rel="noopener">${u}</a>`);
/* lab-member bios: all the same height (a few lines); "Read more" opens the rest, and shows only when the bio is longer than that */
const bioFit = () => document.querySelectorAll('.person .bio').forEach(b => {
  const btn = b.nextElementSibling; if (!btn || !btn.matches('.readmore')) return;
  btn.hidden = !b.classList.contains('open') && b.scrollHeight <= b.clientHeight + 1;
});
document.addEventListener('click', e => {
  const btn = e.target.closest('.readmore'); if (!btn) return;
  const open = btn.previousElementSibling.classList.toggle('open');
  btn.textContent = open ? 'Show less' : 'Read more'; btn.setAttribute('aria-expanded', open);
});
window.addEventListener('resize', bioFit); window.addEventListener('load', bioFit);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(bioFit);
const bold = s => esc(s).replace(/Gsponer J/g, '<b>Gsponer J</b>');
function authors(a) {
  const l = a.split(', ');
  if (l.length <= 8) return bold(a);
  return `${bold(l.slice(0,3).join(', '))}, <span class="rest" hidden>${bold(l.slice(3).join(', '))}</span><button class="more" type="button">+${l.length-3} more</button>`;
}
/* p[5], when present, is the paper's graphical abstract (from its open-access full text, CC BY-NC) */
const pubItem = p => `<li class="pub${p[5] ? ' has-fig' : ''}"><div class="pub-text"><a class="t" href="${esc(p[4])}" target="_blank" rel="noopener">${esc(p[2])}</a><div class="au">${authors(p[1])}</div><div class="j">${esc(p[3])} · ${p[0]}</div></div>${p[5] ? `<a class="fig" href="${esc(p[4])}" target="_blank" rel="noopener"><img src="${esc(p[5])}" alt="Graphical abstract: ${esc(p[2])}" loading="lazy"><span>Graphical abstract · CC BY-NC</span></a>` : ''}</li>`;

const RECENT = [0, 1, 2, 3, 4]; /* indices into PUBS shown on the home page */
document.getElementById('latest-pubs').innerHTML = RECENT.map(i => pubItem(PUBS[i])).join('');
/* news, blog style: a list of titles with a short summary (and a photo when there is one); each opens its own page at #news/<slug> */
const slug = s => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const linkLabel = u => /linkedin\.com/.test(u) ? 'View the original post on LinkedIn' : /msl\.ubc\.ca/.test(u) ? 'Read the article on msl.ubc.ca' : 'Read the paper';
document.getElementById('news-list').innerHTML = NEWS.map(n => `<article class="post-card${n.photo ? ' has-photo' : ''}">${n.photo ? `<a class="post-thumb" href="#news/${slug(n.title)}" tabindex="-1" aria-hidden="true"><img src="${esc(n.photo.split('\n')[0])}" alt="" loading="lazy"></a>` : ''}<div class="post-main"><div class="post-date">${esc(n.date)}</div><h2><a href="#news/${slug(n.title)}">${esc(n.title)}</a></h2><p>${linkify(n.summary)}</p><a class="post-more" href="#news/${slug(n.title)}">Read more</a></div></article>`).join('');
function renderPost(s) {
  const n = NEWS.find(x => slug(x.title) === s); if (!n) return false;
  document.getElementById('post-view').innerHTML = `<a class="post-back" href="#news">All news</a><article class="post"><div class="post-date">${esc(n.date)}</div><h1>${esc(n.title)}</h1>${n.photo ? `<figure class="post-photo${n.photo.includes('\n') ? ' multi' : ''}"><div class="post-photos">${n.photo.split('\n').filter(Boolean).map(u => `<img src="${esc(u)}" alt="${esc(n.caption || n.title)}">`).join('')}</div>${n.caption ? `<figcaption>${esc(n.caption)}</figcaption>` : ''}</figure>` : ''}<div class="post-body">${n.body.split('\n').map(t => `<p>${linkify(t)}</p>`).join('')}</div>${n.link ? `<p class="post-src"><a class="btn" href="${esc(n.link)}" target="_blank" rel="noopener">${linkLabel(n.link)}</a></p>` : ''}</article>`;
  document.title = n.title + ' · Gsponer Lab';
  return true;
}
const isPreprint = p => /preprint/i.test(p[3]);
const pubSection = (title, list) => {
  const ys = [...new Set(list.map(p => p[0]))];
  return `<section class="pub-section"><h2 class="sec-title">${esc(title)}<span class="n">${list.length}</span></h2>${ys.map(y => `<div class="year" data-y="${y}"><h3>${y}</h3><ul class="pubs">${list.filter(p => p[0] === y).map(pubItem).join('')}</ul></div>`).join('')}</section>`;
};
document.getElementById('pub-list').innerHTML = pubSection('Preprints', PUBS.filter(isPreprint)) + pubSection('Published papers', PUBS.filter(p => !isPreprint(p))) + '<p class="empty" id="pub-empty" hidden>No publications match.</p>';

/* software and databases: cards open their own page (#software/<slug>, #databases/<slug>) with the full description and links */
const swLinks = t => t.links.split('\n').filter(Boolean).map(l => { const i = l.search(/:\s(?=https?:\/\/)/); return i < 0 ? null : [l.slice(0, i), l.slice(i + 2).trim()]; }).filter(Boolean);
const entryCards = (list, base) => list.map(t => `<article class="card"><h3><a href="#${base}/${slug(t.name)}">${esc(t.name)}</a>${t.note === 'Retired' ? '<span class="pill">Retired</span>' : ''}</h3><p>${esc(t.summary)}</p>${t.note && t.note !== 'Retired' ? `<p><span class="todo">${esc(t.note)}</span></p>` : ''}<div class="links"><a href="#${base}/${slug(t.name)}">Details</a>${t.link ? `<a href="${esc(t.link)}" target="_blank" rel="noopener">Open ${base === 'software' ? 'the tool' : 'the database'}</a>` : ''}</div></article>`).join('');
document.getElementById('sw-list').innerHTML = entryCards(SW, 'software');
document.getElementById('db-list').innerHTML = entryCards(DB, 'databases');
function renderEntry(list, view, back, backLabel, s) {
  const t = list.find(x => slug(x.name) === s); if (!t) return false;
  const links = swLinks(t);
  document.getElementById(view).innerHTML = `<a class="post-back" href="#${back}">${backLabel}</a><article class="post"><h1>${esc(t.name)}${t.note === 'Retired' ? '<span class="pill">Retired</span>' : ''}</h1><p class="tool-sum">${esc(t.summary)}</p>${t.photo ? `<figure class="post-photo"><img src="${esc(t.photo)}" alt="${esc(t.caption || t.name)}">${t.caption ? `<figcaption>${esc(t.caption)}</figcaption>` : ''}</figure>` : ''}<div class="post-body">${t.body.split('\n').map(p => `<p${/^Cite:/.test(p) ? ' class="cite"' : ''}>${linkify(p)}</p>`).join('')}</div>${links.length ? `<h2 class="tool-h">Links</h2><ul class="tool-links">${links.map(([a, u]) => `<li><a href="${esc(u)}" target="_blank" rel="noopener">${esc(a)}</a><span>${esc(u.replace(/^https?:\/\//, '').split('/')[0])}</span></li>`).join('')}</ul>` : ''}</article>`;
  document.title = t.name + ' · Gsponer Lab';
  return true;
}
const renderTool = s => renderEntry(SW, 'tool-view', 'software', 'All software', s);
const renderDb = s => renderEntry(DB, 'db-view', 'databases', 'All databases', s);

/* ---------- publications filter + author expand ---------- */
const q = document.getElementById('pub-q'), cnt = document.getElementById('pub-count');
function filterPubs() {
  const t = q.value.trim().toLowerCase(); let n = 0;
  document.querySelectorAll('#pub-list .year').forEach(y => {
    let any = false;
    y.querySelectorAll('.pub').forEach(li => {
      const show = !t || (li.textContent + (li.querySelector('.rest') ? '' : '')).toLowerCase().includes(t);
      li.hidden = !show; if (show) { any = true; n++; }
    });
    y.hidden = !any;
  });
  document.querySelectorAll('#pub-list .pub-section').forEach(sec => { sec.hidden = ![...sec.querySelectorAll('.year')].some(y => !y.hidden); });
  document.getElementById('pub-empty').hidden = n > 0;
  cnt.textContent = n + ' of ' + PUBS.length + ' papers';
}
q.addEventListener('input', filterPubs); filterPubs();
document.addEventListener('click', e => {
  const b = e.target.closest('.more'); if (!b) return;
  const r = b.previousElementSibling; r.hidden = !r.hidden;
  b.textContent = r.hidden ? '+' + b.dataset.n + ' more' : 'show fewer';
});
document.querySelectorAll('.more').forEach(b => { b.dataset.n = b.textContent.replace(/\D/g,''); });

/* ---------- routing ---------- */
function show(p) {
  let page = p;
  if (p.startsWith('news/')) { page = renderPost(p.slice(5)) ? 'post' : 'news'; }
  else if (p.startsWith('software/')) { page = renderTool(p.slice(9)) ? 'tool' : 'software'; }
  else if (p.startsWith('databases/')) { page = renderDb(p.slice(10)) ? 'dbpage' : 'databases'; }
  else if (!PAGES.includes(p)) page = 'home';
  if (!['post', 'tool', 'dbpage'].includes(page)) document.title = 'Gsponer Lab';
  document.querySelectorAll('section[data-page]').forEach(s => { s.hidden = s.dataset.page !== page; });
  document.body.dataset.page = page;
  const nav = page === 'post' ? 'news' : page === 'tool' ? 'software' : page === 'dbpage' ? 'databases' : page;
  document.querySelectorAll('#nav a').forEach(a => { if (a.getAttribute('href') === '#' + nav) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  window.scrollTo(0, 0);
  bioFit();
}
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]'); if (!a) return;
  e.preventDefault(); const p = a.getAttribute('href').slice(1); show(p);
  try { history.replaceState(null, '', '#' + p); } catch (_) {}
});
window.addEventListener('hashchange', () => show(location.hash.slice(1)));
show(location.hash.slice(1));

/* ---------- seeker ---------- */
const found = document.getElementById('found'); let ft;
document.getElementById('peek').addEventListener('click', () => {
  found.classList.add('on'); clearTimeout(ft); ft = setTimeout(() => found.classList.remove('on'), 2200);
});

/* ---------- light / dark theme: follows the computer's setting; the button cycles System, Light, Dark ---------- */
(function () {
  const root = document.documentElement, btn = document.getElementById('theme');
  const ORDER = ['system', 'light', 'dark'], NAME = { system: 'follows your computer', light: 'light', dark: 'dark' };
  let mode = 'system';
  try { const s = localStorage.getItem('theme'); if (s === 'light' || s === 'dark') mode = s; } catch (_) {}
  function apply() {
    if (mode === 'system') root.removeAttribute('data-theme'); else root.dataset.theme = mode;
    const next = ORDER[(ORDER.indexOf(mode) + 1) % ORDER.length];
    btn.dataset.mode = mode;
    btn.title = 'Theme: ' + NAME[mode];
    btn.setAttribute('aria-label', 'Theme: ' + NAME[mode] + '. Switch to ' + (next === 'system' ? 'follow your computer' : next));
    window.dispatchEvent(new Event('themechange'));
  }
  btn.addEventListener('click', () => {
    mode = ORDER[(ORDER.indexOf(mode) + 1) % ORDER.length];
    try { if (mode === 'system') localStorage.removeItem('theme'); else localStorage.setItem('theme', mode); } catch (_) {}
    apply();
  });
  // while following the computer, a change in its setting updates the page (and the 3D viewer) at once
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { if (mode === 'system') apply(); });
  apply();
})();
