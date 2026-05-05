# Moqua Foundation — Claude Code Context Handoff
**Project:** moqua.org full website redesign  
**Status:** Design complete. Ready for static HTML build.  
**Handoff date:** May 2026

---

## 1. What This Project Is

The Moqua Foundation is a nonprofit commemorating Vigil Honor members of **Owasippe Lodge #7**, Order of the Arrow, Chicago Area Council, BSA. The site is a living archive: biographical profiles of honored members, annual Vigil Dinner event recaps, photo galleries, and information about a Guest Lodge project at Owasippe Scout Reservation in Michigan.

**Current live site:** http://www.moqua.org (WordPress, built ~2011–2020, largely frozen)  
**Goal:** Full static HTML rebuild — no CMS, no framework dependencies, just clean HTML/CSS/JS files ready to host anywhere.

---

## 2. Key Deliverables Already Completed

| Deliverable | Status | Notes |
|---|---|---|
| Full site audit | ✅ Done | ~55 pages identified, 7 nav sections, 3 templates |
| Content scrape | ✅ Done | 24 bio pages, 7 Centurion profiles, 6 event pages, Guest Lodge, homepage |
| Master content JSON | ✅ Done | `moqua-content.json` — the source of truth for all content |
| New sitemap | ✅ Done | 44 pages, 8 templates — see Section 5 |
| Visual direction chosen | ✅ Done | "Direction 1 — Red Command" — see Section 4 |
| Interactive prototype | ✅ Done | `moqua-prototype.html` — all 8 templates wired and clickable |

---

## 3. Two Files to Start With

You need these two files. They contain everything:

### `moqua-prototype.html`
The fully clickable prototype with all 8 page templates, real content, working navigation, and all design decisions baked in. **This is the design spec.** Build the real site to match this exactly.

### `moqua-content.json`
The master content file scraped from the existing site. Contains:
- `biographies` — 24 Vigil Honor profiles (name, vigil name, translation, born, bio text, image URLs)
- `centurions` — 7 Centurion Award profiles (same structure)
- `events` — 6 annual dinners 2015–2020 (date, venue, honorees, schedule, photos)
- `guestLodge` — lodge description, images, PDFs
- `homepage` — carousel images, existing copy
- `scrapeNotes` — known gaps and truncations

---

## 4. Design System

### Color Tokens (BSA-compliant)
```css
:root {
  --blue:     #003F87;   /* Scouting Blue — primary structural color */
  --blue-dk:  #003366;   /* Scouting Dark Blue — footer, dark bars */
  --blue-lt:  #EEF3FA;   /* Pale blue — nav hover, active states */
  --blue-pale: #D4E2F4;  /* Card hover borders */
  --red:      #CE1126;   /* Scouting Red — OA identity, CTAs, stat bars, accents */
  --red-dk:   #9E0C1E;   /* Dark red — hover states */
  --red-lt:   #FAE8EB;   /* Light red — year tags, background tints */
  --tan:      #D6CEBD;   /* Scouting Tan — hero photo borders, italic text */
  --tan-lt:   #F0EDE7;   /* Light tan — sidebar backgrounds, about block */
  --tan-dk:   #AD9D7B;   /* Dark tan — decorative elements */
  --gray:     #515354;   /* Scouting Warm Gray — body text */
  --gray-lt:  #858787;   /* Scouting Pale Gray — captions, subtext */
  --white:    #ffffff;
  --ink:      #1a1917;   /* Near-black — headings on white */
  --border:   rgba(0,0,0,.08);
  --shadow:   0 2px 12px rgba(0,63,135,.1);
}
```

### Typography (BSA-compliant Google Fonts)
```html
<link href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@300;400;700&family=Roboto+Condensed:ital,wght@0,400;0,700;1,400&family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">
```

| Role | Font | Usage |
|---|---|---|
| Display / headings | Roboto Slab | Page titles, section titles, honoree names, stat numbers |
| Labels / nav / caps | Roboto Condensed | All-caps labels, nav links, eyebrows, year tags |
| Body | Roboto | Body copy, descriptions, captions |

