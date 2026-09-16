// HazirMinds governance + comparison data (verified 2026 competitor research)
// Competitor matrix cells + sourced stats live in site.json (single source) — this file adds doctrine + per-page content.
const JS = require('./site.json');
const C = JS.competitors;

module.exports = {
  /* Four invariants — home S7 + /enterprise */
  invariants: [
    { t: 'Capability ≠ Authority', d: '“Ability is not authority.” An AI that can do a thing is not an AI that may do a thing — every agent carries least-privilege permissions per role: what it may touch, spend, say or send.' },
    { t: 'Execution ≠ Liability', d: '“Execution is not liability.” Your business stays accountable. Our AI carries work inside delegated scope — and the boundary of that scope is written, enforced and auditable.' },
    { t: 'Deployment ≠ Adoption', d: '“Deployment is not adoption.” Going live proves nothing by itself. We prove outcomes against go-live acceptance criteria you sign — and report against them openly.' },
    { t: 'Continuity ≠ Persona', d: '“Continuity is not persona.” Your memory, rules and evidence survive any model or vendor change. The substrate persists; components underneath can be swapped without losing your business.' }
  ],

  /* Doctrine lines — /enterprise (§2) */
  doctrine: [
    { t: 'Governance compounds in the substrate — it accumulates as policy', d: 'Controls live inside the HazirMinds Operating Substrate: they apply to every agent, every workflow, every deployment — automatically, not by memo.' },
    { t: 'Office persists, agents execute', d: 'The Office (scope, permissions, lineage, evidence) outlives every individual agent. Change a model, swap a specialist — the office and its rules stay put.' },
    { t: 'Capability plateaus, governance compounds', d: 'Every vendor can rent the same models; capability converges. What compounds is the governed record of what your AI did, was allowed to do, and proved it did.' }
  ],

  /* Responsibility layers — animated diagram */
  layers: [
    { n: '1', t: 'Principal', d: 'You — the authority holder. Nothing consequential happens without rules you set or approvals you give.' },
    { n: '2', t: 'Operative', d: 'Your team seat. Humans hold delegation, review and override; the org chart stays intact.' },
    { n: '3', t: 'AI Operator', d: 'A bounded machine role with explicit permissions — it acts, never decides what it may act on.' },
    { n: '4', t: 'Office / Scope', d: 'The durable boundary: permissions, lineage and evidence rules that survive staff and model changes.' },
    { n: '5', t: 'Receipts', d: 'Evidence of what was sourced, decided, executed, verified, accepted — or left open. Exportable, always.' }
  ],

  /* Proof horizons — trust stepper */
  horizons: [
    { t: 'Built', d: 'The capability exists and was demonstrated.' },
    { t: 'Deployed', d: 'It runs in a live client environment.' },
    { t: 'Operated', d: 'It has run under real load, over time.' },
    { t: 'Verified outcome', d: 'The result was measured against agreed criteria.' },
    { t: 'Accepted by client', d: 'The client signed the acceptance. The claim is closed.' }
  ],

  /* Governance chips */
  chips: ['permission scopes', 'approval gates', 'full audit trail', 'cost governance', 'data isolation per client', 'dedicated numbers', '72-hour incident notice (our commitment)', 'consent & TCPA proof trail'],

  /* Verified 2026 comparison matrix — cells from site.json (single source) */
  matrix: {
    dims: ['Model', 'Entry price', 'Cost at ~100 calls/mo', 'Hidden meters', 'Governance / hallucination control', 'Chief-of-Staff multi-agent', 'Evidence-labeled claims'],
    rows: C.map(r => ({ name: r.name, slug: r.slug, cells: [r.model, r.entry, r.at100, r.meters, r.gov, r.cos, r.evidence], source: r.source, flag: r.flag }))
  },

  /* Per-competitor page content — text lives in site.json.competitorPages (single source) */
  pages: JS.competitorPages,
  /* Sourced stats used across pages — from site.json (single source) */
  sourcedStats: [...JS.stats, ...JS.trustStats].map(s => ({ stat: s.value, label: s.label, src: s.source }))
};
