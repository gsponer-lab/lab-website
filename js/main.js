/* ---------- render ---------- */
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const initials = n => n.split(' ').filter(Boolean).map(w => w[0]).slice(0,2).join('');
const photo = p => p.photo ? `<div class="photo"><img src="${esc(p.photo)}" alt="${esc(p.name)}"></div>` : `<div class="photo" role="img" aria-label="Photo placeholder for ${esc(p.name)}">${initials(p.name)}<span class="tag">photo</span></div>`;
const links = p => `<div class="links">${p.email ? `<a href="mailto:${esc(p.email)}">${esc(p.email)}</a>` : '<span class="todo">email</span>'}${p.linkedin ? `<a href="${esc(p.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>` : '<span class="todo">LinkedIn</span>'}</div>`;

document.getElementById('pi').innerHTML = `<div class="pi">${photo(PI)}<div>
  <div class="role">${esc(PI.role)}</div><h2>${esc(PI.name)}</h2>
  <div class="prose">${PI.bio.map(t => `<p>${esc(t)}</p>`).join('')}</div>
  <dl class="facts"><dt>Office</dt><dd>${esc(PI.office)}</dd><dt>Honours</dt><dd>${esc(PI.honours)}</dd></dl>
  ${links(PI)}</div></div>`;

document.getElementById('groups').innerHTML = GROUPS.map(g => `<div class="group"><h2>${esc(g.title)}</h2><div class="grid">${g.people.map(p => `<article class="person">${photo(p)}<div><h3>${esc(p.name)}</h3><div class="role">${esc(p.role)}</div></div>${p.bio ? `<p>${esc(p.bio)}</p>` : '<p><span class="todo">add a short description</span></p>'}${links(p)}</article>`).join('')}</div></div>`).join('');

/* news text: blank-line-free paragraphs split on \n; bare web addresses become links */
const linkify = s => esc(s).replace(/https?:\/\/[^\s<]+/g, u => `<a href="${u}" target="_blank" rel="noopener">${u}</a>`);
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
document.getElementById('news-list').innerHTML = NEWS.map(n => `<div class="year"><h2>${n[0]}</h2><div class="pub"><div class="t">${esc(n[1])}</div><div class="au">${n[2].split('\n').map(t => `<p>${linkify(t)}</p>`).join('')}</div></div></div>`).join('') + '<div class="year"><h2>&nbsp;</h2><div class="pub"><span class="todo">add news item</span></div></div>';
const isPreprint = p => /preprint/i.test(p[3]);
const pubSection = (title, list) => {
  const ys = [...new Set(list.map(p => p[0]))];
  return `<section class="pub-section"><h2 class="sec-title">${esc(title)}<span class="n">${list.length}</span></h2>${ys.map(y => `<div class="year" data-y="${y}"><h3>${y}</h3><ul class="pubs">${list.filter(p => p[0] === y).map(pubItem).join('')}</ul></div>`).join('')}</section>`;
};
document.getElementById('pub-list').innerHTML = pubSection('Preprints', PUBS.filter(isPreprint)) + pubSection('Published papers', PUBS.filter(p => !isPreprint(p))) + '<p class="empty" id="pub-empty" hidden>No publications match.</p>';

const cardItem = (c, kind) => `<article class="card"><h3>${esc(c[0])}${c[3] && kind === 'db' ? `<span class="pill">${esc(c[3])}</span>` : ''}</h3><p>${esc(c[1])}</p>${kind === 'sw' && c[3] ? `<p><span class="todo">${esc(c[3])}</span></p>` : ''}<div class="links">${c[2] ? `<a href="${esc(c[2])}" target="_blank" rel="noopener">Open</a>` : ''}</div></article>`;
document.getElementById('sw-list').innerHTML = SW.map(c => cardItem(c, 'sw')).join('');
document.getElementById('db-list').innerHTML = DB.map(c => cardItem(c, 'db')).join('');

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
  if (!PAGES.includes(p)) p = 'home';
  document.querySelectorAll('section[data-page]').forEach(s => { s.hidden = s.dataset.page !== p; });
  document.body.dataset.page = p;
  document.querySelectorAll('#nav a').forEach(a => { if (a.getAttribute('href') === '#' + p) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  window.scrollTo(0, 0);
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