### Visual Direction: "Red Command"
- OA **red band** at the very top of every page (brand identity strip)
- **Stat bars** are red (not blue)
- **Red left-border stripe** on every blue hero section (`::before` pseudo-element, 8px wide)
- **Red eyebrow text** on section headers
- **Red top-border** on all honoree/bio cards (2px)
- **Red CTAs** as secondary buttons; white as primary on blue backgrounds
- **Blue** is structural: hero backgrounds, nav, page header bands, footer
- **Tan** is secondary: sidebar backgrounds, about block backgrounds

### Key Recurring Components

**OA Top Band** (red, appears on every page):
```html
<div class="oa-band">
  <span class="oa-text">Order of the Arrow · Owasippe Lodge #7 · Chicago Area Council · BSA</span>
</div>
```

**Main Nav** (sticky, white background):
- Logo mark (blue square with inner border square)
- "Moqua Foundation" in Roboto Slab
- "Owasippe Lodge #7 · Since 1921" in Roboto Condensed
- Nav links: About, Biographies, Centurions, Events, Guest Lodge, Contact

**Page Header** (blue background, red left stripe):
- Breadcrumb in Roboto Condensed all-caps
- Page title in Roboto Slab 36px bold white
- Subtitle in Roboto 300 weight

**Footer** (blue-dark background):
- "Moqua Foundation" in Roboto Slab white
- "Order of the Arrow · Owasippe Lodge #7 · Chicago Area Council · BSA" in Roboto Condensed
- © line right-aligned

---

## 5. Sitemap — All Pages to Build

### Navigation Structure
```
Home
About/
  Mission & History        /about/
  What is the Vigil Honor? /about/vigil-honor/
  About Owasippe Lodge #7  /about/owasippe-lodge/
  About the Foundation     /about/foundation/
Biographies/
  Index                    /biographies/
  [24 profile pages]       /biographies/[slug]/
Centurions/
  Index                    /centurions/
  [7 profile pages]        /centurions/[slug]/
Events/
  Archive landing          /events/
  [6 event detail pages]   /events/[year]/
  [6 gallery pages]        /events/[year]/gallery/
  Legacy archive           /events/legacy/
Guest Lodge                /guest-lodge/
Contact                    /contact/
```

### Biography URL Slugs
Standard: `/biographies/[lastname]`  
Disambiguation: `/biographies/[firstname]-[initial]-[lastname]`

| Name | Slug |
|---|---|
| Frank S. Accardi | accardi |
| Jack B. Blane | blane |
| Lawrence S. Branch | branch |
| Frederick C. Brems | brems |
| John N. Brown | brown |
| Norman C. Buettner | buettner |
| Robert J. Burns | burns |
| Norville R. Carter | norville-r-carter |
| Frank G. Collins | frank-g-collins |
| John L. Cook | cook |
| Dwaine W. Filkins | filkins |
| James G. Heinlein | james-g-heinlein |
| Rev. John M. Kaserow | kaserow |
| Robert H. Krejci | krejci |
| Grant F. Muraski | muraski |
| Arties R. Phillips, Jr. | phillips |
| Daniel J. Reilly III | reilly |
| John Sanchez, Sr. | sanchez |
| Rev. F. Gerald Scanlan | scanlan |
| Arnold R. Schenk | schenk |
| Samuel C. Stanton, MD | stanton |
| Donald E. Studaven | studaven |
| Robert T. Sublette, Sr. | sublette |
| Ronald J. Temple, Ph.D. | ronald-j-temple-ph-d |

### Centurion URL Slugs
| Name | Slug |
|---|---|
| Gerald H. Blake | gerald-h-blake |
| Sheridan U. Nunn | sheridan-u-nunn |
| Ronald J. Temple, Ph.D. | ronald-j-temple-ph-d (distinct from bio page) |
| John C. Kosik | john-c-kosik |
| Francis J. Podbielski, MD | francis-j-podbielski-md |
| Robert C. Landmichl | robert-c-landmichl |
| Theodore B. Kumzi | theodore-b-kumzi |

