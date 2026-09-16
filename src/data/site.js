// HazirMinds site-wide data: nav, marquee, personas, transcripts
module.exports = {
  name: 'HazirMinds',
  domain: 'hazirminds.ai',
  url: 'https://hazirminds.ai',
  /* Where share-preview images and structured-data assets must be fetched from RIGHT NOW.
     site.url stays the canonical domain for SEO, but hazirminds.ai is not serving yet
     (verified: connection fails), so every og:image pointed at a dead host and every shared
     link resolved to a broken preview. The custom domain is now live, so ogBase === site.url. */
  ogBase: 'https://hazirminds.ai',
  leadEndpoint: '/api/lead.php',
  email: 'hello@hazirminds.ai',
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
          { name: 'AI Receptionist 24/7', href: '/services#ai-receptionist', desc: 'Every call answered, booked and logged' },
          { name: 'Missed-Call Text-Back', href: '/services#missed-call-text-back', desc: 'Rescue missed leads in seconds' },
          { name: 'Speed-to-Lead', href: '/services#speed-to-lead', desc: 'Reply to every lead in 60 seconds' }
        ]},
        { col: [
          { name: 'Workflow Automation', href: '/services#workflow-automation', desc: 'The busywork between yes and done' },
          { name: 'All services A–F', href: '/services', desc: 'The full contract-aligned catalog' }
        ]}
      ]
    },
    {
      label: 'Industries', href: '/industries/hvac', mega: [
        { col: [
          { name: 'HVAC', href: '/industries/hvac', desc: 'Emergency dispatch, 24/7' },
          { name: 'Dental', href: '/industries/dental', desc: 'Front desk that never sleeps' },
          { name: 'Legal', href: '/industries/legal', desc: 'After-hours intake & screening' },
          { name: 'Restaurants', href: '/industries/restaurant', desc: 'Reservations without the juggle' }
        ]},
        { col: [
          { name: 'Real Estate', href: '/industries/realestate', desc: 'Speed-to-lead for every inquiry' },
          { name: 'Auto Services', href: '/industries/auto', desc: 'Bookings & status calls on autopilot' },
          { name: 'E-commerce', href: '/industries/ecommerce', desc: 'WISMO & cart rescue, instantly' },
          { name: 'Professional Services', href: '/industries/proservices', desc: 'A front office that never sleeps' }
        ]}
      ]
    },
    {
      label: 'Compare', href: '/compare', mega: [
        { col: [
          { name: 'vs GoHighLevel', href: '/compare/go-high-level', desc: 'DIY platform vs done-for-you firm' },
          { name: 'vs Synthflow', href: '/compare/synthflow', desc: 'Metered minutes vs flat tiers' },
          { name: 'vs Smith.ai', href: '/compare/smith-ai', desc: 'Per-call buckets vs governed AI' }
        ]},
        { col: [
          { name: 'vs AI SDR agencies', href: '/compare/ai-sdr', desc: 'Artisan & 11x contracts vs ours' },
          { name: 'vs Human receptionist', href: '/compare/human-receptionist', desc: 'Payroll vs governed AI team' },
          { name: 'vs Masjid platforms', href: '/compare/masjid-platforms', desc: 'ConnectMazjid, MOHID, Masjidal vs Masjid AI OS' },
          { name: 'Compare hub', href: '/compare', desc: 'All comparisons, verified 2026 data' }
        ]}
      ]
    },
    { label: 'Enterprise', href: '/enterprise' },
    { label: 'Pricing', href: '/pricing' }
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
      img: '/img/client-1.webp',
      quote: 'We were missing 60-plus calls a week in peak season. Now every one is answered, priced and booked before I even see my phone.',
      metrics: [ ['+38%', 'booked jobs'], ['0', 'missed calls'], ['11 hrs', 'phone time saved weekly'] ],
      horizon: 'MODELED OUTCOME — representative persona, not a client',
      scenario: 'A growing HVAC shop drowning in peak-season calls. HazirMinds answers every line, books straight into ServiceTitan-style scheduling, and texts status updates between jobs.'
    },
    {
      name: 'The Full-Clinic Partner', trade: 'Dental · 3-chair practice',
      img: '/img/client-2.webp',
      quote: 'Our front desk finally breathes. New patients get booked at 9 PM on a Sunday, and no-shows dropped by half in the first month.',
      metrics: [ ['+27%', 'new patients'], ['−52%', 'no-shows'], ['24/7', 'coverage'] ],
      horizon: 'MODELED OUTCOME — representative persona, not a client',
      scenario: 'A three-chair dental practice with a two-person front desk. HazirMinds handles new-patient calls with consent capture and encrypted transcripts, sends smart confirmations, and refills cancellations automatically.'
    },
    {
      name: 'The Always-in-Court Attorney', trade: 'Legal · 6-attorney firm',
      img: '/img/client-3.webp',
      quote: 'Intake used to die at 6 PM. Now signed retainers arrive Monday morning from calls that came in over the weekend.',
      metrics: [ ['+31%', 'signed retainers'], ['<1s', 'pickup time'], ['100%', 'calls logged'] ],
      horizon: 'MODELED OUTCOME — representative persona, not a client',
      scenario: 'A six-attorney injury firm. HazirMinds runs structured after-hours intake, screens for case fit, and books consults straight into the partners\' calendars with full transcripts.'
    }
  ]
};
