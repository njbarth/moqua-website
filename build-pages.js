#!/usr/bin/env node
/**
 * Moqua Foundation — Static Page Generator
 * Reads moqua-content.json and generates all bio + centurion + event HTML pages.
 * Run: node build-pages.js
 */

const fs   = require('fs');
const path = require('path');

const ROOT    = path.join(__dirname, 'moqua-org');
const CONTENT = JSON.parse(fs.readFileSync(path.join(__dirname, 'moqua-content.json'), 'utf8'));

// ---- Helpers ----
function esc(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function bioToParagraphs(text) {
  if (!text) return '<p><!-- TODO: Biography text needed --></p>';
  return text
    .split(/\n\n+/)
    .map(p => `<p>${esc(p.trim())}</p>`)
    .join('\n          ');
}

function navHtml(depth, active) {
  const prefix = '../'.repeat(depth);
  return `
<div class="oa-band">
  <span class="oa-text">Order of the Arrow · Owasippe Lodge #7 · Chicago Area Council · BSA</span>
</div>
<nav class="main-nav">
  <a class="nav-brand-wrap" href="${prefix}index.html">
    <div class="nav-mark"><div class="nav-mark-inner"></div></div>
    <div><div class="nav-name">Moqua Foundation</div><div class="nav-sub">Owasippe Lodge #7 · Since 1921</div></div>
  </a>
  <button class="nav-toggle" aria-label="Open menu"><span></span><span></span><span></span></button>
  <ul class="nav-links">
    <li><a href="${prefix}about/index.html"${active==='about'?' class="active"':''}>About</a></li>
    <li><a href="${prefix}biographies/index.html"${active==='biographies'?' class="active"':''}>Biographies</a></li>
    <li><a href="${prefix}centurions/index.html"${active==='centurions'?' class="active"':''}>Centurions</a></li>
    <li><a href="${prefix}events/index.html"${active==='events'?' class="active"':''}>Events</a></li>
    <li><a href="${prefix}guest-lodge/index.html"${active==='guest-lodge'?' class="active"':''}>Guest Lodge</a></li>
    <li><a href="${prefix}contact/index.html"${active==='contact'?' class="active"':''}>Contact</a></li>
  </ul>
</nav>`;
}

function footerHtml() {
  return `<footer class="site-footer">
  <div><div class="ft-brand">Moqua Foundation</div><div class="ft-oa">Order of the Arrow · Owasippe Lodge #7 · Chicago Area Council · BSA</div></div>
  <div class="ft-copy">© 2026 Moqua Foundation · All rights reserved</div>
</footer>`;
}

function headHtml(title, desc, depth) {
  const prefix = '../'.repeat(depth);
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)} — Moqua Foundation</title>
<meta name="description" content="${esc(desc)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@300;400;700&family=Roboto+Condensed:ital,wght@0,400;0,700;1,400&family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${prefix}css/main.css">
</head>
<body>`;
}

// ---- Build Bio Profile Pages ----
function buildBioPages() {
  const bios = CONTENT.biographies;

  bios.forEach((bio, idx) => {
    const prev = bios[(idx - 1 + bios.length) % bios.length];
    const next = bios[(idx + 1) % bios.length];
    const img  = (bio.images && bio.images[0]) ? bio.images[0].url : '';
    const imgCaption = (bio.images && bio.images[0]) ? bio.images[0].caption || bio.name : bio.name;
    const bornVal    = bio.vigil_date || '';
    const diedLine   = bio.died ? `<div class="sidebar-fact"><div class="sf-key">Died</div><div class="sf-val">${esc(bio.died)}</div></div>` : '';
    const vigilLine  = bio.vigil_name ? `<div class="sidebar-fact"><div class="sf-key">Vigil name</div><div class="sf-val">${esc(bio.vigil_name)}</div></div>` : '';
    const transLine  = bio.vigil_translation ? `<div class="sidebar-fact"><div class="sf-key">Meaning</div><div class="sf-val">"${esc(bio.vigil_translation)}"</div></div>` : '';
    const vigilDateLine = bornVal ? `<div class="sidebar-fact"><div class="sf-key">Vigil induction</div><div class="sf-val">${esc(bornVal)}</div></div>` : '';

    // Determine dinner year from bio.year (the dinner year from content) or fallback
    const dinnerYear = bio.year || '';

    // Extra photos
    const extraPhotos = (bio.images && bio.images.length > 1)
      ? bio.images.slice(1).map(im => `
      <div style="margin-top:16px">
        <img src="${esc(im.url)}" alt="${esc(im.caption||bio.name)}" style="width:100%;border-radius:3px;border:1px solid var(--border)" />
        <div style="font-family:'Roboto Condensed',sans-serif;font-size:9px;color:rgba(0,0,0,.4);padding:4px 2px;font-style:italic">${esc(im.caption||'')}</div>
      </div>`).join('')
      : '';

    const vigil_display = bio.vigil_name || 'Vigil Honor';
    const born_display  = bio.born || '';

    const html = `${headHtml(bio.name, `Biography of ${bio.name}, Vigil Honor member of Owasippe Lodge #7, inducted ${dinnerYear}.`, 2)}
