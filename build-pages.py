#!/usr/bin/env python3
"""
Moqua Foundation — Static Page Generator (Python 3)
Reads moqua-content.json and generates all bio, centurion and event HTML pages.
Run: python3 build-pages.py
"""

import json, os, html as html_mod

ROOT    = os.path.join(os.path.dirname(__file__), 'moqua-org')
CONTENT = json.load(open(os.path.join(os.path.dirname(__file__), 'moqua-content.json'), encoding='utf-8'))


def esc(s):
    return html_mod.escape(str(s)) if s else ''

def bio_to_paragraphs(text):
    if not text:
        return '<p><!-- TODO: Biography text needed --></p>'
    paras = [p.strip() for p in text.split('\n\n') if p.strip()]
    return '\n          '.join(f'<p>{esc(p)}</p>' for p in paras)

def nav_html(depth, active):
    prefix = '../' * depth
    def a(section, label):
        cls = ' class="active"' if active == section else ''
        return f'<li><a href="{prefix}{section}/index.html"{cls}>{label}</a></li>'
    return f"""
<div class="oa-band">
  <span class="oa-text">Order of the Arrow · Owasippe Lodge #7 · Chicago Area Council · BSA</span>
</div>
<nav class="main-nav">
  <a class="nav-brand-wrap" href="{prefix}index.html">
    <div class="nav-mark"><div class="nav-mark-inner"></div></div>
    <div><div class="nav-name">Moqua Foundation</div><div class="nav-sub">Owasippe Lodge #7 · Since 1921</div></div>
  </a>
  <button class="nav-toggle" aria-label="Open menu"><span></span><span></span><span></span></button>
  <ul class="nav-links">
    {a('about','About')}
    {a('biographies','Biographies')}
    {a('centurions','Centurions')}
    {a('events','Events')}
    {a('guest-lodge','Guest Lodge')}
    {a('contact','Contact')}
  </ul>
</nav>"""

def footer_html():
    return """<footer class="site-footer">
  <div><div class="ft-brand">Moqua Foundation</div><div class="ft-oa">Order of the Arrow · Owasippe Lodge #7 · Chicago Area Council · BSA</div></div>
  <div class="ft-copy">© 2026 Moqua Foundation · All rights reserved</div>
</footer>"""

def head_html(title, desc, depth):
    prefix = '../' * depth
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{esc(title)} — Moqua Foundation</title>
<meta name="description" content="{esc(desc)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@300;400;700&family=Roboto+Condensed:ital,wght@0,400;0,700;1,400&family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{prefix}css/main.css">
</head>
<body>"""


# =====================================================================
# BIO PROFILE PAGES
# =====================================================================
def build_bio_pages():
    bios = CONTENT['biographies']
    # Build a name→year lookup from the events array
    name_to_year = {}
    for ev in CONTENT.get('events', []):
        for honoree in ev.get('honorees', []):
            name_to_year[honoree] = ev['year']

    for idx, bio in enumerate(bios):
        prev_bio = bios[(idx - 1) % len(bios)]
        next_bio = bios[(idx + 1) % len(bios)]

        images    = bio.get('images', [])
        img       = images[0]['url'] if images else ''
        img_cap   = images[0].get('caption', bio['name']) if images else bio['name']
        born      = bio.get('born', '')
        died      = bio.get('died', '')
        vigil_name= bio.get('vigil_name', '')
        vigil_trans = bio.get('vigil_translation', '')
        vigil_date  = bio.get('vigil_date', '')
        dinner_year = name_to_year.get(bio['name'], bio.get('year', ''))
        slug      = bio['slug']

        # Prev / next nav thumbnails
        prev_img = prev_bio.get('images', [{}])[0].get('url','') if prev_bio.get('images') else ''
        next_img = next_bio.get('images', [{}])[0].get('url','') if next_bio.get('images') else ''

        # Extra photos
        extra_photos_html = ''
        for im in images[1:]:
            extra_photos_html += f"""
      <div style="margin-top:16px">
        <img src="{esc(im.get('url',''))}" alt="{esc(im.get('caption', bio['name']))}"
             style="width:100%;border-radius:3px;border:1px solid var(--border)" />
        <div style="font-family:'Roboto Condensed',sans-serif;font-size:9px;color:rgba(0,0,0,.4);padding:4px 2px;font-style:italic">{esc(im.get('caption',''))}</div>
      </div>"""

        born_line = f'<div class="pmi"><div class="pmi-label">Born</div><div class="pmi-val">{esc(born)}</div></div>' if born else '<div class="pmi"><div class="pmi-label">Lodge</div><div class="pmi-val">Owasippe #7</div></div>'
        died_line = f'<div class="sidebar-fact"><div class="sf-key">Died</div><div class="sf-val">{esc(died)}</div></div>' if died else ''
        vigil_s_line = f'<div class="sidebar-fact"><div class="sf-key">Vigil name</div><div class="sf-val">{esc(vigil_name)}</div></div>' if vigil_name else ''
        trans_line = f'<div class="sidebar-fact"><div class="sf-key">Meaning</div><div class="sf-val">"{esc(vigil_trans)}"</div></div>' if vigil_trans else ''
        vigil_date_line = f'<div class="sidebar-fact"><div class="sf-key">Vigil induction</div><div class="sf-val">{esc(vigil_date)}</div></div>' if vigil_date else ''
        trans_display = f'<div class="vigil-trans">"{esc(vigil_trans)}"</div>' if vigil_trans else ''
        born_sidebar = f'<div class="sidebar-fact"><div class="sf-key">Born</div><div class="sf-val">{esc(born)}</div></div>' if born else ''

        page = f"""{head_html(bio['name'], f"Biography of {bio['name']}, Vigil Honor member of Owasippe Lodge #7.", 2)}
{nav_html(2, 'biographies')}

