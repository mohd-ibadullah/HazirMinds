// HazirMinds — industry taxonomy, group 3 of 3 (umbrellas 9–11)
module.exports = [
  {
    key: 'business-services-agencies',
    name: 'Business Services, Agencies & Technology',
    short: 'Business services & agencies',
    serves: 'Agencies, IT providers and B2B service firms where the intake quality decides whether an enquiry becomes revenue or noise.',
    failure: 'Inbound leads arrive from forms, ads and referrals all day, and nobody is free to qualify them. The good ones wait, the poor ones take the same time, and the first reply is often hours late.',
    stat: 'response',
    subsectors: [
      ['Marketing & Creative Agencies', 'Enquiry-driven; the agency that replies first usually wins the pitch'],
      ['IT & Managed Service Providers', 'Urgent support calls at all hours plus new-client intake'],
      ['Staffing & Recruiting', 'Two audiences with different scripts — candidates and clients'],
      ['Software & SaaS', 'Demo requests and support queues competing for the same team'],
      ['Franchises & Multi-location', 'One brand, many sites, inconsistent front-desk experience'],
      ['Coworking & Workspace', 'Tour requests and member questions outside office hours']
    ],
    services: [
      ['Lead Qualification & Scoring', 'Runs your qualifying questions before the lead reaches a human', 'Hazir Pro'],
      ['AI Receptionist 24/7', 'Answers intake calls and support lines day or night', 'Chronos'],
      ['Website Chat Agent', 'Takes enquiries on the site when nobody is watching it', 'Hazir Pro'],
      ['CRM Setup & Pipeline Automation', 'Writes every enquiry into your CRM and keeps it moving', 'Aeon'],
      ['Database Reactivation', 'Reopens conversations with leads already in your system', 'Growth add-on']
    ],
    workflows: [
      { t: 'An inbound lead arriving between meetings', steps: [
        ['1', 'Answer', 'Takes the call, or the form reply, within the response window'],
        ['2', 'Qualify', 'Asks your qualifying questions and scores the result'],
        ['3', 'Route', 'Books a call with the right person, or disqualifies honestly'],
        ['4', 'Record', 'The qualification and the routing are logged as a receipt']
      ] }
    ],
    integrations: 'HubSpot, Pipedrive, Zoho, Google Workspace, Slack, Google Calendar',
    governance: [
      'Consent capture and opt-out-aware messaging on outbound campaigns',
      'Permission scopes per role, so an agent touches only the systems its role allows',
      'Cost governance with per-agent budgets where outbound volume is metered',
      'Full audit trail on every qualification, routing decision and handoff'
    ],
    faqs: [
      { q: 'Can it use our qualifying questions?', a: 'Yes — the script is built from your process and approved by you before go-live. It asks what you tell it to ask, nothing more.' },
      { q: 'Does it replace our SDR team?', a: 'No. It handles the first response and the qualification, then routes. What happens after that is your process, not an autonomous one.' },
      { q: 'Will it work across several brands?', a: 'Yes — multi-location and franchise deployments route by brand or site with separate rules, under one governed setup.' }
    ]
  },
  {
    key: 'retail-ecommerce-order-taking',
    name: 'Retail, E-commerce & Order-Taking',
    short: 'Retail & e-commerce',
    serves: 'Retailers, online stores and distributors whose customers call to ask where an order is, change it, or place it in the first place.',
    failure: 'The same three questions arrive all day — where is my order, can I change it, is this in stock — and every one of them either costs a staff hour or leaves a customer waiting until they complain publicly.',
    stat: 'unanswered',
    subsectors: [
      ['E-commerce', 'Order-status and returns questions at volume, peaking whenever a campaign runs'],
      ['Specialty Retail', 'Store-hours and stock enquiries plus phone orders'],
      ['Home Improvement', 'Quote and availability calls from trade and consumer customers'],
      ['Pharmacy', 'Prescription and stock questions that must be handled carefully'],
      ['Print & Sign Shops', 'Order intake and artwork questions, often time-critical'],
      ['Wholesale, Distribution & Manufacturing order lines', 'Rep order-taking and after-hours dispatch lines where a missed call is a missed order']
    ],
    services: [
      ['AI Support Agent', 'Answers order-status, returns and stock questions from your system', 'Hazir Pro'],
      ['AI Receptionist 24/7', 'Takes calls and phone orders at any hour', 'Chronos'],
      ['Missed-Call Text-Back', 'Any call the team cannot take becomes a text conversation', 'Chronos'],
      ['Website Chat Agent', 'Handles the same questions on the storefront', 'Hazir Pro'],
      ['Order intake via SMS / Text Agent', 'Takes straightforward orders and changes by text', 'Aeon']
    ],
    workflows: [
      { t: 'A where-is-my-order call at volume', steps: [
        ['1', 'Answer', 'Picks up immediately and identifies the customer'],
        ['2', 'Look up', 'Reads the order status from your system, where an integration exists'],
        ['3', 'Resolve', 'Answers, changes the order, or escalates a genuine problem'],
        ['4', 'Record', 'Every interaction is logged, so patterns become visible']
      ] }
    ],
    integrations: 'Shopify, WooCommerce, Gorgias, Slack, Twilio, Stripe',
    governance: [
      'Order and customer data stay in your workspace, access scoped by role',
      'Consent capture and opt-out-aware messaging on outbound threads',
      'Recording disclosure built into the greeting where it applies',
      'Full audit trail on every order question, change and escalation'
    ],
    faqs: [
      { q: 'Can it look up a real order?', a: 'Where an integration exists, yes — it reads the status from your system rather than guessing. Without one, it takes the details and routes to a person.' },
      { q: 'Will it give wrong stock information?', a: 'It only answers from the systems you connect. Where it cannot verify something, it says so and escalates rather than improvising.' },
      { q: 'Does it handle returns?', a: 'It can run the process you have approved — checking eligibility, issuing the instruction, or escalating exceptions.' }
    ]
  },
  {
    key: 'education-nonprofits-community',
    name: 'Education, Nonprofits & Community',
    short: 'Education & nonprofits',
    serves: 'Schools, training providers and community organisations where enquiries come from families, students and donors who expect a considered answer, not a queue.',
    failure: 'Enquiries arrive from parents, students and donors at all hours, and a small team cannot answer them consistently. The calls that do not get answered are often the ones that mattered most.',
    stat: 'unanswered',
    subsectors: [
      ['Private Schools & Academies', 'Admissions enquiries from families who compare several schools at once'],
      ['Tutoring & Test Prep', 'Enrolment-driven; each enquiry has a short decision window'],
      ['Childcare & Daycare', 'Waitlist and availability questions, often from anxious parents'],
      ['Trade & Vocational Schools', 'Programme enquiries and application questions at volume'],
      ['Churches & Faith Organizations', 'Events, facilities, volunteers and donation questions'],
      ['Nonprofits & Associations', 'Member and donor enquiries plus event registration']
    ],
    services: [
      ['AI Receptionist 24/7', 'Answers admissions, member and general enquiries at any hour', 'Chronos'],
      ['AI Appointment Setter', 'Books campus tours, enrolment calls and volunteer slots', 'Hazir Pro'],
      ['Website Chat Agent', 'Handles the same questions on the site after hours', 'Hazir Pro'],
      ['Workflow Automation', 'Registration, reminders and follow-up without manual chasing', 'Hazir Pro'],
      ['Masjid AI OS', 'The full operating layer for masjids and Islamic centres — see the dedicated page', 'Scoped per engagement']
    ],
    workflows: [
      { t: 'An admissions enquiry outside office hours', steps: [
        ['1', 'Answer', 'Picks up and identifies the institution'],
        ['2', 'Capture', 'Takes the family\u2019s details, year group and questions'],
        ['3', 'Book', 'Offers a tour or a call with admissions'],
        ['4', 'Record', 'The enquiry and the booking are logged for the team in the morning']
      ] }
    ],
    integrations: 'Calendar and CRM tools where an integration exists, Google Calendar, Outlook, Twilio',
    governance: [
      'Consent capture on every interaction, with particular care where a minor\u2019s details are involved',
      'Recording disclosure built into the greeting',
      'Role-based access so staff see only what their role requires',
      'Full audit trail on every enquiry, booking and handoff'
    ],
    faqs: [
      { q: 'Is this suitable for a school?', a: 'For admissions, general enquiries and scheduling, yes. Where a deployment would touch pupil records or safeguarding information, that is scoped separately and discussed before anything is built.' },
      { q: 'What about masjids and Islamic centres?', a: 'That is a dedicated deployment — the Masjid AI OS, with its own page, lifecycle and governance model. This section covers the wider education and nonprofit lane.' },
      { q: 'Can it take donations?', a: 'It can answer donation questions and route to your giving process. Taking payment itself is scoped per engagement.' }
    ]
  }
];