${navHtml(2, 'biographies')}

<div class="profile-hero">
  <div class="profile-photo-col">
    <img class="profile-photo"
         src="${esc(img)}"
         alt="${esc(bio.name)}"
         onerror="this.style.background='#D4E2F4';this.removeAttribute('src')" />
    <div class="profile-photo-caption">${esc(imgCaption)}</div>
  </div>
  <div class="profile-info-col">
    <div class="profile-bc">
      <a href="../../index.html">Home</a> ·
      <a href="../index.html">Biographies</a> ·
      <span>${esc(bio.name)}</span>
    </div>
    <h1 class="profile-name">${esc(bio.name)}</h1>
    <div class="vigil-wrap">
      <div class="vigil-badge"><span class="vigil-badge-text">Vigil Name</span></div>
      <div>
        <div class="vigil-name">${esc(vigil_display)}</div>
        ${bio.vigil_translation ? `<div class="vigil-trans">"${esc(bio.vigil_translation)}"</div>` : ''}
      </div>
    </div>
    <div class="profile-meta-grid">
      ${born_display ? `<div class="pmi"><div class="pmi-label">Born</div><div class="pmi-val">${esc(born_display)}</div></div>` : '<div class="pmi"><div class="pmi-label">Lodge</div><div class="pmi-val">Owasippe #7</div></div>'}
      <div class="pmi"><div class="pmi-label">Honored</div><div class="pmi-val">${esc(dinnerYear)} Dinner</div></div>
      <div class="pmi"><div class="pmi-label">Lodge</div><div class="pmi-val">Owasippe #7</div></div>
    </div>
  </div>
</div>

<div class="profile-body-area">
  <div class="profile-content">
    <div class="eyebrow">Biography</div>
    <div class="sec-title">Life &amp; Service</div>
    <div class="bio-text">
      ${bioToParagraphs(bio.bio)}
    </div>
  </div>
  <div class="profile-sidebar">
    <div class="sidebar-label" style="margin-bottom:14px">Record</div>
    <div class="sidebar-fact"><div class="sf-key">Full name</div><div class="sf-val">${esc(bio.name)}</div></div>
    ${born_display ? `<div class="sidebar-fact"><div class="sf-key">Born</div><div class="sf-val">${esc(born_display)}</div></div>` : ''}
    ${diedLine}
    ${vigilLine}
    ${transLine}
    ${vigilDateLine}
    <div class="sidebar-fact"><div class="sf-key">Honored at</div><div class="sf-val">${esc(dinnerYear)} Annual Dinner</div></div>
    <div class="sidebar-fact"><div class="sf-key">Lodge</div><div class="sf-val">Owasippe Lodge #7</div></div>
    ${extraPhotos}
    <div style="margin-top:24px">
      <div class="sidebar-label" style="margin-bottom:10px">Other honorees</div>
      <a class="sidebar-next-card" href="../${prev.slug}/index.html">
        <img src="${esc((prev.images && prev.images[0]) ? prev.images[0].url : '')}" alt="${esc(prev.name)}" />
        <div><div class="snc-label">← Previous</div><div class="snc-name">${esc(prev.name)}</div></div>
      </a>
      <a class="sidebar-next-card" href="../${next.slug}/index.html">
        <img src="${esc((next.images && next.images[0]) ? next.images[0].url : '')}" alt="${esc(next.name)}" />
        <div><div class="snc-label">Next →</div><div class="snc-name">${esc(next.name)}</div></div>
      </a>
    </div>
  </div>
