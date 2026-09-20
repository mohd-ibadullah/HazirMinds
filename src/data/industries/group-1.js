// HazirMinds — industry taxonomy, group 1 of 3 (umbrellas 1–4)
/* Pages reference a verified figure by KEY ('unanswered' | 'perCall' | 'leak' | 'response'); the
   index resolves it from site.json so the same number always comes from the same place and no page
   ever carries a per-industry number invented for it. */
module.exports = [
  {
    key: 'home-field-services',
    name: 'Home & Field Services',
    short: 'Home & field services',
    serves: 'Trades and field-service businesses where the work is booking-driven, often urgent, and almost always won by whoever answers first.',
    failure: 'The person who should be answering the phone is on a roof, under a sink or driving. Calls land in voicemail, and urgent callers rarely leave a message — they dial the next company on the list.',
    stat: 'unanswered',
    subsectors: [
      ['HVAC', 'Emergency-driven; after-hours demand is the highest-value work in the trade'],
      ['Plumbing', 'Same emergency shape; burst pipes and no-heat calls cannot wait'],
      ['Electrical', 'Urgent fault calls plus scheduled panel and inspection work'],
      ['Roofing', 'Storm-driven spikes; every estimate request is a high-value lead'],
      ['Landscaping & Lawn', 'Recurring-service contracts won on first-response speed'],
      ['Pest Control', 'Time-sensitive treatments; scheduling is the whole business'],
      ['Cleaning & Janitorial', 'Quote-heavy inbound; recurring contracts start with one call'],
      ['Appliance Repair', 'High call volume, short windows, customers ringing several firms'],
      ['Garage Door & Locksmith', 'Genuine emergencies at all hours; near-zero tolerance for voicemail'],
      ['Restoration & Water Damage', 'Insurance-driven urgency; the first responder usually wins the job'],
      ['Moving & Storage', 'Multi-quote shopping; speed-to-quote decides who gets the booking'],
      ['Solar', 'Long qualification calls that need structured intake, not a message']
    ],
    services: [
      ['AI Receptionist 24/7', 'Answers every call day or night, triages urgency, books the slot', 'Chronos'],
      ['Missed-Call Text-Back', 'The moment a call is missed, the caller gets a text and a booking link', 'Chronos'],
      ['AI Appointment Setter', 'Books into your calendar and writes the job to your field software', 'Hazir Pro'],
      ['No-Show Reduction', 'Confirmations and rescheduling that keep the board full', 'Hazir Pro'],
      ['Review & Reputation Engine', 'Requests a review after the job closes', 'Growth add-on']
    ],
    workflows: [
      { t: 'An after-hours emergency call', steps: [
        ['1', 'Answer', 'Picks up on the first ring and asks what has failed'],
        ['2', 'Triage', 'Separates emergency from routine against the rules you set'],
        ['3', 'Book', 'Offers the earliest slot and writes the job to your calendar'],
        ['4', 'Receipt', 'Logs the call, the decision and the booking as a record you can read']
      ] },
      { t: 'A missed call at peak', steps: [
        ['1', 'Detect', 'The call goes unanswered while your team is on site'],
        ['2', 'Text back', 'The caller receives a message within seconds, with a booking link'],
        ['3', 'Qualify', 'The reply captures the address, the problem and the urgency'],
        ['4', 'Hand off', 'Booked into the schedule, or escalated to a person with the context attached']
      ] }
    ],
    integrations: 'Field-service software (ServiceTitan, Jobber, Housecall Pro), Google Calendar, Outlook, Twilio, Stripe',
    governance: [
      'Text-back runs on opt-out-aware messaging with consent capture on every outbound thread',
      'Call-recording disclosure is part of the greeting, configured per state where you operate',
      'Every action the agent takes is logged and exportable as a receipt'
    ],
    faqs: [
      { q: 'Do we have to change our phone number?', a: 'No. Your number stays yours and your existing system keeps working. Calls route to the AI and hand back to your team whenever the scope you approved says a human should take it.' },
      { q: 'Does it book into the software we already use?', a: 'Yes, where an integration exists — the tools listed above are the ones we deploy most. Anything outside that list is scoped as a client-requirement build.' },
      { q: 'What happens when the AI cannot answer something?', a: 'It escalates. Every agent carries a written escalation path, and a request outside the scope you approved is handed to a person with the context attached and logged as a receipt.' }
    ]
  },
  {
    key: 'healthcare-dental',
    name: 'Healthcare & Dental',
    short: 'Healthcare & dental',
    serves: 'Clinics, practices and care providers whose front desk is the bottleneck between a patient calling and a patient being booked.',
    failure: 'Front-desk staff are already with patients. New-patient calls — the ones worth the most over a patient lifetime — go to voicemail, and the caller simply tries the next practice.',
    stat: 'response',
    subsectors: [
      ['Dental', 'New-patient calls are the growth engine; front desk cannot answer chairside'],
      ['Medical Clinics', 'Appointment-heavy, high call volume, tight rescheduling load'],
      ['Behavioral & Mental Health', 'Sensitive first contact; intake needs structure and discretion'],
      ['Optometry', 'Recall-driven; reminders and rebooking carry the schedule'],
      ['Chiropractic', 'Recurring visit plans won on how fast the first appointment is offered'],
      ['Physical Therapy', 'Referral-driven intake plus insurance questions at first contact'],
      ['Dermatology & Aesthetics', 'Consult-heavy; each enquiry is a high-value booking'],
      ['Veterinary', 'Urgent-care spikes plus routine scheduling in the same queue'],
      ['Home Health & Hospice', 'Family-first calls that need careful, immediate human routing']
    ],
    services: [
      ['AI Receptionist 24/7', 'Answers every call, handles the routine questions, books the appointment', 'Chronos'],
      ['Missed-Call Text-Back', 'Rescues any call the front desk cannot reach in time', 'Chronos'],
      ['No-Show Reduction', 'Confirmations and easy rescheduling that keep the schedule full', 'Hazir Pro'],
      ['Website Chat Agent', 'Takes new-patient enquiries after hours without exposing clinical detail', 'Hazir Pro'],
      ['Smart Routing / IVR Replacement', 'Routes to the right desk, or to a person, without a phone tree', 'Configured at onboarding']
    ],
    workflows: [
      { t: 'A new-patient call the desk cannot take', steps: [
        ['1', 'Answer', 'Picks up before the caller reaches voicemail'],
        ['2', 'Intake', 'Captures name, reason for visit and insurance at the level you allow'],
        ['3', 'Book', 'Offers the next suitable slot and confirms it by text'],
        ['4', 'Record', 'The practice gets the intake and an audit entry, not a message slip']
      ] }
    ],
    integrations: 'Practice-management software (Dentrix, Open Dental), Google Calendar, Outlook, Twilio',
    governance: [
      'Consent capture on every interaction, and recording disclosure built into the greeting',
      'Encrypted transcripts with role-based access — staff see what their role needs, nothing more',
      'An audit trail on every interaction, exportable on request',
      'PHI-conscious handling by design. We do not claim HIPAA compliance, and we do not sign business associate agreements — where that is a requirement for you, it is a conversation before deployment, not a feature on a page.'
    ],
    faqs: [
      { q: 'Is this HIPAA compliant?', a: 'We do not make that claim and we do not offer a BAA. What we do provide is PHI-conscious handling: consent capture, encrypted transcripts, role-based access and an audit trail. If a BAA is a requirement for your practice, raise it before deployment and we will tell you plainly whether we can meet it.' },
      { q: 'Will it give clinical advice?', a: 'No. It handles scheduling, routing and administrative questions. Anything clinical — and anything outside the scope you approved — goes to a person.' },
      { q: 'Can it read from our practice software?', a: 'Where an integration exists, yes. The tools listed above are the ones we deploy most; anything else is scoped as a client-requirement build.' }
    ]
  },
  {
    key: 'legal',
    name: 'Legal',
    short: 'Legal',
    serves: 'Law firms and legal organisations where an urgent caller after hours is usually a client you never hear from again.',
    failure: 'Someone with an emergency calls at 8pm. They get voicemail, do not leave a message, and call the next firm on the search results page. The intake never existed.',
    stat: 'response',
    subsectors: [
      ['Personal Injury', 'Immediate-contact matters; the first firm that answers usually signs the case'],
      ['Family Law', 'Emotionally urgent first contact that needs a careful, structured intake'],
      ['Criminal Defense', 'Arrest and bail calls arrive at any hour and cannot wait for the morning'],
      ['Immigration', 'High enquiry volume, language-sensitive, screening-heavy'],
      ['Estate & Probate', 'Scheduled intake plus compassionate routing of sensitive calls'],
      ['Business & Contract Law', 'Enquiry qualification that keeps unqualified matters off billable time'],
      ['Legal Aid & Nonprofit', 'Eligibility screening before a case reaches a caseworker']
    ],
    services: [
      ['AI Receptionist 24/7', 'Answers, screens and books a consult without a beep', 'Chronos'],
      ['Lead Qualification & Scoring', 'Asks your screening questions before the matter reaches a partner', 'Hazir Pro'],
      ['AI Appointment Setter', 'Books consultations and sends confirmation', 'Hazir Pro'],
      ['Smart Routing / IVR Replacement', 'Routes urgent matters to the right person, at any hour', 'Configured at onboarding'],
      ['Call Analytics', 'Shows where enquiries come from and which ones convert', 'Aeon']
    ],
    workflows: [
      { t: 'An after-hours intake', steps: [
        ['1', 'Answer', 'Picks up immediately and identifies the firm'],
        ['2', 'Screen', 'Runs your intake questions — matter type, timeline, jurisdiction'],
        ['3', 'Route', 'Books a consult, or escalates urgent matters to a named person'],
        ['4', 'Record', 'The firm receives a structured intake and an audit entry']
      ] }
    ],
    integrations: 'Clio, Filevine, Lawmatics, MyCase, Outlook, Google Calendar, Twilio',
    governance: [
      'Confidentiality by default: encrypted transcripts, access controls and an audit trail on every interaction',
      'Screening runs only on the questions you supply — the agent does not give legal advice or assess merits',
      'Recording disclosure built into the greeting for the states you operate in'
    ],
    faqs: [
      { q: 'Can it screen for conflicts?', a: 'It can run the intake questions you supply, including party names, and flag anything you have told it to flag. It does not run a conflict check against your matter system.' },
      { q: 'Does it give legal advice?', a: 'No. It collects information, answers administrative questions you have approved, and routes anything substantive to a person.' },
      { q: 'Is the intake confidential?', a: 'Transcripts are encrypted and access is scoped by role, with an audit trail on every interaction. Full detail is in our Privacy Policy.' }
    ]
  },
  {
    key: 'financial-professional-services',
    name: 'Financial & Professional Advisory',
    short: 'Financial & professional',
    serves: 'Advisory and licensed-service firms where an enquiry is high-value, time-sensitive and often regulated at first contact.',
    failure: 'Enquiries arrive during client work or outside business hours, and a first call that goes unanswered is rarely repeated — the prospect simply engages someone else.',
    stat: 'response',
    subsectors: [
      ['Accounting & CPA', 'Seasonal spikes where every missed call is a client you could have kept'],
      ['Bookkeeping & Tax', 'Volume-driven enquiry handling across a compressed season'],
      ['Insurance Agencies', 'Quote-heavy inbound; speed of first response decides the quote'],
      ['Mortgage & Lending', 'Rate-sensitive shoppers who call several lenders in one sitting'],
      ['Financial Advisory & Wealth', 'Referral and enquiry intake that needs a careful first impression'],
      ['Business Consulting', 'Qualification matters more than volume; unqualified calls cost real time'],
      ['Staffing & Recruiting', 'Both sides call — candidates and clients — with different scripts']
    ],
    services: [
      ['AI Receptionist 24/7', 'Answers every enquiry, day or night, with your approved script', 'Chronos'],
      ['Lead Qualification & Scoring', 'Runs your qualifying questions before the enquiry reaches an advisor', 'Hazir Pro'],
      ['Speed-to-Lead', 'First response within the window that decides the sale', 'Hazir Pro'],
      ['AI Appointment Setter', 'Books the consultation and confirms it', 'Hazir Pro'],
      ['Pipeline & Deal Automation', 'Keeps the enquiry moving through your CRM without manual chasing', 'Aeon']
    ],
    workflows: [
      { t: 'A quote enquiry that arrives mid-meeting', steps: [
        ['1', 'Answer', 'Picks up while your team is in front of another client'],
        ['2', 'Qualify', 'Captures the details your process needs at first contact'],
        ['3', 'Book', 'Offers a slot, or hands to an advisor when the rules say so'],
        ['4', 'Record', 'Written to your CRM with an audit entry attached']
      ] }
    ],
    integrations: 'CRM and practice software, Google Calendar, Outlook, Twilio, Stripe',
    governance: [
      'Consent capture and opt-out-aware messaging on every outbound thread',
      'Recording disclosure built into the greeting where it applies',
      'The agent answers administrative questions only — no advice, no suitability assessment, no recommendation',
      'Full audit trail, exportable, on every interaction'
    ],
    faqs: [
      { q: 'Will it give financial advice?', a: 'No. It handles scheduling, routing and the administrative questions you approve. Anything requiring advice or a recommendation goes to a licensed person.' },
      { q: 'Can it work during tax season volume?', a: 'Yes — the same configuration that handles a normal day handles a spike, because every call is answered rather than queued.' },
      { q: 'Does it write to our CRM?', a: 'Where an integration exists, yes; otherwise it is scoped as a client-requirement build.' }
    ]
  }
];
