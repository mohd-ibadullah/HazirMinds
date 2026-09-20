// HazirMinds site-wide data: nav, marquee, personas, transcripts
/* The Industries menu is generated from the taxonomy module itself, so a new umbrella shows up in the
   navbar, the mega menu and the /industries hub together — or in none of them.
   Eleven umbrellas over two columns. */
const INDUSTRIES = require('./industries').items;
const industryMega = (function () {
  const half = Math.ceil(INDUSTRIES.length / 2);
  return [INDUSTRIES.slice(0, half), INDUSTRIES.slice(half)].map(col => ({
    col: col.map(d => ({
      name: d.name,
      href: d.href,
      desc: d.subsectors.slice(0, 3).map(x => x[0]).join(' · ')
    }))
  }));
})();

module.exports = {
  name: 'HazirMinds',
  domain: 'hazirminds.ai',
  url: 'https://hazirminds.ai',
  /* Where share-preview images and structured-data assets must be fetched from RIGHT NOW.
     site.url stays the canonical domain for SEO, but hazirminds.ai is not serving yet
     (verified: connection fails), so every og:image pointed at a dead host and every shared
     link resolved to a broken preview. The custom domain is now live, so ogBase === site.url. */
  ogBase: 'https://hazirminds.ai',
  leadEndpoint: '/api/lead',
  email: 'contact@hazirminds.ai',
  /* Empty until a real, working number exists. The site previously carried "+1 (888) 555-0142";
     the 555-01xx range is reserved for fiction, so it could never connect. Set this to a real
     number and every contact CTA across the site switches back from email to a call link. */
  phone: '',
  tagline: 'Always present. Never missed.',
  taglineAlt: 'Never miss the moment.',
  substrate: 'HazirMinds Operating Substrate',
  desc: 'HazirMinds deploys and runs governed AI teams — receptionists, sales agents and automations on a governed substrate — done-for-you, for US businesses that lose money to voicemail.',

  nav: [
    {
      label: 'Products', href: '/services', mega: [
        { col: [
          { name: 'Chief-of-Staff Platform', href: '/chief-of-staff', desc: 'FLAGSHIP — One front door to your AI team' },
          { name: 'Masjid AI OS', href: '/masjids', desc: 'FLAGSHIP — Operating system for masjids' },
          { name: 'All services A–E', href: '/services', desc: 'The full contract-aligned catalog' }
        ]}
      ]
    },
    {
      /* A plain link to the hub — the umbrella list lives in the mega menu below it. */
      label: 'Industries', href: '/industries', mega: industryMega
    },
    {
      /* The Compare dropdown was removed by request: the individual comparison pages it listed
         are gone, so the nav item is a plain link to the hub. */
      label: 'Compare', href: '/compare'
    },
  ],

  marquee1: ['HubSpot', 'Salesforce', 'Pipedrive', 'Zoho', 'Google Calendar', 'Outlook', 'Calendly', 'Twilio', 'Zapier', 'Make', 'n8n', 'ServiceTitan'],
  marquee2: ['Jobber', 'Housecall Pro', 'Clio', 'Filevine', 'Lawmatics', 'OpenTable', 'SevenRooms', 'Shopify', 'WooCommerce', 'Slack', 'Stripe', 'Square'],

  // 3-beat home transcript scenes
  transcript: [
    {
      name: 'Home Services',
      lines: [
        { who: 'ai', text: 'Summit Heating & Air — HazirMinds AI, this is Zoya. How can I help you today?' },
        { who: 'caller', text: 'Hi — my AC just quit and it\'s 96 degrees. Can someone come today?' },
        { who: 'ai', text: 'I\'m sorry to hear that — let\'s get you cooled down. I have a technician available between 2 and 4 PM. Does that work?' },
        { who: 'caller', text: 'Perfect, yes please.' },
        { who: 'ai', text: 'Done! You\'re booked for today between 2–4 PM. I\'ve texted you the confirmation and the tech will call 30 minutes out.' }
      ],
      book: ['Appointment booked', 'CRM updated', 'SMS sent']
    },
    {
      name: 'Dental',
      lines: [
        { who: 'ai', text: 'Brightwater Dental — HazirMinds AI, Zoya speaking. How may I help you?' },
        { who: 'caller', text: 'I chipped a tooth — do you have anything this week? I\'m not a patient yet.' },
        { who: 'ai', text: 'We can see you Thursday at 9:20 AM for an emergency exam. I\'ll take a few details and reserve it — is Thursday good?' },
        { who: 'caller', text: 'Thursday works.' },
        { who: 'ai', text: 'You\'re all set. New-patient forms are on their way by text — see you Thursday!' }
      ],
      book: ['Appointment booked', 'CRM updated', 'SMS sent']
    },
    {
      name: 'Law Firm',
      lines: [
        { who: 'ai', text: 'Hartley & Rowe — HazirMinds AI, this is Zoya. How can I point you in the right direction?' },
        { who: 'caller', text: 'I was in a car accident Tuesday. Do you take cases like that?' },
        { who: 'ai', text: 'We do. I can schedule a free consultation with an attorney — are you seeking medical treatment currently?' },
        { who: 'caller', text: 'Yes, since Wednesday.' },
        { who: 'ai', text: 'Thank you. I\'ve reserved a consultation for tomorrow at 10 AM and sent the details to your phone.' }
      ],
      book: ['Consult booked', 'CRM updated', 'SMS sent']
    }
  ],

  personas: [
    {
      name: 'The Overbooked Owner', trade: 'Home Services · 11 technicians',
      mark: 'HS',
      quote: 'We were missing 60-plus calls a week in peak season. Now every one is answered, priced and booked before I even see my phone.',
      metrics: [ ['+38%', 'booked jobs'], ['0', 'missed calls'], ['11 hrs', 'phone time saved weekly'] ],
      horizon: 'MODELED OUTCOME — representative persona, not a client',
      scenario: 'A growing HVAC shop drowning in peak-season calls. HazirMinds answers every line, books straight into ServiceTitan-style scheduling, and texts status updates between jobs.'
    },
    {
      name: 'The Full-Clinic Partner', trade: 'Dental · 3-chair practice',
      mark: 'DP',
      quote: 'Our front desk finally breathes. New patients get booked at 9 PM on a Sunday, and no-shows dropped by half in the first month.',
      metrics: [ ['+27%', 'new patients'], ['−52%', 'no-shows'], ['24/7', 'coverage'] ],
      horizon: 'MODELED OUTCOME — representative persona, not a client',
      scenario: 'A three-chair dental practice with a two-person front desk. HazirMinds handles new-patient calls with consent capture and encrypted transcripts, sends smart confirmations, and refills cancellations automatically.'
    },
    {
      name: 'The Always-in-Court Attorney', trade: 'Legal · 6-attorney firm',
      mark: 'LF',
      quote: 'Intake used to die at 6 PM. Now signed retainers arrive Monday morning from calls that came in over the weekend.',
      metrics: [ ['+31%', 'signed retainers'], ['<1s', 'pickup time'], ['100%', 'calls logged'] ],
      horizon: 'MODELED OUTCOME — representative persona, not a client',
      scenario: 'A six-attorney injury firm. HazirMinds runs structured after-hours intake, screens for case fit, and books consults straight into the partners\' calendars with full transcripts.'
    }
  ]
};
