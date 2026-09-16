// HazirMinds industries — 8 trade pages
module.exports = [
  {
    key: 'hvac', name: 'HVAC', img: '/img/trade-hvac.webp',
    pain: 'Your best tech is answering the phone instead of fixing the furnace.',
    sub: 'Emergency calls don\'t wait for business hours. Neither does your HazirMinds AI team.',
    outcomes: [
      { icon: 'phone', t: 'Every emergency call answered', d: 'Heat out at 2 AM? Your AI dispatcher answers, triages and books the earliest slot — while your techs sleep.' },
      { icon: 'calendar', t: 'Maintenance plans on autopilot', d: 'Seasonal tune-up reminders go out automatically, filling slow weeks and multiplying contract value.' },
      { icon: 'zap', t: 'Techs stay on tools, not phones', d: 'Dispatch, status updates and customer texts run themselves between jobs.' }
    ],
    stat: '42%', statLabel: 'of after-hours HVAC calls go unanswered by a typical shop — HazirMinds answers all of them (illustrative)',
    integrations: 'ServiceTitan, Jobber, Housecall Pro, Google Calendar, Stripe',
    compliance: 'TCPA-compliant texting · Call recording disclosures built in'
  },
  {
    key: 'dental', name: 'Dental', img: '/img/trade-dental.webp',
    pain: 'A missed call is a missed patient — and they\'re already dialing the next practice.',
    sub: 'Your front desk can\'t answer while chairside. HazirMinds\'s can — every hour.',
    outcomes: [
      { icon: 'phone', t: 'Never lose a new patient to voicemail', d: 'New-patient calls answered instantly, insurance questions handled, appointments booked on the spot.' },
      { icon: 'calendar', t: 'No-shows cut in half', d: 'Smart confirmations and rescheduling keep chairs full without front-desk nagging.' },
      { icon: 'shield', t: 'PHI-conscious handling', d: 'Consent capture, encrypted transcripts, role-based access and an audit trail on every interaction.' }
    ],
    stat: 'from $' + require('./site.json').tiers['hazir-pro'].monthly + '/mo', statLabel: 'flat governed front desk — vs lifetime value lost per missed new-patient call (illustrative)',
    integrations: 'Dentrix, Open Dental, Google Calendar, Twilio, Zapier',
    compliance: 'Consent capture · encrypted transcripts · audit trail on every interaction'
  },
  {
    key: 'legal', name: 'Legal', img: '/img/trade-legal.webp',
    pain: 'Clients with emergencies call after hours. The firm that answers first usually wins the case.',
    sub: 'HazirMinds screens every call, captures the matter details, and books consults — 24/7, conflicts-aware.',
    outcomes: [
      { icon: 'phone', t: 'Intake that never sleeps', d: 'Every after-hours caller gets a full, structured intake instead of a beep.' },
      { icon: 'filter', t: 'Only qualified matters reach partners', d: 'Screening questions filter tyre-kickers before they cost billable time.' },
      { icon: 'shield', t: 'Confidentiality by default', d: 'Encrypted transcripts, access controls and audit trails for every interaction.' }
    ],
    stat: '35%', statLabel: 'of legal callers hang up before finishing a voicemail — each one a competitor\'s client (illustrative)',
    integrations: 'Clio, Filevine, Lawmatics, MyCase, Outlook',
    compliance: 'Confidential intake handling · role-based access · audit trail'
  },
  {
    key: 'restaurant', name: 'Restaurants', img: '/img/trade-restaurant.webp',
    pain: 'Friday at 7 PM, the phone rings off the hook. Your host is mid-seating and can\'t pick up.',
    sub: 'HazirMinds answers every call — reservations, hours, allergies, large parties — without touching your floor team.',
    outcomes: [
      { icon: 'phone', t: 'Reservations without the juggle', d: 'Bookings flow into OpenTable or SevenRooms while your host stays with guests.' },
      { icon: 'menu', t: 'Menu questions, answered instantly', d: 'Hours, allergens, parking, dress code — answered accurately, every time, in any language.' },
      { icon: 'star', t: 'Waitlist and large-party handling', d: 'Group inquiries captured, qualified and routed to a manager when it matters.' }
    ],
    stat: '3 in 4', statLabel: 'callers who reach voicemail at a restaurant simply call the next one (illustrative)',
    integrations: 'OpenTable, SevenRooms, Square, Shopify, Slack',
    compliance: 'Consent capture for reservations · recorded-line disclosures'
  },
  {
    key: 'realestate', name: 'Real Estate', img: '/img/trade-realestate.webp',
    pain: 'Listings generate calls at all hours. Every lead you answer late is a lead your rival signed.',
    sub: 'HazirMinds qualifies every inquiry in seconds, books viewings, and keeps your pipeline moving while you\'re showing homes.',
    outcomes: [
      { icon: 'zap', t: 'Speed-to-lead in under 60 seconds', d: 'Portal and sign calls get an instant response — the single biggest conversion lever in real estate.' },
      { icon: 'calendar', t: 'Viewings booked around your day', d: 'The agent checks your live calendar and proposes slots you\'d have proposed yourself.' },
      { icon: 'filter', t: 'Serious buyers, filtered and scored', d: 'Finance questions and timelines qualify buyers before they reach your calendar.' }
    ],
    stat: '78%', statLabel: 'of buyers work with the first agent who responds (illustrative)',
    integrations: 'Follow Up Boss, kvCORE, Pipedrive, Google Calendar, Twilio',
    compliance: 'Fair-housing-safe scripts · TCPA-compliant outreach'
  },
  {
    key: 'auto', name: 'Auto Services', img: '/img/trade-auto.webp',
    pain: 'Service advisors buried in calls while the bays are full and the queue is long.',
    sub: 'HazirMinds books appointments, answers status calls, and follows up on quotes — so advisors stay with customers at the counter.',
    outcomes: [
      { icon: 'calendar', t: 'Service bookings on autopilot', d: 'Oil changes to diagnostics, slotted by bay availability and tech skills.' },
      { icon: 'phone', t: 'Status calls handled instantly', d: '"Is my car ready?" answered from your shop system without pulling an advisor off the floor.' },
      { icon: 'star', t: 'Declined-services follow-up', d: 'Every declined line item gets a polite follow-up — recovering revenue you already earned.' }
    ],
    stat: '25%', statLabel: 'of service calls at a busy shop go unanswered during peak hours (illustrative)',
    integrations: 'Tekmetric, Shop-Ware, ServiceTitan, Google Calendar, Stripe',
    compliance: 'TCPA-compliant reminders · Recorded-line disclosures'
  },
  {
    key: 'ecommerce', name: 'E-commerce', img: '/img/trade-ecommerce.webp',
    pain: 'Where\'s my order? at 11 PM — and every hour of silence is a chargeback risk.',
    sub: 'HazirMinds\'s support agents resolve order status, returns and pre-sale questions instantly across chat, email and social.',
    outcomes: [
      { icon: 'package', t: 'WISMO tickets resolved instantly', d: 'Order status answered from your store data — no human needed, no ticket queue.' },
      { icon: 'cart', t: 'Carts saved in real time', d: 'Hesitant shoppers get answers before they leave; abandoned carts get a smart nudge.' },
      { icon: 'shield', t: 'Returns that keep customers', d: 'Policy-accurate return flows that resolve fast and protect margin.' }
    ],
    stat: '65%', statLabel: 'of e-commerce support tickets are "where is my order" — all automatable (illustrative)',
    integrations: 'Shopify, WooCommerce, Gorgias, Slack, Stripe',
    compliance: 'CCPA-aware data flows · PCI-aware payments handling'
  },
  {
    key: 'proservices', name: 'Professional Services', img: '/img/trade-proservices.webp',
    pain: 'Your expertise is billable. Chasing leads, bookings and invoices is not.',
    sub: 'HazirMinds runs the front office — intake, scheduling, follow-up, invoicing — for consultants, agencies and advisors.',
    outcomes: [
      { icon: 'phone', t: 'Every inquiry captured properly', d: 'Structured intake with qualification, so proposals go to real opportunities.' },
      { icon: 'calendar', t: 'Consults scheduled without email tennis', d: 'The AI proposes times, confirms, and sends prep questions automatically.' },
      { icon: 'zap', t: 'Invoices followed up politely', d: 'Payment reminders that protect relationships and your cash flow.' }
    ],
    stat: '27%', statLabel: 'of new inquiries at small firms never get a same-day response (illustrative)',
    integrations: 'HubSpot, Pipedrive, Zoho, Google Workspace, Stripe',
    compliance: 'Isolated per-client environments · audit trail on every interaction'
  }
];