<div class="profile-hero">
  <div class="profile-photo-col">
    <img class="profile-photo"
         src="{esc(img)}"
         alt="{esc(bio['name'])}"
         onerror="this.style.background='#D4E2F4';this.removeAttribute('src')" />
    <div class="profile-photo-caption">{esc(img_cap)}</div>
  </div>
  <div class="profile-info-col">
    <div class="profile-bc">
      <a href="../../index.html">Home</a> ·
      <a href="../index.html">Biographies</a> ·
      <span>{esc(bio['name'])}</span>
    </div>
    <h1 class="profile-name">{esc(bio['name'])}</h1>
    <div class="vigil-wrap">
      <div class="vigil-badge"><span class="vigil-badge-text">Vigil Name</span></div>
      <div>
        <div class="vigil-name">{esc(vigil_name or 'Vigil Honor')}</div>
        {trans_display}
      </div>
    </div>
    <div class="profile-meta-grid">
      {born_line}
      <div class="pmi"><div class="pmi-label">Honored</div><div class="pmi-val">{esc(dinner_year)} Dinner</div></div>
      <div class="pmi"><div class="pmi-label">Lodge</div><div class="pmi-val">Owasippe #7</div></div>
    </div>
  </div>
</div>

<div class="profile-body-area">
  <div class="profile-content">
    <div class="eyebrow">Biography</div>
    <div class="sec-title">Life &amp; Service</div>
    <div class="bio-text">
      {bio_to_paragraphs(bio.get('bio',''))}
    </div>
  </div>
  <div class="profile-sidebar">
    <div class="sidebar-label" style="margin-bottom:14px">Record</div>
    <div class="sidebar-fact"><div class="sf-key">Full name</div><div class="sf-val">{esc(bio['name'])}</div></div>
    {born_sidebar}
    {died_line}
    {vigil_s_line}
    {trans_line}
    {vigil_date_line}
    <div class="sidebar-fact"><div class="sf-key">Honored at</div><div class="sf-val">{esc(dinner_year)} Annual Dinner</div></div>
    <div class="sidebar-fact"><div class="sf-key">Lodge</div><div class="sf-val">Owasippe Lodge #7</div></div>
    {extra_photos_html}
    <div style="margin-top:24px">
      <div class="sidebar-label" style="margin-bottom:10px">Other honorees</div>
      <a class="sidebar-next-card" href="../{prev_bio['slug']}/index.html">
        <img src="{esc(prev_img)}" alt="{esc(prev_bio['name'])}" onerror="this.style.background='var(--blue-lt)';this.removeAttribute('src')" />
        <div><div class="snc-label">← Previous</div><div class="snc-name">{esc(prev_bio['name'])}</div></div>
      </a>
      <a class="sidebar-next-card" href="../{next_bio['slug']}/index.html">
        <img src="{esc(next_img)}" alt="{esc(next_bio['name'])}" onerror="this.style.background='var(--blue-lt)';this.removeAttribute('src')" />
        <div><div class="snc-label">Next →</div><div class="snc-name">{esc(next_bio['name'])}</div></div>
      </a>
    </div>
  </div>