</div>

${footerHtml()}
<script src="../../js/main.js"></script>
</body>
</html>`;

    const dir = path.join(ROOT, 'biographies', bio.slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), html);
    console.log(`  bio: biographies/${bio.slug}/index.html`);
  });
}

// ---- Build Centurion Profile Pages ----
function buildCenturionPages() {
  const cents = CONTENT.centurions;

  cents.forEach((cent, idx) => {
    const prev = cents[(idx - 1 + cents.length) % cents.length];
    const next = cents[(idx + 1) % cents.length];
    const img  = cent.img || '';
    const vigil_display = cent.vigil_name || 'Centurion Award';

    const html = `${headHtml(cent.name, `${cent.name} — Centurion Award honoree, Owasippe Lodge #7.`, 2)}
${navHtml(2, 'centurions')}

<div class="profile-hero">
  <div class="profile-photo-col">
    ${img
      ? `<img class="profile-photo" src="${esc(img)}" alt="${esc(cent.name)}" onerror="this.style.background='#D4E2F4';this.removeAttribute('src')" />`
      : `<div class="profile-photo" style="display:flex;align-items:center;justify-content:center;"><span style="font-family:'Roboto Condensed',sans-serif;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:rgba(255,255,255,.4)">Photo TBD</span></div>`
    }
    <div class="profile-photo-caption">${esc(cent.name)}</div>
  </div>
  <div class="profile-info-col">
    <div class="profile-bc">
      <a href="../../index.html">Home</a> ·
      <a href="../index.html">Centurions</a> ·
      <span>${esc(cent.name)}</span>
    </div>
    <h1 class="profile-name">${esc(cent.name)}</h1>
    <div class="vigil-wrap">
      <div class="vigil-badge"><span class="vigil-badge-text">Centurion Award</span></div>
      <div>
        <div class="vigil-name">${esc(vigil_display)}</div>
        ${cent.vigil_translation ? `<div class="vigil-trans">"${esc(cent.vigil_translation)}"</div>` : ''}
      </div>
    </div>
    <div class="profile-meta-grid">
      <div class="pmi"><div class="pmi-label">Award</div><div class="pmi-val">Centurion</div></div>
      <div class="pmi"><div class="pmi-label">Lodge</div><div class="pmi-val">Owasippe #7</div></div>
      <div class="pmi"><div class="pmi-label">Council</div><div class="pmi-val">Chicago Area</div></div>
    </div>
  </div>
</div>

