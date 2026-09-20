// HazirMinds — industry taxonomy, group 2 of 3 (umbrellas 5–8)
module.exports = [
  {
    key: 'real-estate-property',
    name: 'Real Estate & Property',
    short: 'Real estate & property',
    serves: 'Agents, brokers and property managers whose business depends on catching an enquiry while the prospect is still looking.',
    failure: 'Property enquiries arrive in bursts — evenings, weekends, the moment a listing goes live. Anyone who calls a second agent has already moved on, and showing requests go unanswered while you are with another client.',
    stat: 'response',
    subsectors: [
      ['Residential Brokerage', 'Enquiry-driven; every unanswered call is another agent\u2019s showing'],
      ['Commercial Brokerage', 'Fewer but far larger deals; qualification matters more than volume'],
      ['Property Management', 'Maintenance and tenant calls at all hours, plus owner enquiries'],
      ['Self-Storage', 'High call volume, short decisions, peak-hour queues'],
      ['Short-Term Rentals', 'Guest questions and booking changes across time zones'],
      ['Home Inspection', 'Scheduling-heavy; the first available slot usually wins the booking'],
      ['Title & Escrow', 'Status calls and document questions that consume staff time']
    ],
    services: [
      ['Speed-to-Lead', 'First response inside the window that decides the deal', 'Hazir Pro'],
      ['AI Receptionist 24/7', 'Answers every enquiry, qualifies it and books the showing', 'Chronos'],
      ['Missed-Call Text-Back', 'Turns a missed call into a text conversation within seconds', 'Chronos'],
      ['AI Appointment Setter', 'Books viewings and inspections straight into the calendar', 'Hazir Pro'],
      ['Pipeline & Deal Automation', 'Keeps every enquiry moving through your CRM', 'Aeon']
    ],
    workflows: [
      { t: 'A listing enquiry at 9pm', steps: [
        ['1', 'Answer', 'Picks up before the prospect reaches the next agent'],
        ['2', 'Qualify', 'Captures budget, timeline and what they want to see'],
        ['3', 'Book', 'Offers a viewing slot and confirms by text'],
        ['4', 'Record', 'Written to your CRM with the call logged as a receipt']
      ] }
    ],
    integrations: 'Follow Up Boss, kvCORE, Pipedrive, Google Calendar, Outlook, Twilio',
    governance: [
      'Consent capture and opt-out-aware messaging on every outbound thread',
      'Recording disclosure built into the greeting where it applies',
      'Every enquiry, decision and booking logged and exportable'
    ],
    faqs: [
      { q: 'Can it handle both buyers and tenants?', a: 'Yes — the script and the routing rules differ by enquiry type, and both are configured at onboarding from your own process.' },
      { q: 'Does it book into our calendar?', a: 'Yes, where an integration exists; anything outside that list is scoped as a client-requirement build.' },
      { q: 'What about maintenance calls?', a: 'Property-management deployments route maintenance in the same way — urgency triage first, then a booking or an escalation with the context attached.' }
    ]
  },
  {
    key: 'food-hospitality-events',
    name: 'Food, Hospitality & Events',
    short: 'Food, hospitality & events',
    serves: 'Venues and hospitality businesses where the phone rings during the busiest hour of the day, and nobody can leave the floor to answer it.',
    failure: 'Reservations, large-party enquiries and delivery questions all arrive during service. Staff cannot step away, so the call rings out — and a booking enquiry that fails once usually does not come back.',
    stat: 'unanswered',
    subsectors: [
      ['Restaurants', 'Reservation and large-party calls peak exactly when nobody can answer'],
      ['Catering', 'Quote-driven; each enquiry is a substantial booking that needs a fast reply'],
      ['Bars & Breweries', 'Event and group enquiries outside opening hours'],
      ['Hotels & Boutiques', 'Guest questions, booking changes and late arrivals across the clock'],
      ['Event Venues', 'Availability and tour requests that have to be answered to be won'],
      ['Wedding & Event Planning', 'Long, emotional enquiry calls that benefit from structure, not voicemail'],
      ['Travel Agencies', 'Itinerary questions and bookings across time zones']
    ],
    services: [
      ['AI Receptionist 24/7', 'Answers reservations and enquiries during service and after close', 'Chronos'],
      ['Missed-Call Text-Back', 'Any call the floor cannot take becomes a text conversation', 'Chronos'],
      ['AI Appointment Setter', 'Books tables, tours and tastings into your calendar', 'Hazir Pro'],
      ['Website Chat Agent', 'Handles the same questions on the site, after hours', 'Hazir Pro'],
      ['Review & Reputation Engine', 'Requests a review after the visit', 'Growth add-on']
    ],
    workflows: [
      { t: 'A large-party enquiry during dinner service', steps: [
        ['1', 'Answer', 'Picks up while the floor is full'],
        ['2', 'Capture', 'Takes party size, date, time and any deposit questions'],
        ['3', 'Book', 'Holds the booking or routes it to the manager with the details'],
        ['4', 'Record', 'The booking and the call are logged as a receipt']
      ] }
    ],
    integrations: 'OpenTable, SevenRooms, Square, Shopify, Slack, Google Calendar, Twilio',
    governance: [
      'Recording disclosure built into the greeting',
      'Consent capture and opt-out-aware messaging on outbound review requests and texts',
      'Reservation and guest details stay in your workspace, scoped by role'
    ],
    faqs: [
      { q: 'Will it work with our reservation system?', a: 'Where an integration exists, yes. The reservation platforms above are the ones we deploy most; anything else is scoped as a client-requirement build.' },
      { q: 'Can it take deposits?', a: 'It can follow your deposit policy in the conversation. Taking payment itself is scoped per engagement.' },
      { q: 'Does it sound like our venue?', a: 'The greeting, tone and answers are built from your own details and approved by you before go-live.' }
    ]
  },
  {
    key: 'automotive-fleet',
    name: 'Automotive & Fleet',
    short: 'Automotive & fleet',
    serves: 'Dealerships, repair shops and fleet operators where every call is either a booking or a lead, and both are lost to voicemail.',
    failure: 'Service departments queue calls while advisers are at the counter. Sales enquiries arrive after hours. Tow and roadside calls are pure emergencies — and a caller who is stranded does not leave a message.',
    stat: 'response',
    subsectors: [
      ['Dealerships', 'Sales and service enquiries arriving outside showroom hours'],
      ['Auto Repair & Quick Lube', 'High call volume; booking speed decides who gets the bay'],
      ['Auto Detailing & Body Shops', 'Quote-heavy; each enquiry needs a fast, structured reply'],
      ['Tire Shops', 'Seasonal spikes with short decision windows'],
      ['Car Rental', 'Availability questions and booking changes on the clock'],
      ['Towing', 'Genuine emergencies; the first company to answer gets the job'],
      ['Trucking & Freight Brokerage', 'Load enquiries, driver questions and dispatch calls at all hours']
    ],
    services: [
      ['AI Receptionist 24/7', 'Answers sales, service and roadside calls at any hour', 'Chronos'],
      ['AI Appointment Setter', 'Books service slots into your shop calendar', 'Hazir Pro'],
      ['Missed-Call Text-Back', 'Recovers the calls the department cannot reach', 'Chronos'],
      ['Lead Qualification & Scoring', 'Separates a serious buyer from a browser before it costs an hour', 'Hazir Pro'],
      ['Smart Routing / IVR Replacement', 'Gets a stranded driver to dispatch without a phone tree', 'Configured at onboarding']
    ],
    workflows: [
      { t: 'A roadside call at midnight', steps: [
        ['1', 'Answer', 'Picks up immediately, day or night'],
        ['2', 'Locate', 'Captures the location, the vehicle and what has happened'],
        ['3', 'Dispatch', 'Routes to the on-call driver, or books the tow'],
        ['4', 'Record', 'The call and the dispatch are logged for the morning']
      ] }
    ],
    integrations: 'Tekmetric, Shop-Ware, ServiceTitan, Google Calendar, Twilio, Stripe',
    governance: [
      'Recording disclosure built into the greeting where it applies',
      'Consent capture and opt-out-aware messaging on outbound threads',
      'Full audit trail on every call, decision and handoff'
    ],
    faqs: [
      { q: 'Can it tell sales and service apart?', a: 'Yes — the routing rules differ by department and are configured at onboarding from your own process.' },
      { q: 'Does it handle after-hours roadside calls?', a: 'That is the highest-value part of the deployment. It answers, captures the location, and either dispatches or books, according to rules you set.' },
      { q: 'Will it book into our shop software?', a: 'Where an integration exists, yes; otherwise it is scoped as a client-requirement build.' }
    ]
  },
  {
    key: 'beauty-wellness-personal-care',
    name: 'Beauty, Wellness & Personal Care',
    short: 'Beauty & wellness',
    serves: 'Appointment-led personal-care businesses where the diary is the business and the phone rings while your hands are busy.',
    failure: 'You cannot answer mid-appointment. Booking calls go to voicemail, and clients who cannot get through simply book in the chair next door — then no-shows and last-minute cancellations leave gaps nobody had time to refill.',
    stat: 'unanswered',
    subsectors: [
      ['Salons & Barbershops', 'Booking-led; the phone rings precisely when nobody is free'],
      ['Spas & Massage', 'Treatment bookings plus enquiry calls needing a calm, consistent answer'],
      ['Med Spas & Aesthetics', 'Consult-driven, high-value bookings with qualification at first contact'],
      ['Nail Studios', 'High booking volume with rapid rescheduling'],
      ['Tattoo Studios', 'Enquiry-heavy; artists cannot stop mid-piece to answer'],
      ['Personal Training & Gyms', 'Trial and membership enquiries that need a fast follow-up'],
      ['Martial Arts', 'Class and trial enquiries, often from parents, often evenings'],
      ['Pet Grooming & Boarding', 'Availability-driven bookings with seasonal peaks']
    ],
    services: [
      ['AI Receptionist 24/7', 'Answers and books while your hands are occupied', 'Chronos'],
      ['AI Appointment Setter', 'Books into your diary software and confirms', 'Hazir Pro'],
      ['No-Show Reduction', 'Confirmations and easy rescheduling that refill gaps', 'Hazir Pro'],
      ['Review & Reputation Engine', 'Requests a review after the appointment', 'Growth add-on'],
      ['Website Chat Agent', 'Takes bookings on your site when the desk is closed', 'Hazir Pro']
    ],
    workflows: [
      { t: 'A booking call mid-appointment', steps: [
        ['1', 'Answer', 'Picks up while you are with a client'],
        ['2', 'Offer', 'Reads real availability and offers the slots you allow'],
        ['3', 'Book', 'Confirms the appointment by text'],
        ['4', 'Record', 'The booking lands in your diary with a logged receipt']
      ] }
    ],
    integrations: 'Booking and diary software where an integration exists, Google Calendar, Twilio, Stripe',
    governance: [
      'Consent capture and opt-out-aware messaging on every outbound text',
      'Recording disclosure built into the greeting where it applies',
      'Client details stay in your workspace, access scoped by role'
    ],
    faqs: [
      { q: 'Can it see our real availability?', a: 'Where an integration exists, yes — it offers only what your diary shows. Otherwise it takes the request and confirms once you accept it.' },
      { q: 'Will it chase no-shows?', a: 'It sends the confirmations and reminders you configure, and makes rescheduling easy. What it will not do is invent a policy you have not set.' },
      { q: 'Is it worth it for a small studio?', a: 'The honest answer depends on how many calls you currently miss. If your phone rings through to voicemail during appointments, that is the number worth counting first.' }
    ]
  }
];