</div>

{footer_html()}
<script src="../../js/main.js"></script>
</body>
</html>"""

        out_dir = os.path.join(ROOT, 'biographies', slug)
        os.makedirs(out_dir, exist_ok=True)
        with open(os.path.join(out_dir, 'index.html'), 'w', encoding='utf-8') as f:
            f.write(page)
        print(f'  bio: biographies/{slug}/index.html')


# =====================================================================
# CENTURION PROFILE PAGES
# =====================================================================
def build_centurion_pages():
    cents = CONTENT['centurions']['profiles']
    for idx, cent in enumerate(cents):
        prev_c = cents[(idx - 1) % len(cents)]
        next_c = cents[(idx + 1) % len(cents)]

        img   = cent.get('img', '')
        slug  = cent['slug']
        vigil_name = cent.get('vigil_name', '')
        vigil_trans = cent.get('vigil_translation', '')
        born  = cent.get('born', '')

        img_block = f'<img class="profile-photo" src="{esc(img)}" alt="{esc(cent["name"])}" onerror="this.style.background=\'#D4E2F4\';this.removeAttribute(\'src\')" />' if img else '<div class="profile-photo" style="display:flex;align-items:center;justify-content:center;"><span style="font-family:\'Roboto Condensed\',sans-serif;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:rgba(255,255,255,.4)">Photo TBD</span></div>'
        trans_display = f'<div class="vigil-trans">"{esc(vigil_trans)}"</div>' if vigil_trans else ''
        born_line = f'<div class="pmi"><div class="pmi-label">Born</div><div class="pmi-val">{esc(born)}</div></div>' if born else '<div class="pmi"><div class="pmi-label">Lodge</div><div class="pmi-val">Owasippe #7</div></div>'
        born_sidebar = f'<div class="sidebar-fact"><div class="sf-key">Born</div><div class="sf-val">{esc(born)}</div></div>' if born else ''
        vigil_s = f'<div class="sidebar-fact"><div class="sf-key">Vigil name</div><div class="sf-val">{esc(vigil_name)}</div></div>' if vigil_name else ''
        trans_s = f'<div class="sidebar-fact"><div class="sf-key">Meaning</div><div class="sf-val">"{esc(vigil_trans)}"</div></div>' if vigil_trans else ''

        def prev_next_thumb(c):
            ci = c.get('img','')
            if ci:
                return f'<img src="{esc(ci)}" alt="{esc(c["name"])}" onerror="this.style.background=\'var(--blue-lt)\';this.removeAttribute(\'src\')" />'
            return '<div style="width:42px;height:50px;background:var(--blue-lt);border-radius:2px;flex-shrink:0;display:flex;align-items:center;justify-content:center;"><span style="font-family:\'Roboto Condensed\',sans-serif;font-size:8px;font-weight:700;text-transform:uppercase;color:var(--gray-lt)">#7</span></div>'

        page = f"""{head_html(cent['name'], f"{cent['name']} — Centurion Award honoree, Owasippe Lodge #7.", 2)}
{nav_html(2, 'centurions')}

<div class="profile-hero">
  <div class="profile-photo-col">
    {img_block}
    <div class="profile-photo-caption">{esc(cent['name'])}</div>
  </div>
  <div class="profile-info-col">
    <div class="profile-bc">
      <a href="../../index.html">Home</a> ·
      <a href="../index.html">Centurions</a> ·
      <span>{esc(cent['name'])}</span>
    </div>
    <h1 class="profile-name">{esc(cent['name'])}</h1>
    <div class="vigil-wrap">
      <div class="vigil-badge"><span class="vigil-badge-text">Centurion Award</span></div>
      <div>
        <div class="vigil-name">{esc(vigil_name or 'Centurion Award')}</div>
        {trans_display}
      </div>
    </div>
    <div class="profile-meta-grid">
      {born_line}
      <div class="pmi"><div class="pmi-label">Award</div><div class="pmi-val">Centurion</div></div>
      <div class="pmi"><div class="pmi-label">Lodge</div><div class="pmi-val">Owasippe #7</div></div>
    </div>
  </div>