<div class="profile-body-area">
  <div class="profile-content">
    <div class="eyebrow">Centurion Award</div>
    <div class="sec-title">Life &amp; Service</div>
    <div class="bio-text">
      ${bioToParagraphs(cent.bio)}
    </div>
  </div>
  <div class="profile-sidebar">
    <div class="sidebar-label" style="margin-bottom:14px">Record</div>
    <div class="sidebar-fact"><div class="sf-key">Full name</div><div class="sf-val">${esc(cent.name)}</div></div>
    ${cent.born ? `<div class="sidebar-fact"><div class="sf-key">Born</div><div class="sf-val">${esc(cent.born)}</div></div>` : ''}
    ${cent.vigil_name ? `<div class="sidebar-fact"><div class="sf-key">Vigil name</div><div class="sf-val">${esc(cent.vigil_name)}</div></div>` : ''}
    ${cent.vigil_translation ? `<div class="sidebar-fact"><div class="sf-key">Meaning</div><div class="sf-val">"${esc(cent.vigil_translation)}"</div></div>` : ''}
    <div class="sidebar-fact"><div class="sf-key">Award</div><div class="sf-val">Centurion Award</div></div>
    <div class="sidebar-fact"><div class="sf-key">Lodge</div><div class="sf-val">Owasippe Lodge #7</div></div>
    <div style="margin-top:24px">
      <div class="sidebar-label" style="margin-bottom:10px">Other honorees</div>
      <a class="sidebar-next-card" href="../${prev.slug}/index.html">
        <div style="width:42px;height:50px;background:var(--blue-lt);border-radius:2px;flex-shrink:0;display:flex;align-items:center;justify-content:center;">
          <span style="font-family:'Roboto Condensed',sans-serif;font-size:8px;font-weight:700;text-transform:uppercase;color:var(--gray-lt)">#7</span>
        </div>
        <div><div class="snc-label">← Previous</div><div class="snc-name">${esc(prev.name)}</div></div>
      </a>
      <a class="sidebar-next-card" href="../${next.slug}/index.html">
        <div style="width:42px;height:50px;background:var(--blue-lt);border-radius:2px;flex-shrink:0;display:flex;align-items:center;justify-content:center;">
          <span style="font-family:'Roboto Condensed',sans-serif;font-size:8px;font-weight:700;text-transform:uppercase;color:var(--gray-lt)">#7</span>
        </div>
        <div><div class="snc-label">Next →</div><div class="snc-name">${esc(next.name)}</div></div>
      </a>
    </div>
  </div>
</div>

${footerHtml()}
<script src="../../js/main.js"></script>
</body>
</html>`;

    const dir = path.join(ROOT, 'centurions', cent.slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), html);
    console.log(`  cent: centurions/${cent.slug}/index.html`);
  });
}

// ---- Build Event Detail Pages ----
function buildEventPages() {
  const events = CONTENT.events;
  // Build a lookup of bio data by honoree name
  const bioByName = {};
  (CONTENT.biographies || []).forEach(b => { bioByName[b.name] = b; });

  events.forEach((ev, idx) => {
    const prevEv = events[(idx + 1) % events.length];
    const nextEv = events[(idx - 1 + events.length) % events.length];

    const honoreeCards = ev.honorees.map(name => {
      const b = bioByName[name];
      if (b) {
        const img = (b.images && b.images[0]) ? b.images[0].url : '';
        return `
        <a class="hf-card" href="../../biographies/${b.slug}/index.html">
          <img class="hf-img" src="${esc(img)}" alt="${esc(b.name)}" onerror="this.style.background='var(--blue-lt)';this.removeAttribute('src')" />
          <div class="hf-body">
            <div class="hf-yr">${esc(ev.year)} Honoree</div>
            <div class="hf-name">${esc(b.name)}</div>
            <div class="hf-vigil">${esc(b.vigil_name || 'Vigil Honor')}</div>
            <div class="hf-link">Read biography →</div>
          </div>
        </a>`;
      } else {
        return `
        <div class="hf-card">
          <div class="hf-img" style="background:var(--blue-lt);display:flex;align-items:center;justify-content:center;width:110px;height:140px;">
            <span style="font-family:'Roboto Condensed',sans-serif;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--gray-lt)">Photo TBD</span>
          </div>
          <div class="hf-body">
            <div class="hf-yr">${esc(ev.year)} Honoree</div>
            <div class="hf-name">${esc(name)}</div>
            <div class="hf-vigil">Vigil Honor</div>
            <!-- TODO: No bio page found for ${esc(name)} — create if available -->
          </div>
        </div>`;
      }
    }).join('');

    const photosLink = ev.photos_external
      ? `<a class="view-photos-btn" href="${esc(ev.photos_external)}" target="_blank" rel="noopener">View photo gallery →</a>`
      : `<a class="view-photos-btn" href="${ev.year}/gallery/index.html">View photo gallery →</a>`;

    const honoreeLastNames = ev.honorees.map(h => h.split(' ').slice(-1)[0]).join(' · ');
    const venueShort = ev.venue.includes('Mayor') ? "The Mayor's Mansion" : 'European Chalet';

    const html = `${headHtml(`${ev.year} Vigil Alumni Annual Dinner`, `The ${ev.year} Vigil Alumni Annual Dinner — Owasippe Lodge #7, honoring ${ev.honorees.join(' and ')}.`, 2)}
