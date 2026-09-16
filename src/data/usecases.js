// HazirMinds use cases — 9 pages
module.exports = [
  {
    key: 'after-hours-rescue', name: 'After-Hours Rescue', icon: 'moon',
    pain: 'Most missed calls land after hours — exactly when nobody is there to answer.',
    fix: 'A HazirMinds voice agent answers every after-hours call from the second ring: qualifies the caller, answers common questions, and books them into tomorrow\'s calendar.',
    outcome: 'The call that used to go to voicemail — and your competitor — becomes a confirmed appointment before you wake up.',
    stat: '24/7/365', statLabel: 'coverage, with pickup in under one second, every day of the year',
    services: ['ai-receptionist', 'missed-call-text-back', 'ai-appointment-setter']
  },
  {
    key: 'speed-to-lead', name: 'Speed-to-Lead', icon: 'zap',
    pain: 'The average business responds to a new web lead in 42 hours. By then, the buyer has already chosen someone else.',
    fix: 'The moment a lead arrives, HazirMinds calls and texts within 60 seconds, qualifies interest, and books a time on your calendar while the buyer is still warm.',
    outcome: 'Contact rates triple and your team only talks to leads who are ready to move.',
    stat: '<60s', statLabel: 'from lead arrival to first human-quality response (illustrative)',
    services: ['speed-to-lead', 'ai-sdr', 'lead-qualification-scoring']
  },
  {
    key: 'missed-call-textback', name: 'Missed-Call Text-Back', icon: 'message',
    pain: 'Missed calls are silent revenue leaks — the caller rarely tries twice.',
    fix: 'Within seconds of a missed call, HazirMinds texts the caller: acknowledges the miss, opens a two-way conversation, and rescues the booking.',
    outcome: 'Roughly a third of missed calls convert into booked jobs instead of lost opportunities.',
    stat: '5s', statLabel: 'from missed call to personalized text-back (illustrative)',
    services: ['missed-call-text-back', 'ai-receptionist', 'workflow-automation']
  },
  {
    key: 'no-show-reduction', name: 'No-Show Reduction', icon: 'calendar',
    pain: 'Empty slots cost the same as full ones: staff, rooms, prep — with zero revenue attached.',
    fix: 'Multi-touch confirmation sequences, one-tap rescheduling, and waitlist backfill run automatically for every appointment.',
    outcome: 'No-shows typically drop 30–60% and cancelled slots get refilled from the waitlist.',
    stat: '30–60%', statLabel: 'typical no-show reduction across HazirMinds clients (illustrative)',
    services: ['no-show-reduction', 'sms-text-agent', 'workflow-automation']
  },
  {
    key: 'database-reactivation', name: 'Database Reactivation', icon: 'refresh',
    pain: 'Hundreds of past leads sit in your CRM. Each one was interested once — they just went cold.',
    fix: 'HazirMinds segments your database, launches personalised win-back campaigns by text and call, and books revived leads straight onto the calendar.',
    outcome: 'Found revenue from a list you already own — priced per the à-la-carte table on /pricing.',
    stat: 'Reactivation', statLabel: 'setup plus performance share — priced so it pays for itself (illustrative)',
    services: ['database-reactivation', 'ai-outbound-calling', 'sms-text-agent']
  },
  {
    key: 'inbound-qualification', name: 'Inbound Qualification', icon: 'filter',
    pain: 'Your team burns hours on tyre-kickers while real buyers wait in the queue.',
    fix: 'Every inbound inquiry is scored against your ideal-customer criteria, routed to the right owner, and fast-tracked when it matters.',
    outcome: 'Sales works only qualified opportunities; junk and spam never reach the calendar.',
    stat: '100%', statLabel: 'of inquiries scored, routed and logged automatically (illustrative)',
    services: ['lead-qualification-scoring', 'speed-to-lead', 'crm-setup-migration']
  },
  {
    key: 'review-engine', name: 'Review Engine', icon: 'star',
    pain: 'Happy customers forget to review; unhappy ones never do. Your rating stalls while competitors climb.',
    fix: 'HazirMinds asks for the review at the perfect moment, routes unhappy customers to private feedback first, and replies to every public review in your voice.',
    outcome: 'A steady stream of fresh 5-star reviews — and problems you hear about privately, not publicly.',
    stat: '4.9★', statLabel: 'typical maintained rating with automated requests and replies (illustrative)',
    services: ['review-reputation-ai', 'ai-content-engine', 'local-seo-gbp']
  },
  {
    key: 'crm-automation', name: 'CRM Automation', icon: 'workflow',
    pain: 'Your CRM is a graveyard: stale deals, missing notes, follow-ups that depend on memory.',
    fix: 'HazirMinds wires your pipeline to real behaviour — calls, texts, form fills — so stages update, tasks appear and nudges fire on their own.',
    outcome: 'A pipeline that tells the truth, follow-ups that never slip, and forecasts you can actually trust.',
    stat: '0', statLabel: 'manual data-entry minutes left in your week (illustrative)',
    services: ['pipeline-deal-automation', 'crm-setup-migration', 'kpi-dashboards']
  },
  {
    key: 'ai-employee', name: 'Custom AI Employee', icon: 'user',
    pain: 'You need another pair of hands for a specific role — but hiring, training and retention are expensive.',
    fix: 'HazirMinds builds, trains and manages an AI teammate around the exact role: intake, support, back-office, research — scoped in days, live in weeks.',
    outcome: 'A reliable teammate that works every shift, never quits, and costs a fraction of a salary.',
    stat: 'Weeks', statLabel: 'from role definition to a working AI teammate (illustrative)',
    services: ['custom-ai-employee', 'rag-knowledge-base', 'internal-copilots']
  }
];
