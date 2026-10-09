// @ts-nocheck
// Ported from the approved design file "FAQ".
import { DCLogic, React } from '../../../lib/dc-runtime.js';

/** Question and answer list. Exported so /faq can publish it as FAQPage structured data. */
export const FAQ_ITEMS = [
  ['general', 'What does HazirMinds do?', 'HazirMinds is your AI solutions partner. We identify where AI can solve real business problems and implement the right solution — starting small, growing as you do.'],
  ['general', 'Do I need to understand AI to work with you?', "No. You don't need to understand AI — that's our job. You just need to know what results you want."],
  ['ai', 'Does the AI make decisions without our permission?', "No. The AI prepares and recommends. Any consequential action needs explicit human approval. If it's unsure, it says so and routes the question to a person."],
  ['ai', "Will callers and visitors know they're talking to an AI?", 'Yes. Our AI introduces itself as an AI at the start of every call and conversation.', 'ai'],
  ['ai', "What happens when the AI doesn't know an answer?", "It says so and passes the question to a person on your team, with the caller's or visitor's contact details. It answers only from your approved knowledge."],
  ['ai', 'Will it message people without our approval?', 'No. Messages run only through workflows your team approves, and sensitive or consequential messages wait for a person.'],
  ['pricing', 'How does pricing work?', 'Pricing is built around your use case and its complexity. Plans are month-to-month, standard services have no setup fee, and usage is billed at actual provider cost.', 'pricing'],
  ['pricing', 'Is there a setup fee?', 'No setup fee for standard services. A setup fee applies only when customization is required.'],
  ['pricing', 'Is there a long-term contract?', "No. Plans are month-to-month, and you can leave with 30 days' written notice."],
  ['pricing', 'How is usage billed?', 'Voice minutes, text and WhatsApp messages, and AI processing are billed separately at actual provider cost, with no markup.'],
  ['pricing', 'What does the free website include?', 'When you subscribe to at least one AI service, you get a static website of up to 5 pages with one revision round, and you keep it if you leave.', 'fsw'],
  ['pricing', 'How is custom work priced?', 'Each project is quoted as a fixed price, after we assess your needs and gather your requirements. Work starts only after you approve the quote.'],
  ['pricing', 'What happens if we leave?', "You own your data. Give 30 days' written notice, and you get a full export in a standard format within a 90-day window."],
  ['data', 'Is my data safe?', 'Your data is encrypted in transit and at rest, kept in your own isolated environment, and hosted on our managed AWS in the US — or on your own server if you prefer.', 'security'],
  ['data', 'Where is our data stored?', 'With our managed hosting, on AWS in the United States, and it stays on US servers. If you choose to host on your own server, it stays there.'],
  ['data', 'How is our data encrypted?', 'With TLS in transit and AES-256 at rest.'],
  ['data', 'Can another client see our data?', 'No. Every client has its own isolated environment, enforced at the database level.'],
  ['data', 'Who at HazirMinds can access our data?', 'Our platform team has access only for technical support, and only with your prior consent. Inside your organization, access is role-based and enforced by the system.'],
  ['data', 'Are AI and admin actions logged?', 'Yes. Consequential actions are logged with who, when, what changed and what approval was given, and the log is available to you.'],
  ['data', 'Is our data used to train AI models?', 'Not for others. Your data is never used to train models for other customers without your written opt-in.'],
  ['data', "What happens if there's a security incident?", "We notify you without undue delay, and no later than 72 hours after we're notified of a confirmed incident, with what happened, what data was affected and the remediation steps."],
  ['data', 'Which subprocessors do you use?', 'Our core providers include AWS (hosting), Twilio (voice and messaging) and Anthropic (AI models). The full subprocessor list is in our Data Processing Agreement. We never sell or share data for marketing.'],
  ['data', 'Do you have SOC 2 or ISO 27001?', "We don't hold SOC 2 or ISO 27001 today. We'll pursue formal certification when client requirements call for it. We will never claim a certification we don't hold."],
  ['data', 'Do you handle health information?', 'Work involving health information is scoped separately (HIPAA) before any health data is processed.'],
  ['data', 'Who owns my website, domain and data?', 'You do. You own your domain, hosting, website content and data.'],
  ['data', 'Can I export my data?', 'Yes. You own your data, and you get a full export in a standard format within 90 days if you leave.'],
  ['rec', 'Can it book appointments?', 'Yes. Booking appointments directly is part of the standard service.'],
  ['rec', 'Are calls recorded, and who can hear them?', 'Recordings and transcripts stay in your isolated environment. Only authorized users in your organization can access them.'],
  ['rec', 'Will it call or text people on its own?', 'No. It answers inbound calls only. All automated messages follow workflows you approve.'],
  ['rec', 'How is the AI Receptionist priced?', "Pricing is custom, based on your use case and complexity. It's month-to-month with no setup fee for the standard service, and usage is billed at actual provider cost with no markup."],
  ['web', 'Can visitors talk to it by voice?', 'Yes. The website has built-in AI chat and voice.'],
  ['web', 'Is the AI-Powered Website the same as the free static website?', "No. The free static website is a simple site of up to 5 pages, built from templates, included when you subscribe to at least one AI service. The AI-Powered Website is a custom site we design and build for you, with AI chat and voice built in, and it's quoted for you.", 'compare'],
  ['web', 'How is the AI-Powered Website priced?', 'We quote the build as a fixed price, after we assess your needs and gather your requirements. The ongoing service is month-to-month, and usage is billed at actual provider cost with no markup.'],
  ['com', 'What kinds of messages can it send?', 'Confirmations, follow-ups, reminders and notifications. Each one can go by text, email, WhatsApp or phone call, whichever suits your customers.'],
  ['com', 'Can a person check a message before it goes out?', 'Yes. Any step in a workflow can be set to wait for approval.'],
  ['com', "Who's responsible for consent?", "You are, for your own contacts. We set workflows up so messages go only to people you're permitted to contact."],
  ['com', 'How is Automated Communications priced?', "Pricing is custom, based on your use case and complexity. It's month-to-month with no setup fee for the standard service, and usage, such as text messages, WhatsApp messages and call minutes, is billed at actual provider cost with no markup."],
  ['pipe', 'Who on my team can see what?', 'Access is role-based and enforced by the system, so each person sees only what their role allows.'],
  ['pipe', 'Does it show calls from the AI Receptionist?', 'Yes. Call activity is visible in your dashboard, and call history appears next to each contact.'],
  ['pipe', 'Can it connect to the tools we already use?', 'Custom integrations with your existing business systems are scoped and quoted separately.', 'cint'],
  ['pipe', 'How is the Pipeline & Dashboard priced?', "Pricing is custom, based on your use case and complexity. It's month-to-month with no setup fee for the standard service."],
  ['infra', 'Is my data kept separate from other clients?', 'Yes. Each client gets an isolated environment, enforced at the database level.'],
  ['infra', 'Can we host on our own server?', 'Yes, as a separately scoped option. Responsibilities for that server are agreed in writing. The monitoring, backups and maintenance described here apply to managed hosting.'],
  ['custom', 'How is a custom website different from the free website?', 'The free static website comes with any AI service: up to 5 pages and one revision round. A custom website goes beyond that, designed around how your business works.'],
  ['custom', 'Do we have to replace the software we use now?', "Usually not. Much of the value comes from connecting and properly setting up the tools you already have. If something genuinely needs replacing, we'll tell you why."],
  ['custom', 'Can you connect to any tool?', 'Not always. It depends on what each tool allows. We review your tools on the first call and tell you honestly what can connect.'],
  ['custom', 'Who owns the custom software?', "Unless your agreement says otherwise, you own what we build specifically for you once it's paid in full, apart from our own platform technology. Your data is always yours."],
  ['custom', 'Where will custom work be hosted?', 'On our managed AWS hosting in the US by default, in your own isolated environment, or on your own server if you prefer. A self-hosted setup is scoped separately.']
];