---

## 6. Page Templates — Build Spec

All 8 templates are fully rendered in the prototype. Use the prototype as the pixel-level spec. Notes below are the key implementation details per template.

### Template 1: Home (`index.html`)
- Hero: 2-col grid. Left: tag + headline + body + 2 CTAs. Right: stacked photos (main 320×210, secondary 190×150)
- Red stat bar: 4 stats — 1921 / 100+ / 31 / 10+
- Honoree grid: 4 cards, real photos, `border-top: 2px solid var(--red)` on card body
- 2-col split: About block (tan-lt bg) + Upcoming event block
- `onclick` on honoree cards → bio profile page

### Template 2: About (`about/index.html` + 3 sub-pages)
- 2-col grid: left = dark blue sidebar nav (240px), right = content area
- Active sidebar item = red background
- Content: eyebrow + h2 + red rule + mission card (blue bg, red left stripe) + 2×2 info card grid

### Template 3: Biography Index (`biographies/index.html`)
- Page header with count badge (faint white "24" top right)
- Filter bar (tan-lt bg): All / Vigil name listed / 2015–2020 / Pre-2015 buttons
- 5-column grid of bio cards
- Each card: 3:4 aspect ratio photo + card body with red top border
- Card body: name (Roboto Slab 12px bold) + vigil name italic + "Honored YYYY" in red all-caps
- Centurion Index is same template, different heading and 4-col grid (7 items)

### Template 4: Biography Profile (`biographies/[slug]/index.html`)
- **Hero band** (blue, full width, 2-col):
  - Left col (260px): portrait photo (170×210) + caption
  - Right col: breadcrumb → name (Roboto Slab 34px) → vigil badge (red pill "Vigil Name") + vigil name + translation → 3-col meta strip (Born / Honored / Lodge)
  - Red left stripe (8px `::before`)
- **Body** (2-col: content + 280px sidebar):
  - Content: "Biography" eyebrow + "Life & Service" section title + bio text (Roboto 300 weight, 1.9 line-height)
  - Sidebar (tan-lt): "Record" facts block + prev/next honoree cards
- Centurion Profile uses same template

### Template 5: Event Detail (`events/[year]/index.html`)
- **Hero**: full-bleed photo (240px height, opacity .3) with overlay — breadcrumb + title + red date pill + year badge (large, faint white)
- Red left stripe (8px) on hero
- **Dark blue meta bar** (4 cols): Date / Venue / Cost / Honorees
- **Body** (with-sidebar):
  - Content: 2 honoree feature cards (photo left, info right, "Read biography →" link) + program timeline
  - Sidebar (tan-lt): event details facts + "View photo gallery →" button + year prev/next nav

### Template 6: Events Archive (`events/index.html`)
- Page header
- Section intro: "Dinner Archive · 2015–2020"
- **Vertical timeline**: each row = 2-col grid (80px year col + card)
  - Year col: red circle node + year label; connecting line runs between rows (`::before` pseudo-element)
  - Card: 200×140 photo + title + date + venue + honoree chips (blue-lt bg) + "View details →" link
- Legacy archive callout at bottom (tan-lt bg, outline button)

### Template 7: Guest Lodge (`guest-lodge/index.html`)
- **Hero**: 2-col (text left, photo right with gradient overlay)
- Project active status bar (dark blue)
- `with-sidebar` layout:
  - Content: overview text + gallery preview (3 thumbs + "+12" blue tile)
  - Sidebar: red donate card + Friends of Scouting card + project facts list

### Template 8: Contact (`contact/index.html`)
- Page header
- `with-sidebar` layout:
  - Content: 2×2 form grid (first name, last name, email, subject select) + full-width textarea + blue submit button
  - Sidebar: blue mailing list card (fixed from broken existing) + 2 info blocks

---

## 7. Content Data — Images

All existing images are hosted at `http://www.moqua.org/wp-content/uploads/`.

