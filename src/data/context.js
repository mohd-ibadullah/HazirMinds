// HazirMinds — per-page demo context.
//
// Every CTA carries WHAT the visitor was reading when they clicked: the wording on the button (the
// short form for the sticky bar), the subject the demo page echoes back, and the industry the form
// preselects. One table, so the button, the demo page and the form cannot drift apart.
//
// `label` is the CTA text for that page — specific beats generic ("Discuss Your Practice Needs" not
// "Book a Demo"); `short` is the compact form the sticky bar uses. `about` reads inside a sentence
// ("we'll start with X"). `industry` must match an option the demo form offers; '' means none.
//
// No page here promises a price, a discount or an outcome the site cannot support.
module.exports = {
  home:                 { label: 'See it on your own line',        short: 'See it on your line',        about: 'what a deployment looks like for your business', industry: '' },
  services:             { label: 'Find the right services',        short: 'Find your services',         about: 'the service catalogue',                          industry: '' },
  'chief-of-staff':     { label: 'Design Your AI Chief-of-Staff',  short: 'Design your Chief-of-Staff', about: 'the Chief-of-Staff Platform',                    industry: 'Business services, agencies & technology' },
  compare:              { label: 'Talk through the alternatives',  short: 'Talk it through',            about: 'the comparison',                                 industry: '' },
  masjids:              { label: 'Discuss Your Masjid Workflow',   short: 'Discuss masjid workflow',    about: 'Masjid AI OS',                                   industry: 'Education, nonprofits & community' },
  industries:           { label: 'Discuss your industry needs',    short: 'Discuss your industry',      about: 'your industry',                                  industry: '' },
  about:                { label: 'Talk to the team behind it',     short: 'Talk to our team',           about: 'how we work',                                    industry: '' },
  'case-studies':       { label: 'See how this would run for you', short: 'See it on your business',    about: 'a deployment like the ones shown here',          industry: '' },

  /* The eleven umbrella industries. Each label names the sector, so the visitor is never asked to
     re-explain what they were just reading. */
  'home-field-services':              { label: 'Discuss Your Service Calls',     short: 'Discuss your calls',        about: 'field-service call handling',        industry: 'Home & field services' },
  'healthcare-dental':                { label: 'Discuss Your Practice Needs',    short: 'Discuss your practice',     about: 'practice front-desk handling',       industry: 'Healthcare & dental' },
  legal:                              { label: 'Discuss Your Intake Flow',       short: 'Discuss your intake',       about: 'after-hours legal intake',           industry: 'Legal' },
  'financial-professional-services':  { label: 'Discuss Your Client Enquiries',  short: 'Discuss your enquiries',    about: 'advisory enquiry handling',          industry: 'Financial & professional advisory' },
  'real-estate-property':             { label: 'Discuss Your Enquiry Flow',      short: 'Discuss your enquiries',    about: 'property enquiry response',          industry: 'Real estate & property' },
  'food-hospitality-events':          { label: 'Discuss Your Booking Flow',      short: 'Discuss your bookings',     about: 'reservation and event enquiries',    industry: 'Food, hospitality & events' },
  'automotive-fleet':                 { label: 'Discuss Your Service Desk',      short: 'Discuss your service desk', about: 'sales, service and roadside calls',  industry: 'Automotive & fleet' },
  'beauty-wellness-personal-care':    { label: 'Discuss Your Booking Desk',      short: 'Discuss your bookings',     about: 'appointment booking',                industry: 'Beauty, wellness & personal care' },
  'business-services-agencies':       { label: 'Discuss Your Lead Flow',         short: 'Discuss your lead flow',    about: 'inbound lead qualification',         industry: 'Business services, agencies & technology' },
  'retail-ecommerce-order-taking':    { label: 'Discuss Your Order Enquiries',   short: 'Discuss your orders',       about: 'order and support enquiries',        industry: 'Retail, e-commerce & order-taking' },
  'education-nonprofits-community':   { label: 'Discuss Your Enquiry Flow',      short: 'Discuss your enquiries',    about: 'admissions and community enquiries', industry: 'Education, nonprofits & community' },

  /* Where the visitor lands on /demo with no context at all. */
  fallback:             { label: 'Book a Free Demo',               short: 'Book a Free Demo',           about: 'our services',                                   industry: '' }
};