export default class Component extends DCLogic {
  state = { w: typeof window !== 'undefined' ? window.innerWidth : 1440, q: '', topic: 'all' };
  TOPICS = [
    ['all', 'All topics', 'apps'], ['general', 'Getting started', 'waving_hand'], ['ai', 'AI and human control', 'how_to_reg'],
    ['pricing', 'Pricing and terms', 'request_quote'], ['data', 'Data and security', 'lock'],
    ['rec', 'AI Receptionist', 'call'], ['web', 'AI-Powered Website', 'language'], ['com', 'Automated Communications', 'forward_to_inbox'],
    ['pipe', 'Client Pipeline & Dashboard', 'view_kanban'], ['infra', 'Managed Infrastructure', 'cloud_done'], ['custom', 'Custom work', 'hub']
  ];
  componentDidMount() {
    this.onResize = () => this.setState({ w: window.innerWidth }); window.addEventListener('resize', this.onResize);
    try { const t = new URLSearchParams(window.location.search).get('topic'); if (t && this.TOPICS.some(x => x[0] === t)) this.setState({ topic: t }); } catch (e) {}
  }
  componentWillUnmount() { window.removeEventListener('resize', this.onResize); }
  renderVals() {
    const s = this.state;
    const L = { pricing: ['How pricing works', '/pricing'], security: ['Security & Trust', '/security'], ai: ['How we use AI', '/ai-disclosure'], fsw: ['Free Static Website Terms', '/free-website-terms'], compare: ['Compare the two websites', '/ai-powered-website#compare'], cint: ['Custom Integrations & Software', '/custom-integrations-software'] };
    const F = FAQ_ITEMS;
    const terms = s.q.toLowerCase().split(/\s+/).filter(Boolean);
    const hit = f => terms.every(t => (f[1] + ' ' + f[2]).toLowerCase().includes(t));
    const groups = this.TOPICS.filter(t => t[0] !== 'all' && (s.topic === 'all' || s.topic === t[0])).map(t => ({
      hid: 'faq-' + t[0], label: t[1], icon: t[2],
      items: F.filter(f => f[0] === t[0] && hit(f)).map(f => { const l = f[3] ? L[f[3]] : null; return { q: f[1], a: f[2], hasLink: !!l, linkLabel: l ? l[0] : '', href: l ? l[1] : '#' }; })
    })).filter(g => g.items.length);
    const n = groups.reduce((a, g) => a + g.items.length, 0);
    const topics = this.TOPICS.map(([id, label, icon]) => { const sel = s.topic === id; return { id, label, icon, sel, bg: sel ? '#E3EDE9' : 'transparent', fg: sel ? '#0B3A35' : '#2F3633', fw: sel ? '600' : '400', go: () => this.setState({ topic: id }) }; });
    return {
      wide: s.w >= 960, narrow: s.w < 960, q: s.q, topic: s.topic, hasQuery: terms.length > 0, topics, groups,
      resultLine: terms.length ? (n === 1 ? '1 question' : n + ' questions') + ' match "' + s.q.trim() + '"' : '',
      empty: n === 0, canWiden: s.topic !== 'all',
      onQ: e => this.setState({ q: e.target.value }), clearQ: () => this.setState({ q: '' }),
      onTopic: e => this.setState({ topic: e.target.value }), widen: () => this.setState({ topic: 'all' })
    };
  }
}