**For the build:** Reference them directly from moqua.org for now. When the new site goes live, download all images and serve them locally.

**Key carousel images:**
```
/2019/11/Vigil-Dinner-Group-11-23-2019-carousel-1480x604.jpg
/2019/11/Scanlan-Carousel-Picture-1480x604.jpg
/2019/11/Temple-Carousel-Photo-1480x604.jpg
/2018/11/Owasippe-Lodge-7-Chiefs-11-17-2018-carousel-1480x604.jpg
/2018/11/Muraski-carousel-picture-1480x604.jpg
/2018/11/Sublette-carousel-picture-1480x604.jpg
```

**External photo galleries (2018, 2019 dinners):**
```
https://www.nickbarthphotography.com/Vigil-Dinners/n-JpNDmS/2019-11-23-Vigil-Dinner/
https://www.nickbarthphotography.com/Vigil-Dinners/n-JpNDmS/2018-11-17-Vigil-Dinner/
```

---

## 8. Content Gaps — Known Issues

These items are missing or incomplete from the scraped content. Flag with TODO comments in the HTML:

| Gap | Affected pages | Action needed |
|---|---|---|
| Burns, Collins, Carter, Kaserow, Krejci, Studaven, Sublette, Stanton bio tails truncated | Those 8 bio pages | Re-scrape or manually complete from moqua.org |
| Gallery photo grids for 2015, 2016, 2017 (rate limited) | Event detail pages | Re-scrape with rate limiting or use carousel images as placeholders |
| Contact page not scraped | Contact | Form is new; no existing content to migrate |
| 2020 honorees (Dozier, Ward) have no bio pages | Event detail 2020 | Bio pages may not exist on old site; confirm with client |
| Blog archive 2010–2013 | Legacy archive | Client decision: migrate or omit |
| Guest Lodge PDFs | Guest Lodge | `data.guestLodge.pdfs` contains URLs — download and host locally |

---

## 9. File Structure to Build

```
moqua-org/
├── index.html                          # Home
├── css/
│   └── main.css                        # All styles extracted from prototype
├── js/
│   └── main.js                         # Navigation and any interactive bits
├── images/                             # Downloaded from moqua.org
│   ├── portraits/                      # Bio and centurion photos
│   ├── events/                         # Dinner photos
│   └── lodge/                          # Guest Lodge photos
├── about/
│   ├── index.html                      # Mission & History (default)
│   ├── vigil-honor/index.html
│   ├── owasippe-lodge/index.html
│   └── foundation/index.html
├── biographies/
│   ├── index.html                      # Grid of all 24
│   ├── accardi/index.html
│   ├── blane/index.html
│   └── ... (24 total)
├── centurions/
│   ├── index.html                      # Grid of all 7
│   ├── gerald-h-blake/index.html
│   └── ... (7 total)
├── events/
│   ├── index.html                      # Timeline archive
│   ├── legacy/index.html               # 2010–2014 gallery archive
│   ├── 2015/
│   │   ├── index.html                  # Event detail
│   │   └── gallery/index.html
│   ├── 2016/ ... 2020/ (same structure)
├── guest-lodge/
│   └── index.html
└── contact/
    └── index.html
```

---

## 10. Build Approach Recommendation

1. **Start with `css/main.css`** — extract all CSS from `moqua-prototype.html`. The prototype has every style needed; just pull it out into a standalone file.

2. **Build `index.html` first** — the homepage has the most components and establishes all global patterns (oa-band, nav, footer). Get this pixel-perfect first.

3. **Build `biographies/index.html`** — the grid page is fast and validates the card component.

4. **Use `moqua-content.json`** to generate all biography and centurion profile pages — this is best done with a small build script (Node.js or Python) that reads the JSON and outputs individual HTML files from a template.

5. **Build event pages** — same pattern as bio pages.

6. **Remaining pages** — About, Guest Lodge, Contact are mostly static.