${navHtml(2, 'events')}

<div class="event-hero">
  <img class="event-hero-img"
       src="${esc(ev.img)}"
       alt="${esc(ev.year)} Vigil Alumni Dinner"
       onerror="this.style.background='var(--blue-dk)';this.removeAttribute('src')" />
  <div class="event-hero-overlay">
    <div>
      <div class="breadcrumb" style="color:rgba(255,255,255,.45);margin-bottom:8px">
        <a href="../../index.html" style="color:rgba(255,255,255,.45)">Home</a> ·
        <a href="../index.html" style="color:rgba(255,255,255,.75)">Events</a> ·
        <span style="color:rgba(255,255,255,.75)">${esc(ev.year)} Annual Dinner</span>
      </div>
      <h1 class="event-title-hero">${esc(ev.year)} Vigil Alumni<br>Annual Dinner</h1>
      <div class="event-date-pill"><span class="event-date-pill-text">${esc(ev.date)}</span></div>
    </div>
    <div class="event-yr-badge">${esc(ev.year)}</div>
  </div>
</div>

<div class="event-meta-bar">
  <div class="emi">
    <div class="emi-label">Date</div>
    <div class="emi-val">${esc(ev.date)}</div>
    <div class="emi-sub">Saturday evening</div>
  </div>
  <div class="emi">
    <div class="emi-label">Venue</div>
    <div class="emi-val">${esc(venueShort)}</div>
    <div class="emi-sub">5445 S. Harlem Ave, Chicago</div>
  </div>
  <div class="emi">
    <div class="emi-label">Cost</div>
    <div class="emi-val">${esc(ev.cost)}</div>
    <div class="emi-sub">Dinner included</div>
  </div>
  <div class="emi">
    <div class="emi-label">Honorees</div>
    <div class="emi-val">${ev.honorees.length} members</div>
    <div class="emi-sub">${esc(honoreeLastNames)}</div>
  </div>
</div>

<div class="with-sidebar" style="border-top:1px solid var(--border)">
  <div class="event-content-area">
    <div class="eyebrow">Vigil Honor</div>
    <div class="sec-title">${esc(ev.year)} Honorees</div>
    <div class="honoree-pair">
      ${honoreeCards}
    </div>
    <div class="eyebrow">Schedule</div>
    <div class="sec-title">Evening Program</div>
    <div class="program-timeline">
      <div class="prog-item">
        <div class="prog-time">${esc(ev.schedule ? ev.schedule.fellowship : '5:30 PM')}</div>
        <div class="prog-desc">Fellowship — cocktail hour and informal gathering of Vigil alumni</div>
      </div>
      <div class="prog-item">
        <div class="prog-time">${esc(ev.schedule ? ev.schedule.dinner : '7:00 PM')}</div>
        <div class="prog-desc">Dinner — seated dinner service for all guests</div>
      </div>
      <div class="prog-item">
        <div class="prog-time">${esc(ev.schedule ? ev.schedule.program : '8:00 PM')}</div>
        <div class="prog-desc">Program — formal recognition ceremony honoring the ${esc(ev.year)} Vigil inductees</div>
      </div>
      <div class="prog-item">
        <div class="prog-time">${esc(ev.schedule ? ev.schedule.conclusion : '9:15 PM')}</div>
        <div class="prog-desc">Conclusion</div>
      </div>
    </div>
  </div>
  <div class="sidebar">
    <div class="sidebar-label" style="margin-bottom:14px">Event details</div>
    <div class="esd-item"><div class="esd-key">Date</div><div class="esd-val">${esc(ev.date)}</div></div>
    <div class="esd-item"><div class="esd-key">Venue</div><div class="esd-val">${esc(ev.venue)}</div></div>
    <div class="esd-item"><div class="esd-key">Address</div><div class="esd-val">${esc(ev.address)}</div></div>
    <div class="esd-item"><div class="esd-key">Ticket cost</div><div class="esd-val">${esc(ev.cost)}</div></div>
    ${ev.photos_external ? `<div class="esd-item"><div class="esd-key">Photography</div><div class="esd-val">Nick Barth Photography</div></div>` : '<!-- TODO: Add photo credit if available -->'}
    ${photosLink}
    <div class="yr-nav">
      <a class="yr-nav-btn" href="../${prevEv.year}/index.html">← ${esc(prevEv.year)}</a>
      <a class="yr-nav-btn" href="../${nextEv.year}/index.html">${esc(nextEv.year)} →</a>
    </div>
  </div>
