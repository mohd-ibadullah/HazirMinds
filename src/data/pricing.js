// HazirMinds pricing — 4 tiers, feature matrix, à-la-carte, FAQs
// Numbers (tiers, add-on prices) live in site.json — this file adds the feature matrix + FAQ content.
const JS = require('./site.json');

const tierMeta = {
  chronos: { tagline: 'For solo operators who are done losing calls.', best: false },
  'hazir-pro': { tagline: 'The complete governed front office for growing teams.', best: true },
  aeon: { tagline: 'A full governed AI department for established businesses.', best: false },
  archon: { tagline: 'Enterprise governance + Chief-of-Staff programs, scoped per engagement.', best: false }
};

module.exports = {
  tiers: Object.entries(JS.tiers).map(([id, t]) => ({ id, ...t, ...tierMeta[id] })),
  featureRows: [
    { label: 'AI voice receptionist', chronos: 'core', 'hazir-pro': 'core', aeon: 'core', archon: 'core' },
    { label: 'Minutes included / month', chronos: '300', 'hazir-pro': '800', aeon: '2,000', archon: 'Custom' },
    { label: 'Missed-call text-back', chronos: true, 'hazir-pro': true, aeon: true, archon: true },
    { label: 'Website chat agent', chronos: false, 'hazir-pro': true, aeon: true, archon: true },
    { label: 'SMS agent & reminders', chronos: 'basic', 'hazir-pro': true, aeon: true, archon: true },
    { label: 'AI appointment setter', chronos: false, 'hazir-pro': true, aeon: true, archon: true },
    { label: 'Speed-to-lead automation', chronos: false, 'hazir-pro': true, aeon: true, archon: true },
    { label: 'AI SDR & outbound campaigns', chronos: false, 'hazir-pro': false, aeon: true, archon: true },
    { label: 'Database reactivation', chronos: false, 'hazir-pro': false, aeon: true, archon: true },
    { label: 'Review & reputation AI', chronos: false, 'hazir-pro': true, aeon: true, archon: true },
    { label: 'Workflow automation', chronos: false, 'hazir-pro': 'core', aeon: 'core', archon: 'core' },
    { label: 'CRM setup & management', chronos: false, 'hazir-pro': true, aeon: true, archon: true },
    { label: 'Custom AI employee', chronos: false, 'hazir-pro': false, aeon: '1', archon: 'Team' },
    { label: 'KPI dashboard & reporting', chronos: false, 'hazir-pro': true, aeon: true, archon: true },
    { label: 'Call analytics & sentiment', chronos: false, 'hazir-pro': false, aeon: true, archon: true },
    { label: 'Governance: permission scopes & approval gates', chronos: 'substrate', 'hazir-pro': 'substrate', aeon: 'substrate', archon: 'core' },
    { label: 'Audit trail & evidence receipts', chronos: 'substrate', 'hazir-pro': 'substrate', aeon: 'substrate', archon: 'core' },
    { label: 'Hallucination-control program', chronos: false, 'hazir-pro': false, aeon: false, archon: true },
    { label: 'Chief-of-Staff agent team', chronos: false, 'hazir-pro': false, aeon: false, archon: 'Scoped per engagement' },
    { label: 'Dedicated success manager', chronos: false, 'hazir-pro': false, aeon: true, archon: true },
    { label: 'Acceptance criteria you sign', chronos: true, 'hazir-pro': true, aeon: true, archon: true }
  ],
  alc: JS.addons,
  faqs: [
    { q: 'Will it sound robotic?', a: 'Callers hear a calm, professional voice with natural pacing — many callers never realise it\'s AI. You approve the voice, greeting and scripts before we go live, and you can listen to real recordings from your dashboard any time.' },
    { q: 'What happens when it can\'t answer something?', a: 'It says so honestly. Our hallucination controls allow grounded answers only from your approved knowledge; low-confidence moments are disclosed and escalated to a human. You set the forbidden-topic list and the escalation rules — every factual claim the agent makes carries a source receipt.' },
    { q: 'Is it compliant? Consent and TCPA?', a: 'Every consent-critical interaction carries a TCPA proof trail — consent capture, disclosure and revocation handling are configured before any campaign goes live. Governance isn\'t a policy PDF: permission scopes, approval gates and audit trails are part of how your environment is configured.' },
    { q: 'We already use HubSpot — can you work with that?', a: 'That\'s exactly how we deploy. HazirMinds connects to the tools you already run — HubSpot, Salesforce, Pipedrive, Clio, ServiceTitan, Shopify and dozens more — so nothing about your stack has to change.' },
    { q: 'What exactly is "governed AI"?', a: 'Bounded authority: each agent has least-privilege permissions per role; sensitive actions pause for human approval; every action, decision and handoff is logged as an evidence receipt; and every public claim we publish carries a proof-horizon label (Built → Deployed → Operated → Verified outcome → Accepted). You can audit all of it, any time.' },
    { q: 'Am I locked into a contract?', a: 'No. Every plan is month-to-month after the first 60 days. We earn the renewal every month by being worth it, not by trapping you in paperwork. (Enterprise Chief-of-Staff engagements are scoped per engagement with their own acceptance criteria — agreed in writing before work starts.)' },
    { q: 'What counts as a minute?', a: 'Time your AI spends on live calls, exactly like a phone bill. Chat, SMS and internal automation don\'t consume call minutes. And there are no unpublished meters anywhere: the full usage rate card is in your hands before go-live. Extra usage bills at ' + JS.addons.find(a => a.id === 'minutes').price + ' or per the published rate card.' },
    { q: 'How fast can we go live?', a: 'Most HazirMinds deployments are live in 7–14 days: a short discovery call, your scripts and voice approved in week one, then a supervised launch with real traffic and weekly tuning. Go-live follows structured acceptance criteria you sign off — deployment is not adoption until the outcomes are proven.' },
    { q: 'What if it doesn\'t work for my business?', a: 'Then we would rather lose the fee than keep you on an AI team that isn\'t paying for itself. Your plan is month-to-month after the first 60 days, and we measure every deployment against the acceptance criteria you signed at kickoff — so you can leave on 30 days\' notice if the outcomes aren\'t there.' }
  ]
};