### Suggested build script approach for bio pages:
```javascript
// Node.js pseudocode
const content = require('./moqua-content.json');
const template = fs.readFileSync('./templates/bio-profile.html', 'utf8');

content.biographies.forEach(bio => {
  const html = template
    .replace('{{NAME}}', bio.name)
    .replace('{{VIGIL}}', bio.vigil_name || 'Vigil Honor')
    .replace('{{TRANSLATION}}', bio.vigil_translation || '')
    .replace('{{BORN}}', bio.vigil_date || '')
    .replace('{{YEAR}}', bio.year)
    .replace('{{IMG}}', bio.images[0]?.url || '')
    .replace('{{BIO}}', bio.bio)
    .replace('{{SLUG}}', bio.slug);
  fs.writeFileSync(`./biographies/${bio.slug}/index.html`, html);
});
```

---

## 11. BSA Brand Compliance Notes

The design was validated against the BSA Brand Guidelines (July 2019). Key compliance points:

- **Colors:** All tokens are exact BSA spec values (`#003F87`, `#CE1126`, `#D6CEBD`, `#515354`, `#003366`, `#858787`)
- **Fonts:** Roboto Slab (primary/display) and Roboto Condensed (secondary) are BSA-approved "Better Typefaces" for web
- **OA attribution:** Every page footer includes full OA chain: "Order of the Arrow · Owasippe Lodge #7 · Chicago Area Council · BSA"
- **No BSA trademark used** in the design (the nav mark is a custom abstract symbol, not the fleur-de-lis)
- **No advertising** on any page (BSA web policy)
- **Do not** use the gold fleur-de-lis (retired per BSA guidelines)

---

## 12. Quick Reference — All Bio Data

