# hazirminds.ai

Marketing website for Hazirminds, built with [Astro](https://astro.build). Pages ship as static HTML; small vanilla TypeScript scripts power the interactive parts (hero flow, problem tabs, estimators, FAQ search, booking form).

## Requirements

- Node.js 18.20+ or 20+
- npm (or pnpm / yarn)

## Run it locally

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static output in ./dist
npm run preview    # serve ./dist locally
```

## Put it in Git

```bash
git init
git add .
git commit -m "Initial Hazirminds site"
git branch -M main
git remote add origin git@github.com:<your-org>/hazirminds-site.git
git push -u origin main
```

## Project structure

```
src/
  layouts/Base.astro        <html>, <head>, header, footer
  components/               Shared UI: Header, Footer, Logo, Icon, Tile, FaqList, FaqSection, CtaBand, Breadcrumb
  components/home/          Home page sections with their own scripts
  data/site.ts              Navigation, services, contact details, legal links
  data/types.ts             Shared types
  styles/global.css         Design tokens, service colors and base styles
  pages/                    One file per route (index.astro = /)
public/                     favicon, robots.txt
```

## Design tokens

All colors, spacing and type sizes live in `src/styles/global.css` and match the Hazirminds Design System.

**Service colors (Vivid).** Each service owns one color. Add the class to any element and its children pick up `--tile`, `--tint` and `--wash`:

| Class | Service | Tile | Tint | Wash |
|---|---|---|---|---|
| `.c-rec` | AI Receptionist | #D5EDE3 | #0F6B57 | #E8F2EE |
| `.c-web` | AI-Powered Website, Custom Websites | #DBE8F7 | #2B5C8F | #EAF0F8 |
| `.c-com` | Automated Communications | #FBE0D6 | #A23E1E | #FBEEE7 |
| `.c-pipe` | Client Pipeline & Dashboard | #F8EACB | #8A5A00 | #FAF3E1 |
| `.c-infra` | Managed Infrastructure, Custom Integrations | #E6E0F5 | #5B3E9A | #F0ECF8 |

Brand green (`--green`) stays for buttons, links, focus rings and selected states.

## Routes

| Route | Page |
|---|---|
| / | Home |
| /services | Services overview |
| /ai-receptionist, /ai-powered-website, /automated-communications, /client-pipeline-dashboard, /managed-infrastructure | AI service pages |
| /custom-websites-mobile-apps, /custom-integrations-software | Custom work |
| /industries, /security, /pricing, /about, /see-it-in-action, /faq | Company and resources |
| /book-a-discovery-call | Booking form |
| /masjids, /masjids/faq | Masjids and Islamic centers |
| /privacy, /terms, /ai-disclosure, /accessibility, /free-website-terms | Legal |

## Deploy to AWS (S3 + CloudFront)

1. `npm run build`
2. `aws s3 sync dist/ s3://<bucket> --delete`
3. `aws cloudfront create-invalidation --distribution-id <id> --paths "/*"`
4. In CloudFront, set the custom error response for 403/404 to `/404.html` with status 404.
5. Because pages build as `/route/index.html`, add a CloudFront Function that appends `index.html` to directory requests.

## Before launch

- [ ] Connect the discovery call form to its destination (email, CRM or scheduler) — see `src/pages/book-a-discovery-call.astro`
- [ ] Add the analytics tools, then list them in the Privacy Policy (section 4)
- [ ] Run the accessibility checklist and add any known limitations to /accessibility
- [ ] Optionally self-host Inter, Fraunces and Material Symbols instead of Google Fonts
- [ ] Add an Open Graph image at `public/og.png`

## Interactive demos

The sample demos (assistant chat, workflow preview, pipeline, call walkthrough, tool map, industry finder, service planner, product tour, estimators, opportunity finder, FAQ search, booking form) live in `src/components/demos/`:

- `templates/<Name>.html` — markup with `{{ path }}` holes, `<sc-if value="{{ x }}">` and `<sc-for list="{{ xs }}" as="x">`
- `logic/<Name>.js` — a small class with `state`, `setState()` and `renderVals()`, ported from the approved design files
- `<Name>.astro` — the mount point; `src/lib/dc-runtime.js` renders the template in the browser

To change a demo's copy, edit its template or the data arrays in its logic file.

## Pages

All 25 pages from the approved designs are built: Home, Services, 5 AI service pages, 2 custom work pages, Industries, Security, Pricing, About, See it in action, FAQ, Book a Discovery Call, Masjids, Masjid FAQ, 5 legal pages and 404.

## Known follow-ups

- The booking form validates and walks through every step in the browser, but doesn't send anything yet. Wire the final submit in `src/components/demos/logic/BookingForm.js` to your email, CRM or scheduler (an AWS Lambda or a form service both work).
- Pages converted from the designs keep their inline styles. Over time, move repeated patterns into the shared components in `src/components`.
