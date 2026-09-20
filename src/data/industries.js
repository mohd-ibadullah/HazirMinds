// HazirMinds — industry taxonomy. 11 umbrella industries → sub-sectors.
//
// Structure decided after reviewing SBA "United States 2026" small-business counts by NAICS sector,
// the Census NAICS hierarchy, and the industry navigation of Smith.ai (9 verticals), Ruby (6),
// AnswerConnect (48) and Dialzara (82). The market splits into broad umbrella and granular long tail;
// this site uses the hybrid — 11 umbrellas that stay readable in a navbar, sub-sectors on the page.
//
// A sub-sector appears here only where HazirMinds' actual services are genuinely relevant AND the
// sector appears in at least one independent competitor taxonomy or in the SBA sector data.
// Everything deliberately excluded, and why, is in `exclusions` — that list is what keeps
// "we serve everyone" off the site.
//
// Replaces the previous 8 flat trade pages. Those carried eight unsourced statistics labelled
// "(illustrative)"; every one of them is gone. Pages now reference one of the four figures this site
// has a source for, by KEY, resolved below.
const SJ = require('./site.json');

const groups = [
  ...require('./industries/group-1'),
  ...require('./industries/group-2'),
  ...require('./industries/group-3')
];

/* The ONLY four performance numbers this site has a source for. A page references one by KEY, and the
   figure is resolved here — so the same number always comes from the same place and no page carries
   a per-industry statistic invented for it. */
const STAT = {
  unanswered: SJ.stats[0],   // 62% — 411 Locals (2016), vendor study, 85 businesses over 30 days
  response: SJ.stats[1]      // ~5 min — InsideSales.com / MIT Lead Response Management (Oldroyd, 2007)
};

const items = groups.map((g, i) => Object.assign({}, g, {
  n: String(i + 1).padStart(2, '0'),
  href: '/industries/' + g.key,
  statObj: g.stat ? STAT[g.stat] : null
}));

/* Sectors that are real and large, and that we are deliberately NOT claiming. Counts are small
   businesses per sector: SBA Office of Advocacy, "United States 2026". */
const exclusions = [
  { name: 'Agriculture, Forestry, Fishing & Hunting', count: '286,246', why: 'Seasonal and commodity-driven, with almost no inbound consumer call volume.' },
  { name: 'Mining, Quarrying & Oil and Gas Extraction', count: '94,390', why: 'Enterprise and B2B procurement, not an SMB front desk.' },
  { name: 'Utilities', count: '23,829', why: 'Regulated and non-competitive — there is no call-capture problem to solve.' },
  { name: 'Manufacturing (as a whole)', count: '632,885', why: 'Mostly B2B and wholesale. Only the order-taking and after-hours dispatch slice is addressable, and that sits inside Retail & Order-Taking.' },
  { name: 'Management of Companies & Enterprises', count: '18,040', why: 'Holding companies. There is no front desk.' },
  { name: 'Transportation & Warehousing', count: '4,089,883', why: 'Mostly owner-operator trucking and warehousing. Towing, moving, black-car and freight brokerage are addressable and sit inside Automotive & Fleet.' }
];

/* The seven flat trade pages whose URL actually CHANGED, each 301'd to its umbrella rather than
   deleted, so no existing link or search result 404s. Consumed by vercel.json and deploy/htaccess.conf.
   'legal' is deliberately absent: that umbrella kept its slug, so /industries/legal is the same page it
   always was. Listing it here (or in either config) would emit a 301 from a URL to itself — a loop the
   gate below now refuses to build. */
const legacy = {
  hvac: 'home-field-services',
  dental: 'healthcare-dental',
  restaurant: 'food-hospitality-events',
  realestate: 'real-estate-property',
  auto: 'automotive-fleet',
  ecommerce: 'retail-ecommerce-order-taking',
  proservices: 'business-services-agencies'
};

module.exports = { items, exclusions, legacy, STAT };