</div>

${footerHtml()}
<script src="../../js/main.js"></script>
</body>
</html>`;

    const dir = path.join(ROOT, 'events', ev.year);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), html);
    console.log(`  event: events/${ev.year}/index.html`);

    // Stub gallery page
    const galleryDir = path.join(dir, 'gallery');
    fs.mkdirSync(galleryDir, { recursive: true });
    const galleryHtml = `${headHtml(`${ev.year} Dinner Photos`, `Photo gallery from the ${ev.year} Vigil Alumni Annual Dinner, Owasippe Lodge #7.`, 3)}
${navHtml(3, 'events')}

<div class="page-header">
  <div class="breadcrumb">
    <a href="../../../index.html">Home</a> ·
    <a href="../../index.html">Events</a> ·
    <a href="../index.html">${esc(ev.year)} Dinner</a> ·
    <span>Gallery</span>
  </div>
  <h1 class="page-title">${esc(ev.year)} Dinner Photos</h1>
  <p class="page-sub">${esc(ev.date)} · ${esc(venueShort)} · Chicago</p>
</div>

<div style="padding:36px 36px 20px">
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px">
    <div>
      <div class="eyebrow">Photo gallery</div>
      <div class="sec-title">${esc(ev.year)} Annual Dinner</div>
    </div>
    <a class="btn-outline" href="../index.html">← Back to dinner details</a>
  </div>
  ${ev.photos_external
    ? `<div style="background:var(--blue-lt);border:1px solid var(--blue-pale);border-radius:4px;padding:24px 28px;margin-bottom:32px;display:flex;align-items:center;justify-content:space-between;gap:20px">
    <div>
      <div class="eyebrow">External gallery</div>
      <div style="font-family:'Roboto Slab',serif;font-size:16px;font-weight:700;color:var(--blue);margin-bottom:6px">Photos by Nick Barth Photography</div>
      <div style="font-size:13px;font-weight:300;color:var(--gray)">The full photo gallery for the ${esc(ev.year)} dinner is hosted on the photographer's website.</div>
    </div>
    <a class="btn-blue" href="${esc(ev.photos_external)}" target="_blank" rel="noopener">View full gallery →</a>
  </div>`
    : `<!-- TODO: Add gallery images for ${ev.year} when available -->\n  <div style="background:var(--tan-lt);border:1px dashed var(--tan-dk);border-radius:4px;padding:40px;text-align:center;color:var(--gray-lt)">
    <div style="font-family:'Roboto Condensed',sans-serif;font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px">Gallery coming soon</div>
    <div style="font-size:13px">Photos from the ${ev.year} dinner will be added here.</div>
  </div>`
  }
</div>

${footerHtml()}
<script src="../../../js/main.js"></script>
</body>
</html>`;
    fs.writeFileSync(path.join(galleryDir, 'index.html'), galleryHtml);
    console.log(`  gallery: events/${ev.year}/gallery/index.html`);
  });
}

// ---- Run ----
console.log('\nMoqua Foundation — Static Page Generator');
console.log('=========================================');
console.log('Building biography profile pages...');
buildBioPages();
console.log('Building centurion profile pages...');
buildCenturionPages();
console.log('Building event detail pages...');
buildEventPages();
console.log('\nDone! All pages generated.\n');
