<div align="center">

# HazirMinds

**Always present. Never missed.**

The production website for HazirMinds — a governed, done-for-you AI operations firm
serving US businesses, with a dedicated operating system for masjids and Islamic centers.

[**hazirminds.ai**](https://hazirminds.ai) · 37 pages · zero build dependencies · zero external runtime requests

</div>

---

## Contents

- [What this repository is](#what-this-repository-is)
- [Architecture](#architecture)
- [Project structure](#project-structure)
- [The product](#the-product)
  - [Services — groups A–F](#services--groups-af)
  - [Pricing](#pricing)
  - [Industries](#industries)
  - [Compare](#compare)
- [Masjid AI OS](#masjid-ai-os)
- [Chief-of-Staff Platform](#chief-of-staff-platform)
- [Enterprise governance](#enterprise-governance)
- [Design system](#design-system)
- [Local setup](#local-setup)
- [Building](#building)
- [Deploying to SpaceShip (cPanel)](#deploying-to-spaceship-cpanel)
- [Connecting hazirminds.ai and SSL](#connecting-hazirmindsai-and-ssl)
- [Form handling](#form-handling)
- [SEO and AI discoverability](#seo-and-ai-discoverability)
- [Quality gates](#quality-gates)
- [Content rules](#content-rules)
- [Day-to-day maintenance](#day-to-day-maintenance)
- [License](#license)

---

## What this repository is

A **static site generator and its output**, in one repository.

`src/` holds the pages, the layout library and the content as data. `build.js` renders them to
plain HTML in `dist/`. `dist/` is committed, because deployment is a file upload — there is no
Node runtime on the hosting plan and nothing needs to be compiled on the server.

**The build has no npm dependencies.** `build.js` uses only Node built-ins (`fs`, `path`,
`crypto`). `npm install` is needed only to run the QA harness or to refresh the vendored fonts
and animation libraries.

| | |
|---|---|
| **Live** | https://hazirminds.ai |
| **Hosting** | SpaceShip shared hosting (cPanel / Apache) |
| **Pages** | 37 |
| **Build output** | `dist/` — 6.3 MB total, of which ~4 MB is photography |
| **Runtime dependencies** | none — no CDN, no analytics script, no third-party request |
| **Form backend** | `api/lead.php` (PHP, ships with the site) |
| **Node required for build** | yes, locally only |

---

## Architecture

```
src/data/          content as data — prices, plans, competitors, FAQs, use cases
      │
src/lib.js         layout library — <head>, SEO, nav, footer, shared components, design tokens
      │
src/pages/*.js     one module per route group; each exports { file, html }
      │
build.js           renders every page, copies assets, writes sitemap/robots/llms.txt, /ai
      │
dist/              the deployable website — upload the CONTENTS of this folder
```

**Why data-driven.** Every price, every plan, every competitor row and every FAQ answer lives in
`src/data/` and is referenced by key. A price change is one edit in `src/data/site.json` and it
propagates to the pricing table, the comparison matrix, the llms.txt summary and the machine-
readable `/ai` page together. The build also **fails** if a price literal appears anywhere
outside `site.json`, which is what keeps that single source of truth from drifting.

**Three outputs beyond the pages.** `build.js` also emits `sitemap.xml`, `robots.txt`, `llms.txt`
and a human-and-machine readable `/ai/` summary — see [SEO and AI discoverability](#seo-and-ai-discoverability).

---

## Project structure

```
.
├── build.js                 the entire build — no dependencies
├── server.js                static preview server for local QA
├── package.json             scripts + QA-only devDependencies
│
├── src/
│   ├── lib.js               layout library: head/SEO, nav, footer, icons, components, ASSET_VER
│   ├── data/
│   │   ├── site.js          brand, canonical URL, nav structure, personas, meta
│   │   ├── site.json        SINGLE SOURCE: tiers, add-ons, stats, competitor matrix, masjid set
│   │   ├── services.js      the 41 services across groups A–F
│   │   ├── pricing.js       plan feature matrix + pricing FAQs
│   │   ├── compare.js       comparison doctrine, invariants, governance copy
│   │   ├── industries.js    the 8 verticals
│   │   └── usecases.js      the 9 use-case pages
│   └── pages/
│       ├── home.js          /
│       ├── services.js      /services
│       ├── pricing.js       /pricing
│       ├── chief-of-staff.js /chief-of-staff
│       ├── masjids.js       /masjids
│       ├── enterprise.js    /enterprise
│       ├── compare.js       /compare + 5 competitor pages + /compare/masjid-platforms
│       ├── listings.js      /industries/* and /use-cases/*
│       └── misc.js          /about /demo /resources /case-studies /privacy /terms
│
├── assets/
│   ├── css/main.css         one stylesheet, design tokens at the top
│   └── js/main.js           reveal/motion, nav, calculators, form handling
│
├── api/
│   ├── lead.php             form endpoint for cPanel hosting
│   ├── config.sample.php    copy to config.php and fill in (gitignored)
│   ├── .htaccess            denies direct access to config.php and leads.log
│   └── lead.js              the same contract for a serverless host (optional)
│
├── deploy/
│   └── htaccess.conf        copied to dist/.htaccess by the build
│
├── img/                     optimised WebP set + og-card.jpg + icons
├── vendor/                  self-hosted fonts (8 woff2) + gsap, ScrollTrigger, lenis
├── qa/                      the regression harness
└── dist/                    the deployable site (committed)
```

---

## The product

HazirMinds deploys and operates AI teams — receptionists, sales agents and automations — inside a
governance layer: bounded authority, source-linked answers, approval gates and evidence receipts.

### Services — groups A–F

41 services, each labeled with what it honestly is:

| Group | Label | Count | Meaning |
|---|---|---|---|
| **A** | Available — scoped to your requirement | 9 | AI Receptionist 24/7, Missed-Call Text-Back, Speed-to-Lead, Pipeline & Deal Automation, Workflow Automation, AI Support Agent, KPI Dashboards, Done-For-You Snapshots, Managed Hosting |
| **B** | Configured at onboarding | 10 | Appointment Setter, Smart Routing/IVR, Website Chat, SMS Agent, Lead Scoring, CRM Setup, No-Show Reduction, Call Analytics, Governance configuration, Readiness Audit |
| **C** | Scoped per engagement | 8 | Chief-of-Staff agent team, multi-agent orchestration, permission & approval framework, audit trail, cost governance, hallucination-control program, ERP/data integration, custom AI employees |
| **D** | Flagship, scoped per engagement | 7 | The Personal AI Chief-of-Staff Platform |
| **E** | Client-requirement builds | 1 | Anything specified and acceptance-tested per engagement |
| **F** | Growth add-ons | 6 | AEO/GEO AI-search visibility, review & reputation, database reactivation, consent & TCPA proof trail, compliance scoring, vertical agents |

The labeling is the point. Nothing is presented as shipping when it is configured on onboarding
or planned.

### Pricing

| Plan | Monthly | Annual | Highlights |
|---|---|---|---|
| **Chronos** | $497 | $414/mo | AI voice receptionist, 300 minutes, missed-call text-back, SMS reminders |
| **Hazir Pro** | $997 | $831/mo | Adds website chat, appointment setter, speed-to-lead, review AI, CRM management, 800 minutes |
| **Aeon** | $1,997 | $1,664/mo | Adds AI SDR, outbound campaigns, database reactivation, custom AI employee, call analytics, 2,000 minutes |
| **Archon** | Custom | — | Enterprise governance + Chief-of-Staff programs |

Annual billing is twelve months for the price of ten. Usage (extra minutes, SMS) is metered and
published in a rate card **before** go-live — the site's promise is *no unpublished meters*.
À-la-carte: Governance Readiness Audit $1,500 · custom agents from $2,500 · extra minutes
$0.35/min.

### Industries

Eight verticals, each with its own page: **HVAC · Dental · Legal · Restaurants · Real Estate ·
Auto Services · E-commerce · Professional Services.**

### Compare

`/compare` is the hub. Five head-to-head pages — **GoHighLevel · Synthflow · Smith.ai ·
Artisan / 11x · Human receptionist** — plus a masjid-platform comparison across ten vendors.

Every row carries the source and the date it was read. Where a vendor publishes no pricing
(Artisan, 11x) the table says so rather than guessing; where a claim could not be evidenced the
cell reads *not evidenced* instead of *not offered*.

---

## Masjid AI OS

`/masjids` — an operating system for masjid and Islamic-center work, built around one principle:
**one record, every channel, humans deciding.**

**The lifecycle.** Thirteen defined states, from Draft through Validation, Team Approval,
Communications Review, Content, Flyer, Approved, Published, Registration Open, Upcoming,
Completed and Archived. Requests route to the owning committee — communications, education,
facility, imam, women's, youth, volunteer — and each owner's approval is recorded before anything
is prepared for publishing.

**One record → many channels.** The volunteer enters the event once. Website, mobile app,
newsletter, WhatsApp, social, lobby screens and registration all read from that record, so a date
cannot end up different on the flyer than on the site.

**Integrations, with honest status.** WordPress (publish + verify loop) · Constant Contact
(newsletter assembly) · Cognito Forms (registration, capacity, waitlists) · Google Workspace ·
Stripe or your own processor · CRM platforms · Madina Apps and hall screens · Canva template
library · WhatsApp Business API. Branded mobile app is custom-scoped. Facility deposits,
payments and e-signatures are marked **Planned** — not shipped.

**Assistants.** An AI phone assistant on the masjid's dedicated number and a website assistant,
both answering only from one approved knowledge base. Every answer carries its source receipt.
Religious questions route to a named scholar or imam, and the routing is logged. The assistants
do not issue rulings and do not replace imams or scholars.

**Roles and audit.** Eight roles with explicit authority, from system administrator to read-only.
The audit trail records who acted, when, what action, the previous value, the new value and the
approval history behind it.

**Governance pack.** A periodic, exportable document for the committee: what the AI was asked,
what it answered, what it escalated, who approved what, and what was corrected.

**Six-phase rollout.** Foundation → Communications → Registration & operations → Publishing
automation → Community assistants → Intelligence. Each phase stands alone; the next starts when
the last is working.

---

## Chief-of-Staff Platform

`/chief-of-staff` — one central agent coordinating seven specialists behind a single interface.

| Specialist | Owns |
|---|---|
| **Practice Operations & CFO** | KPIs, pipelines, the cash view — source-linked, reported with receipts |
| **Personal Finance & Planning** | Budgets, plans and reminders inside permission scopes you define |
| **Family & Personal Coordination** | Schedules, logistics and preparation, private by default |
| **Research & Knowledge** | Your documents indexed and searchable — answers with citations |
| **Website & Content Operations** | Content calendar and drafts; publishing always gated by your approval |
| **Asset & Vehicle Management** | Maintenance cadences, logs and reminders |
| **Personal Technology & Google Workspace** | Workspace administered inside your delegated scope |

The Chief-of-Staff holds context, routes tasks to the correct agent, combines results, manages
approvals and produces decision-ready output. Each specialist is a bounded role with its own
permissions and knowledge — coordinated, never autonomous. Every consequential action requires
explicit human approval.

---

## Enterprise governance

`/enterprise` is where the governance model is documented in full.

**Four invariants.** *Capability ≠ Authority* (an AI that can is not an AI that may — least
privilege per role). *Execution ≠ Liability* (your business stays accountable inside delegated
scope). *Deployment ≠ Adoption* (outcomes are proven against acceptance criteria you sign).
*Continuity ≠ Persona* (your memory, rules and evidence survive any model or vendor change).

**Responsibility layers, proof horizons, receipts.** Every public claim carries a horizon —
Built → Deployed → Operated → Verified outcome → Accepted by client — and a lower horizon is
never promoted into a stronger claim. That rule is applied to the site itself: the case studies
are labeled composite personas, not clients.

**Published as controls, not promises.** Permission scopes, approval gates, consent and TCPA
proof trail, per-client data isolation, dedicated numbers, cost governance, audit export and a
72-hour incident notice.

---

## Design system

Tokens live at the top of `assets/css/main.css`.

| Token | Value | Use |
|---|---|---|
| `--cream` | `#FAF7F2` | default page surface |
| `--paper` | `#FFFDF9` | alternating band surface |
| `--ink` | dark | primary text |
| `--muted` | `#5C554E` | secondary text |
| `--rust` | `#C64110` | primary action |
| `--rust-text` | `#A0340D` | rust as text, contrast-safe |
| `--brass` / `--brass-band` | `#B98A2E` / `#D9A93F` | accent, on-dark accent |
| dark bands | `rgb(20,17,14)` / `rgb(27,23,18)` | governance sections |

**Type.** Plus Jakarta Sans 700/800 (display) · Inter 400/500 (body) · JetBrains Mono 400/500
(eyebrows, numerals) · Fraunces 400 italic (accents) — all self-hosted, all preloaded in the
weights actually used above the fold.

**Motion.** GSAP + ScrollTrigger + Lenis, all self-hosted. Reveals are opacity and translate only;
no layout-affecting animation. Everything respects `prefers-reduced-motion`.

---

## Local setup

```bash
git clone https://github.com/mohd-ibadullah/HazirMinds.git
cd HazirMinds
npm install          # only needed for the QA harness
npm run build        # → dist/
npm run serve        # → http://localhost:4173
```

`npm install` is optional for building. If you only want to change content and rebuild, clone and
run `npm run build` — the build itself pulls in nothing.

---

## Building

```bash
node build.js
```

Emits `dist/` from scratch (the folder is deleted first, so nothing stale survives), then:

- copies `img/`, `vendor/`, `assets/`
- copies `deploy/htaccess.conf` → `dist/.htaccess`
- copies `api/lead.php`, `api/config.sample.php`, `api/.htaccess` → `dist/api/`
- writes `sitemap.xml`, `robots.txt`, `llms.txt` and `/ai/index.html`
- **fails the build** if a price literal appears outside `src/data/site.json`

Asset cache-busting is automatic: `main.css` and `main.js` are requested with a
content-derived `?v=<hash>`, so they can be cached for a year while a deploy still takes effect
immediately.

> `api/config.php` and `api/leads.log` are deliberately **not** copied by the build. They hold
> per-deployment values, and a rebuild must never overwrite a live configuration.

---

## Deploying to SpaceShip (cPanel)

The site is plain HTML, so deployment is a file upload — no Node, no build step, no pipeline.

### One-time: confirm your document root

In cPanel, the domain's document root is normally `public_html`. If you added `hazirminds.ai` as
an addon or primary domain, confirm the path under **Domains** before uploading.

### Option 1 — File Manager (no tools needed)

1. `node build.js` locally.
2. Zip the **contents** of `dist/` (not the folder itself — you want `index.html` at the top level
   of the archive, not `dist/index.html`):
   ```bash
   cd dist && zip -r ../hazirminds-site.zip . -x '.*' && cd ..
   ```
   then add the hidden files back — the archive must include `.htaccess`.
3. cPanel → **File Manager** → open the document root → **Upload** → select the zip.
4. Back in File Manager, right-click the uploaded zip → **Extract**.
5. Enable **Settings → Show Hidden Files (dotfiles)** and confirm `.htaccess` and `api/` are present.
6. Delete the zip.

### Option 2 — FTP / SFTP

Upload the entire **contents** of `dist/` into the document root, preserving the folder structure
and including `.htaccess`. FileZilla: enable *Server → Force showing hidden files* so the
dotfile is transferred.

### Option 3 — rsync over SSH (if your plan includes shell)

```bash
rsync -avz --delete dist/ user@server:~/public_html/
```

Note the trailing slashes: `dist/` → `public_html/` copies the contents, which is what you want.
`--delete` removes files you have retired, but it will also remove `api/config.php` if it is not
in `dist/` — exclude it:

```bash
rsync -avz --delete --exclude 'api/config.php' --exclude 'api/leads.log' dist/ user@server:~/public_html/
```

### What `.htaccess` does once it lands

| Behaviour | Detail |
|---|---|
| HTTPS | Forces `https://` and redirects `www.hazirminds.ai` → `hazirminds.ai`, one hop |
| Canonical paths | `/about/` → 301 → `/about`, so one page never answers on two URLs |
| Clean URLs | `/about` is served from `/about/index.html` internally — no redirect, no trailing slash |
| 404 | Serves the branded `/404.html` |
| Compression | gzip/deflate on HTML, CSS, JS, JSON, SVG, XML |
| Caching | CSS/JS one year (they are `?v=` versioned) · images one month · fonts one year · HTML always revalidates |
| Security | `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`, HSTS |
| Locked down | `api/config.php`, `api/leads.log`, repo folders, and directory listing are all denied |

No `Content-Security-Policy` is set on purpose: the pages use inline `<style>` blocks, so a policy
strict enough to be worth having would break the layout. Add one together with nonce plumbing in
the build if you want it.

### Redeploying

Rebuild, then re-upload. Uploading only changed files is enough, except when `main.css` or
`main.js` changed — the version hash in every page's HTML changes with them, so upload the HTML
along with the asset.

---

## Connecting hazirminds.ai and SSL

1. **Point the domain at the hosting.** In SpaceShip, if the domain and the hosting are in the
   same account, attach it in cPanel → **Domains**. Otherwise set the nameservers to the ones
   SpaceShip gives you for the hosting plan, or point an `A` record at the server IP.
2. **Create the mailbox** cPanel → **Email Accounts** → `hello@hazirminds.ai`. The lead form sends
   from this address, and the site's contact links resolve to it.
3. **SSL.** SpaceShip includes a free certificate. cPanel → **SSL/TLS Status** → *Run AutoSSL* —
   it issues via Let's Encrypt once DNS resolves to the server. Give DNS up to an hour to settle
   after the nameserver change; AutoSSL fails while the domain still points elsewhere.
4. **Force HTTPS.** The `.htaccess` already redirects; verify it after the certificate is active.
5. **Verify.** `https://hazirminds.ai` should load, `http://` and `https://www.` should both
   redirect in one hop, and `/about` should render without gaining a trailing slash.

The canonical origin is set in one place — `src/data/site.js` → `url` and `ogBase`. Both are
already `https://hazirminds.ai`, and `ogBase` must match the origin that actually serves, because
`og:image` is fetched from it by every link preview.

---

## Form handling

Two forms — the demo booking form on `/demo` and the Governance Report Card form in the
site-wide modal. Both POST JSON to the endpoint declared on the form
(`data-endpoint`, set from `site.leadEndpoint`).

**The success panel is never shown optimistically.** The form renders success only when the
endpoint answers `{"ok":true}`. Anything else — 4xx, 5xx, network failure, no configuration —
shows a plain failure message and a prefilled `mailto:`, so a lead always has somewhere to go.

### On SpaceShip (PHP)

```bash
cp api/config.sample.php api/config.php
```

Edit `api/config.php`:

```php
return [
    'to'   => 'hello@hazirminds.ai',   // where leads arrive
    'from' => 'hello@hazirminds.ai',   // must be a mailbox on your own domain
];
```

Upload `api/config.php` to `public_html/api/config.php`. Until it exists, `POST /api/lead.php`
answers `503 not_configured` and the form fails closed.

Responses:

| Status | Body | Meaning |
|---|---|---|
| `200` | `{"ok":true}` | accepted and delivered |
| `400` | `{"ok":false,"error":"invalid_input",...}` | missing or invalid fields |
| `405` | `{"ok":false,"error":"method_not_allowed"}` | not a POST |
| `429` | `{"ok":false,"error":"too_many_requests"}` | same IP within 20 seconds |
| `502` | `{"ok":false,"error":"delivery_failed"}` | mail transport refused it |
| `503` | `{"ok":false,"error":"not_configured"}` | `api/config.php` missing or incomplete |

Every submission is also appended to `api/leads.log` — a lead that exists only in a mail queue is
a lead that can be lost, and `api/.htaccess` denies direct access to the file.

**Deliverability.** Use a mailbox on your own domain for `from`. A Gmail or Yahoo address in the
From line fails SPF/DKIM alignment and gets foldered as spam. If you route through a provider,
`api/lead.php` is the one file to swap.

### On a serverless host instead

`api/lead.js` speaks the same contract for Vercel-style functions — set `site.leadEndpoint` to
`/api/lead` in `src/data/site.js` and configure `RESEND_API_KEY`, `LEAD_TO_EMAIL` and
`LEAD_FROM_EMAIL` in the host's environment. The PHP path is what ships configured for SpaceShip.

---

## SEO and AI discoverability

| Artifact | Purpose |
|---|---|
| `sitemap.xml` | all 37 routes, slashless, matching every canonical tag |
| `robots.txt` | crawl rules + sitemap pointer |
| `llms.txt` | a concise, structured summary for AI answer engines — services, pricing, positioning |
| `/ai/` | a machine-readable summary page (`noindex`, for retrieval rather than ranking) |
| Per-page | absolute canonical, `og:` and `twitter:` tags, `og:image` with alt text |
| JSON-LD | `Organization`, `WebSite`, `Service`, `FAQPage` where a page genuinely is one |

**The `/404` page is built but excluded from the sitemap** — advertising an error page invites it
into the index.

---

## Quality gates

The harness in `qa/` is the reason the claim set is trustworthy. All of it runs against a local
preview server.

```bash
npm run serve &            # http://localhost:4173

npm run qa                 # DoD: 49 assertion checks over the built output
npm run qa:e2e             # 38 routes × 3 widths = 114 loads: console errors, overflow, images
npm run qa:contrast        # WCAG contrast on every text node of every route
npm run qa:axe             # axe-core accessibility sweep, 17 rules across 17 pages
npm run qa:cls             # cumulative layout shift, 16 routes × 4 widths
npm run qa:structure       # links, anchors, duplicate IDs, image dims/alt, headings, meta
npm run qa:content         # prices vs the single source, arithmetic, removed-claim sweep
```

A few gates worth knowing about, because they encode decisions rather than mechanics:

- **`qa/finalpass-content.js`** re-derives tier prices and the annual discount arithmetic from
  `src/data/site.json` and fails if a rendered page disagrees.
- **`qa/dod.js`** asserts the *absence* of retired claims (a compliance term the contract does not
  support, a refund guarantee that is no longer offered) — so the gate protects the current
  decision instead of the old one.
- **`qa/finalpass-struct.js`** walks all 37 pages for dead links, dead anchors, duplicate IDs,
  images without dimensions or alt text, heading-order breaks and duplicate meta.

Latest full run: **DoD 49/49 · E2E clean (P0/P1/P2 = 0) · contrast 0 failures · axe 0 violations
across 17 pages · worst CLS 0.013 · structure 0 issues · content 50/50.**

---

## Content rules

These are enforced, not aspirational.

1. **No claim without a source, or a label saying there isn't one.** A statistic without a
   traceable origin is either removed or explicitly marked *vendor estimates — no primary study*.
2. **No proof horizon promoted.** Built ≠ Deployed ≠ Operated ≠ Verified ≠ Accepted. Case studies
   are labeled composite personas; nothing implies a client that does not exist.
3. **No fabricated anything.** No fake clients, logos, testimonials, statistics, certifications,
   names, emails or dashboards.
4. **Hedges stay hedges.** *HIPAA-eligible*, *PCI-aware*, *GDPR-ready* are capability words; none is
   upgraded to a certification word.
5. **Prices live in one file.** `src/data/site.json`. The build enforces it.
6. **Every capability carries a status.** Available, configured at onboarding, planned or custom —
   never left ambiguous.
7. **No partner or backend disclosure.** The site presents one company and one platform.

---

## Day-to-day maintenance

**Change a price.** Edit `src/data/site.json`, run `node build.js`, upload the changed HTML.

**Add or edit copy.** The page modules in `src/pages/` are template strings; content that repeats
lives in `src/data/`.

**Add a page.** Create a module exporting `{ file, html }`, register it in `build.js`, rebuild —
the sitemap, nav and internal link checks pick it up.

**Add a service.** Append to the right group in `src/data/services.js`; the group's label in the
same file sets its honesty status.

**Refresh a competitor row.** Update `src/data/site.json` and the row's `source` string with the
date you read it, then rebuild. The comparison pages render the source line from that field.

**Refresh a vendored library.** `npm install`, copy from `node_modules` into `vendor/`, rebuild.

---

## License

Proprietary and confidential. © 2026 HazirMinds. All rights reserved.

This repository is public for reference only. No license is granted to copy, modify, distribute
or deploy this code, its content, its copy or its design system.