</div>

<div class="profile-body-area">
  <div class="profile-content">
    <div class="eyebrow">Centurion Award</div>
    <div class="sec-title">Life &amp; Service</div>
    <div class="bio-text">
      {bio_to_paragraphs(cent.get('bio',''))}
    </div>
  </div>
  <div class="profile-sidebar">
    <div class="sidebar-label" style="margin-bottom:14px">Record</div>
    <div class="sidebar-fact"><div class="sf-key">Full name</div><div class="sf-val">{esc(cent['name'])}</div></div>
    {born_sidebar}
    {vigil_s}
    {trans_s}
    <div class="sidebar-fact"><div class="sf-key">Award</div><div class="sf-val">Centurion Award</div></div>
    <div class="sidebar-fact"><div class="sf-key">Lodge</div><div class="sf-val">Owasippe Lodge #7</div></div>
    <div style="margin-top:24px">
      <div class="sidebar-label" style="margin-bottom:10px">Other honorees</div>
      <a class="sidebar-next-card" href="../{prev_c['slug']}/index.html">
        {prev_next_thumb(prev_c)}
        <div><div class="snc-label">← Previous</div><div class="snc-name">{esc(prev_c['name'])}</div></div>
      </a>
      <a class="sidebar-next-card" href="../{next_c['slug']}/index.html">
        {prev_next_thumb(next_c)}
        <div><div class="snc-label">Next →</div><div class="snc-name">{esc(next_c['name'])}</div></div>
      </a>
    </div>
  </div>
</div>

{footer_html()}
<script src="../../js/main.js"></script>
</body>
</html>"""

        out_dir = os.path.join(ROOT, 'centurions', slug)
        os.makedirs(out_dir, exist_ok=True)
        with open(os.path.join(out_dir, 'index.html'), 'w', encoding='utf-8') as f:
            f.write(page)
        print(f'  cent: centurions/{slug}/index.html')


# =====================================================================
# EVENT DETAIL + GALLERY PAGES
# =====================================================================
def build_event_pages():
    events   = CONTENT['events']
    bio_lookup = {b['name']: b for b in CONTENT.get('biographies', [])}

    for idx, ev in enumerate(events):
        prev_ev = events[(idx + 1) % len(events)]
        next_ev = events[(idx - 1) % len(events)]
        year     = str(ev['year'])
        venue_short = "The Mayor's Mansion" if 'Mayor' in ev.get('venue','') else 'European Chalet'

        # Honoree cards
        honoree_cards_html = ''
        for name in ev['honorees']:
            b = bio_lookup.get(name)
            if b:
                bimg = b.get('images',[{}])[0].get('url','') if b.get('images') else ''
                honoree_cards_html += f"""
        <a class="hf-card" href="../../biographies/{b['slug']}/index.html">
          <img class="hf-img" src="{esc(bimg)}" alt="{esc(b['name'])}" onerror="this.style.background='var(--blue-lt)';this.removeAttribute('src')" />
          <div class="hf-body">
            <div class="hf-yr">{esc(year)} Honoree</div>
            <div class="hf-name">{esc(b['name'])}</div>
            <div class="hf-vigil">{esc(b.get('vigil_name') or 'Vigil Honor')}</div>
            <div class="hf-link">Read biography →</div>
          </div>
        </a>"""
            else:
                honoree_cards_html += f"""
        <div class="hf-card">
          <div class="hf-img" style="background:var(--blue-lt);display:flex;align-items:center;justify-content:center;width:110px;height:140px;">
            <span style="font-family:'Roboto Condensed',sans-serif;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--gray-lt)">Photo TBD</span>
          </div>
          <div class="hf-body">
            <div class="hf-yr">{esc(year)} Honoree</div>
            <div class="hf-name">{esc(name)}</div>
            <div class="hf-vigil">Vigil Honor</div>
            <!-- TODO: No bio page for {esc(name)} — add when available -->
          </div>
        </div>"""

        # schedule may be a string in the JSON; normalize to dict
        raw_sched = ev.get('schedule', {})
        if isinstance(raw_sched, dict):
            schedule = raw_sched
        else:
            schedule = {'fellowship': '5:30 PM', 'dinner': '7:00 PM', 'program': '8:00 PM', 'conclusion': '9:15 PM'}
        photo_ext = ev.get('photos_external','')
        photos_link = f'<a class="view-photos-btn" href="{esc(photo_ext)}" target="_blank" rel="noopener">View photo gallery →</a>' if photo_ext else f'<a class="view-photos-btn" href="gallery/index.html">View photo gallery →</a>'
        photo_credit = '<div class="esd-item"><div class="esd-key">Photography</div><div class="esd-val">Nick Barth Photography</div></div>' if photo_ext else '<!-- TODO: Add photo credit -->'
        last_names = ' · '.join(n.split(' ')[-1] for n in ev['honorees'])

        page = f"""{head_html(f"{year} Vigil Alumni Annual Dinner", f"The {year} Vigil Alumni Annual Dinner — Owasippe Lodge #7, honoring {' and '.join(ev['honorees'])}.", 2)}
{nav_html(2, 'events')}