```json
[
  {"name":"Frank S. Accardi","slug":"accardi","vigil_name":"Nenostam Moewagan","vigil_translation":"To Show Understanding","year":"2016","img":"http://www.moqua.org/wp-content/uploads/2016/09/Frank-Accardi-1965-202x300.jpg"},
  {"name":"Jack B. Blane","slug":"blane","vigil_name":"Wulapeju","vigil_translation":"Just and Upright One","year":"2012","img":"http://www.moqua.org/wp-content/uploads/2012/03/Jack-B.-Blane-circa-1938-revised-257x300.jpg"},
  {"name":"Lawrence S. Branch","slug":"branch","vigil_name":"","vigil_translation":"","year":"2011","img":"http://www.moqua.org/wp-content/uploads/2011/10/Lawrence-S.-Branch-11-20-20101.jpg"},
  {"name":"Frederick C. Brems","slug":"brems","vigil_name":"Wulamollessohalid","vigil_translation":"He Who Makes Me Happy","year":"2011","img":"http://www.moqua.org/wp-content/uploads/2011/10/Frederick-C.-Brems-1940-Camp-Twin-Echos-Ligonier-PA-09-01-1940-profile-revised-137x300.jpg"},
  {"name":"John N. Brown","slug":"brown","vigil_name":"Gunaquot Cuwe","vigil_translation":"Tall Pine Tree","year":"2016","img":"http://www.moqua.org/wp-content/uploads/2016/10/John-Brown-High-School-1952-262x300.jpg"},
  {"name":"Norman C. Buettner","slug":"buettner","vigil_name":"Wipungweu Psakulin","vigil_translation":"Brown Squirrel","year":"2011","img":"http://www.moqua.org/wp-content/uploads/2011/10/Norman-C.-Buettner-1965-300x200.jpg"},
  {"name":"Robert J. Burns","slug":"burns","vigil_name":"Wetochwink Woapalanne","vigil_translation":"Father of Eagles","year":"2013","img":"http://www.moqua.org/wp-content/uploads/2013/09/Bob-Burns-portrait-circa-1940.jpg"},
  {"name":"Norville R. Carter","slug":"norville-r-carter","vigil_name":"Elenapewian","vigil_translation":"Thou Indian!","year":"2017","img":"http://www.moqua.org/wp-content/uploads/2017/10/Norville-Carter-circa-1954-247x300.jpg"},
  {"name":"Frank G. Collins","slug":"frank-g-collins","vigil_name":"Wowoatam Chesimus","vigil_translation":"Skillful Younger Brother","year":"2015","img":"http://www.moqua.org/wp-content/uploads/2015/09/Frank-Collins-circa-1955-819x1024.jpg"},
  {"name":"John L. Cook","slug":"cook","vigil_name":"Papenauwelendam","vigil_translation":"To Be Concerned","year":"2011","img":"http://www.moqua.org/wp-content/uploads/2011/10/young-mr-cook-modified-230x300.jpg"},
  {"name":"Dwaine W. Filkins","slug":"filkins","vigil_name":"The Good Worker","vigil_translation":"","year":"2014","img":"http://www.moqua.org/wp-content/uploads/2014/08/Dwaine-Filkins-1940-Twin-Echos-cropped-revised.jpg"},
  {"name":"James G. Heinlein","slug":"james-g-heinlein","vigil_name":"Schipinachagen","vigil_translation":"To Put Forth The Hand Willingly","year":"2017","img":"http://www.moqua.org/wp-content/uploads/2017/10/Jim-Heinlein-youth-270x300.jpg"},
  {"name":"Rev. John M. Kaserow","slug":"kaserow","vigil_name":"","vigil_translation":"","year":"2015","img":"http://www.moqua.org/wp-content/uploads/2015/09/John-M-Kaserow-1955-819x1024.jpg"},
  {"name":"Robert H. Krejci","slug":"krejci","vigil_name":"","vigil_translation":"","year":"2011","img":"http://www.moqua.org/wp-content/uploads/2011/10/Robert-H.-Krejci-FJP-10-08-2011-300x200.jpg"},
  {"name":"Grant F. Muraski","slug":"muraski","vigil_name":"","vigil_translation":"","year":"2018","img":"http://www.moqua.org/wp-content/uploads/2018/10/Grant-Muraski-as-a-youth-240x300.jpg"},
  {"name":"Arties R. Phillips, Jr.","slug":"phillips","vigil_name":"","vigil_translation":"","year":"2013","img":"http://www.moqua.org/wp-content/uploads/2013/09/Phillips-circa-1940.jpg"},
  {"name":"Daniel J. Reilly III","slug":"reilly","vigil_name":"","vigil_translation":"","year":"2012","img":"http://www.moqua.org/wp-content/uploads/2012/03/Daniel-J.-Reilly-1938-revised.jpg"},
  {"name":"John Sanchez, Sr.","slug":"sanchez","vigil_name":"","vigil_translation":"","year":"2014","img":"http://www.moqua.org/wp-content/uploads/2014/11/John-Sanchez-circa-2003a.jpg"},
  {"name":"Rev. F. Gerald Scanlan","slug":"scanlan","vigil_name":"","vigil_translation":"","year":"2019","img":"http://www.moqua.org/wp-content/uploads/2019/11/Fr-Jerry-Scanlan-HS-Graduation-Photo-1954.jpg"},
  {"name":"Arnold R. Schenk","slug":"schenk","vigil_name":"Achpamsin","vigil_translation":"To Walk About","year":"2011","img":"http://www.moqua.org/wp-content/uploads/2011/10/Arn-Schenk-circa-1936.jpg"},
  {"name":"Samuel C. Stanton, MD","slug":"stanton","vigil_name":"","vigil_translation":"","year":"2011","img":"http://www.moqua.org/wp-content/uploads/2011/11/Stanton-Miller-1939.jpg"},
  {"name":"Donald E. Studaven","slug":"studaven","vigil_name":"","vigil_translation":"","year":"2014","img":"http://www.moqua.org/wp-content/uploads/2014/08/Donald-Studaven-05-1982.jpg"},
  {"name":"Robert T. Sublette, Sr.","slug":"sublette","vigil_name":"","vigil_translation":"","year":"2018","img":"http://www.moqua.org/wp-content/uploads/2018/10/Bob-Sublette-as-a-youth-240x300.jpg"},
  {"name":"Ronald J. Temple, Ph.D.","slug":"ronald-j-temple-ph-d","vigil_name":"Elachtoniket","vigil_translation":"The Seeker","year":"2019","img":"http://www.moqua.org/wp-content/uploads/2019/11/Ron-Temple-with-Edson-and-Goodman-1960-816x1024.jpg"}
]
```