<div class="event-hero">
  <img class="event-hero-img" src="{esc(ev.get('img',''))}" alt="{esc(year)} Vigil Alumni Dinner"
       onerror="this.style.background='var(--blue-dk)';this.removeAttribute('src')" />
  <div class="event-hero-overlay">
    <div>
      <div class="breadcrumb" style="color:rgba(255,255,255,.45);margin-bottom:8px">
        <a href="../../index.html" style="color:rgba(255,255,255,.45)">Home</a> ·
        <a href="../index.html" style="color:rgba(255,255,255,.75)">Events</a> ·
        <span style="color:rgba(255,255,255,.75)">{esc(year)} Annual Dinner</span>
      </div>
      <h1 class="event-title-hero">{esc(year)} Vigil Alumni<br>Annual Dinner</h1>
      <div class="event-date-pill"><span class="event-date-pill-text">{esc(ev['date'])}</span></div>
    </div>
    <div class="event-yr-badge">{esc(year)}</div>
  </div>
</div>

<div class="event-meta-bar">
  <div class="emi">
    <div class="emi-label">Date</div>
    <div class="emi-val">{esc(ev['date'])}</div>
    <div class="emi-sub">Saturday evening</div>
  </div>
  <div class="emi">
    <div class="emi-label">Venue</div>
    <div class="emi-val">{esc(venue_short)}</div>
    <div class="emi-sub">5445 S. Harlem Ave, Chicago</div>
  </div>
  <div class="emi">
    <div class="emi-label">Cost</div>
    <div class="emi-val">{esc(ev.get('cost','$40 per person'))}</div>
    <div class="emi-sub">Dinner included</div>
  </div>
  <div class="emi">
    <div class="emi-label">Honorees</div>
    <div class="emi-val">{len(ev['honorees'])} members</div>
    <div class="emi-sub">{esc(last_names)}</div>
  </div>
</div>

<div class="with-sidebar" style="border-top:1px solid var(--border)">
  <div class="event-content-area">
    <div class="eyebrow">Vigil Honor</div>
    <div class="sec-title">{esc(year)} Honorees</div>
    <div class="honoree-pair">
      {honoree_cards_html}
    </div>
    <div class="eyebrow">Schedule</div>
    <div class="sec-title">Evening Program</div>
    <div class="program-timeline">
      <div class="prog-item">
        <div class="prog-time">{esc(schedule.get('fellowship','5:30 PM'))}</div>
        <div class="prog-desc">Fellowship — cocktail hour and informal gathering of Vigil alumni</div>
      </div>
      <div class="prog-item">
        <div class="prog-time">{esc(schedule.get('dinner','7:00 PM'))}</div>
        <div class="prog-desc">Dinner — seated dinner service for all guests</div>
      </div>
      <div class="prog-item">
        <div class="prog-time">{esc(schedule.get('program','8:00 PM'))}</div>
        <div class="prog-desc">Program — formal recognition ceremony honoring the {esc(year)} Vigil inductees</div>
      </div>
      <div class="prog-item">
        <div class="prog-time">{esc(schedule.get('conclusion','9:15 PM'))}</div>
        <div class="prog-desc">Conclusion</div>
      </div>
    </div>
  </div>
  <div class="sidebar">
    <div class="sidebar-label" style="margin-bottom:14px">Event details</div>
    <div class="esd-item"><div class="esd-key">Date</div><div class="esd-val">{esc(ev['date'])}</div></div>
    <div class="esd-item"><div class="esd-key">Venue</div><div class="esd-val">{esc(ev.get('venue',''))}</div></div>
    <div class="esd-item"><div class="esd-key">Address</div><div class="esd-val">{esc(ev.get('address','5445 S. Harlem Ave, Chicago, IL'))}</div></div>
    <div class="esd-item"><div class="esd-key">Ticket cost</div><div class="esd-val">{esc(ev.get('cost','$40 per person'))}</div></div>
    {photo_credit}
    {photos_link}
    <div class="yr-nav">
      <a class="yr-nav-btn" href="../{prev_ev['year']}/index.html">← {esc(prev_ev['year'])}</a>
      <a class="yr-nav-btn" href="../{next_ev['year']}/index.html">{esc(next_ev['year'])} →</a>
    </div>
  </div>
</div>

{footer_html()}
<script src="../../js/main.js"></script>
</body>
</html>"""

        out_dir = os.path.join(ROOT, 'events', year)
        os.makedirs(out_dir, exist_ok=True)
        with open(os.path.join(out_dir, 'index.html'), 'w', encoding='utf-8') as f:
            f.write(page)
        print(f'  event: events/{year}/index.html')

        # Gallery page
        gallery_dir = os.path.join(out_dir, 'gallery')
        os.makedirs(gallery_dir, exist_ok=True)
        ext_block = ''
        if photo_ext:
            ext_block = f"""<div style="background:var(--blue-lt);border:1px solid var(--blue-pale);border-radius:4px;padding:24px 28px;margin-bottom:32px;display:flex;align-items:center;justify-content:space-between;gap:20px">
    <div>
      <div class="eyebrow">External gallery</div>
      <div style="font-family:'Roboto Slab',serif;font-size:16px;font-weight:700;color:var(--blue);margin-bottom:6px">Photos by Nick Barth Photography</div>
      <div style="font-size:13px;font-weight:300;color:var(--gray)">The full photo gallery for the {esc(year)} dinner is hosted on the photographer's website.</div>
    </div>
    <a class="btn-blue" href="{esc(photo_ext)}" target="_blank" rel="noopener">View full gallery →</a>
  </div>"""
        else:
            ext_block = f"""<!-- TODO: Add gallery images for {year} when available -->
  <div style="background:var(--tan-lt);border:1px dashed var(--tan-dk);border-radius:4px;padding:40px;text-align:center;color:var(--gray-lt)">
    <div style="font-family:'Roboto Condensed',sans-serif;font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px">Gallery coming soon</div>
    <div style="font-size:13px">Photos from the {esc(year)} dinner will be added here.</div>
  </div>"""

        gallery_page = f"""{head_html(f"{year} Dinner Photos", f"Photo gallery from the {year} Vigil Alumni Annual Dinner, Owasippe Lodge #7.", 3)}
{nav_html(3, 'events')}

<div class="page-header">
  <div class="breadcrumb">
    <a href="../../../index.html">Home</a> ·
    <a href="../../index.html">Events</a> ·
    <a href="../index.html">{esc(year)} Dinner</a> ·
    <span>Gallery</span>
  </div>
  <h1 class="page-title">{esc(year)} Dinner Photos</h1>
  <p class="page-sub">{esc(ev['date'])} · {esc(venue_short)} · Chicago</p>
</div>

<div style="padding:36px 36px 20px">
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px">
    <div>
      <div class="eyebrow">Photo gallery</div>
      <div class="sec-title">{esc(year)} Annual Dinner</div>
    </div>
    <a class="btn-outline" href="../index.html">← Back to dinner details</a>
  </div>
  {ext_block}
</div>

{footer_html()}
<script src="../../../js/main.js"></script>
</body>
</html>"""

        with open(os.path.join(gallery_dir, 'index.html'), 'w', encoding='utf-8') as f:
            f.write(gallery_page)
        print(f'  gallery: events/{year}/gallery/index.html')


# =====================================================================
# RUN
# =====================================================================
if __name__ == '__main__':
    print('\nMoqua Foundation — Static Page Generator')
    print('=========================================')
    print('Building biography profile pages...')
    build_bio_pages()
    print('Building centurion profile pages...')
    build_centurion_pages()
    print('Building event detail + gallery pages...')
    build_event_pages()
    print('\nDone!\n')