---

## 13. All Events Data

```json
[
  {"year":"2020","date":"November 21, 2020","honorees":["John P. Dozier","Robert M. Ward"],"venue":"The Mayor's Mansion (a.k.a. European Chalet Banquet Hall)","address":"5445 S. Harlem Ave, Chicago, IL","cost":"$40 per person","schedule":{"fellowship":"5:30 PM","dinner":"7:00 PM","program":"8:00 PM","conclusion":"9:15 PM"}},
  {"year":"2019","date":"November 23, 2019","honorees":["Rev. F. Gerald Scanlan","Ronald J. Temple, Ph.D."],"venue":"The Mayor's Mansion (a.k.a. European Chalet Banquet Hall)","address":"5445 S. Harlem Ave, Chicago, IL","cost":"$40 per person","photos_external":"https://www.nickbarthphotography.com/Vigil-Dinners/n-JpNDmS/2019-11-23-Vigil-Dinner/"},
  {"year":"2018","date":"November 17, 2018","honorees":["Grant F. Muraski","Robert T. Sublette, Sr."],"venue":"European Chalet Banquet Hall","address":"5445 S. Harlem Ave, Chicago, IL","cost":"$40 per person","photos_external":"https://www.nickbarthphotography.com/Vigil-Dinners/n-JpNDmS/2018-11-17-Vigil-Dinner/"},
  {"year":"2017","date":"November 18, 2017","honorees":["Norville R. Carter","James G. Heinlein"],"venue":"European Chalet Banquet Hall","address":"5445 S. Harlem Ave, Chicago, IL","cost":"$40 per person"},
  {"year":"2016","date":"November 19, 2016","honorees":["Frank S. Accardi","John N. Brown"],"venue":"European Chalet Banquet Hall","address":"5445 S. Harlem Ave, Chicago, IL","cost":"$40 per person"},
  {"year":"2015","date":"November 21, 2015","honorees":["Frank G. Collins","Rev. John M. Kaserow"],"venue":"European Chalet Banquet Hall","address":"5445 S. Harlem Ave, Chicago, IL","cost":"$40 per person"}
]
```

---

## 14. Starting Prompt for Claude Code

Copy and paste this to start your Claude Code session:

---

> I'm building a static HTML website for the Moqua Foundation (moqua.org), a nonprofit commemorating Vigil Honor members of Owasippe Lodge #7, Order of the Arrow, BSA.
> 
> I have two files to give you as context:
> 1. `moqua-prototype.html` — a fully clickable design prototype showing all 8 page templates with real content, working navigation, and the final design system. **This is the design spec — build to match it exactly.**
> 2. `moqua-content.json` — all scraped content from the existing site: 24 biography profiles, 7 Centurion profiles, 6 annual dinner events, Guest Lodge copy, and image URLs.
> 3. `MOQUA_CLAUDE_CODE_CONTEXT.md` — full project context including sitemap, file structure, design tokens, build approach, and known content gaps.
> 
> The goal is a complete static HTML site with the following structure:
> - `index.html` (Home)
> - `about/` (4 sub-pages)
> - `biographies/` (index + 24 profile pages)
> - `centurions/` (index + 7 profile pages)
> - `events/` (archive + 6 event detail pages + 6 gallery pages + legacy)
> - `guest-lodge/index.html`
> - `contact/index.html`
> - `css/main.css` (extracted from prototype)
> - `js/main.js` (navigation only)
> 
> Please start by:
> 1. Reading all three context files
> 2. Extracting `css/main.css` from the prototype
> 3. Building `index.html` to exactly match the homepage in the prototype
> 4. Then ask me how you'd like to proceed with the remaining pages

---

*End of handoff document.*
