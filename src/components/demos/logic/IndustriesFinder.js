// @ts-nocheck
// Ported from the approved design file "Industries".
import { DCLogic, React } from '../../../lib/dc-runtime.js';

export default class Component extends DCLogic {
  state = { q: '', w: typeof window !== 'undefined' ? window.innerWidth : 1440 };
  componentDidMount() { this.onResize = () => this.setState({ w: window.innerWidth }); window.addEventListener('resize', this.onResize); }
  componentWillUnmount() { window.removeEventListener('resize', this.onResize); }
  renderVals() {
    const P = this.props, s = this.state;
    const book = ind => '/book-a-discovery-call?industry=' + encodeURIComponent(ind);
    const IND = [
      { icon: 'home_repair_service', name: 'Home & Field Services', segs: ['HVAC', 'Plumbing', 'Electrical'], kw: 'contractor trades field service repair heating cooling', book: 'Home & field services' },
      { icon: 'medical_services', name: 'Healthcare & Dental', segs: ['Dental', 'Medical Clinics', 'Behavioral & Mental Health'], kw: 'dentist doctor clinic therapy therapist counseling medical health', book: 'Healthcare & wellness', note: 'Health data is scoped separately.' },
      { icon: 'gavel', name: 'Legal', segs: ['Personal Injury', 'Family Law', 'Criminal Defense'], kw: 'lawyer attorney law firm', book: 'Professional services' },
      { icon: 'account_balance', name: 'Financial & Professional Advisory', segs: ['Accounting & CPA', 'Bookkeeping & Tax', 'Insurance Agencies'], kw: 'accountant cpa tax insurance bookkeeper finance', book: 'Professional services' },
      { icon: 'apartment', name: 'Real Estate & Property', segs: ['Residential & Commercial Brokerage', 'Property Management'], kw: 'realtor broker property landlord rental', book: 'Real estate & property' },
      { icon: 'restaurant', name: 'Food, Hospitality & Events', segs: ['Restaurants', 'Catering', 'Bars & Breweries'], kw: 'restaurant cafe catering bar brewery event venue hospitality', book: 'Hospitality, restaurants & events' },
      { icon: 'directions_car', name: 'Automotive & Fleet', segs: ['Dealerships', 'Auto Repair & Quick Lube', 'Detailing & Body Shops'], kw: 'car auto mechanic dealer garage body shop fleet', book: 'Other' },
      { icon: 'spa', name: 'Beauty, Wellness & Personal Care', segs: ['Salons & Barbershops', 'Spas & Massage', 'Med Spas & Aesthetics'], kw: 'salon barber spa massage medspa aesthetics beauty', book: 'Healthcare & wellness' },
      { icon: 'business_center', name: 'Business Services, Agencies & Technology', segs: ['Marketing & Creative Agencies', 'IT & MSPs', 'Staffing & Recruiting'], kw: 'agency marketing creative it msp staffing recruiting consulting', book: 'Professional services' },
      { icon: 'storefront', name: 'Retail, E-commerce & Order-Taking', segs: ['E-commerce', 'Specialty Retail', 'Home Improvement'], kw: 'shop store ecommerce online retail orders', book: 'Retail & e-commerce' },
      { icon: 'school', name: 'Education, Nonprofits & Community', segs: ['Private Schools', 'Tutoring & Test Prep', 'Childcare & Daycare'], kw: 'school tutoring childcare daycare nonprofit charity community education', book: 'Schools & education' },
      { icon: 'mosque', name: 'Masjids & Islamic Centers', segs: ['Has its own section'], kw: 'masjid mosque islamic center', masjid: true }
    ];
    const norm = t => t.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    const q = norm(s.q);
    const words = q ? q.split(' ') : [];
    const hit = t => words.every(wd => norm(t).includes(wd));
    const results = IND.filter(it => !q || hit(it.name + ' ' + it.segs.join(' ') + ' ' + it.kw)).map(it => ({
      icon: it.icon, name: it.name, segLabel: it.name + ' includes',
      bg: it.masjid ? '#E3EDE9' : '#FFFFFF', bd: it.masjid ? '#E3EDE9' : '#DED5C6', chipBg: it.masjid ? '#FFFFFF' : '#E3EDE9',
      segs: it.segs.map(label => { const m = q && !it.masjid && hit(label); return { label, bd: m ? '1.5px solid #0F4C45' : '1px solid #DED5C6', bg: m ? '#E3EDE9' : (it.masjid ? 'rgba(255,255,255,.6)' : '#FAF7F2'), fg: m ? '#0F4C45' : '#2F3633', fw: m ? '600' : '400' }; }),
      hasNote: !!it.note, note: it.note || '',
      href: it.masjid ? '/masjids' : book(it.book),
      link: it.masjid ? 'Visit the masjid section →' : 'Book a call for your business →'
    }));
    const n = results.length;
    const SIG = [
      { label: 'Missed calls or slow replies', service: 'AI Receptionist', icon: 'call', href: '/ai-receptionist' },
      { label: 'Manual scheduling back-and-forth', service: 'AI Receptionist, with booking', icon: 'event_available', href: '/ai-receptionist' },
      { label: 'Leads going cold before follow-up', service: 'Automated Communications', icon: 'forward_to_inbox', href: '/automated-communications' },
      { label: 'A website that produces nothing', service: 'AI-Powered Website', icon: 'language', href: '/ai-powered-website' },
      { label: 'Leads, calls and deals in different places', service: 'Client Pipeline & Dashboard', icon: 'view_kanban', href: '/client-pipeline-dashboard' },
      { label: 'The owner is doing everything', service: 'AI Receptionist and Automated Communications', icon: 'task_alt', href: '/services' }
    ];
    return {
      drafts: !!P.showDrafts,
      q: s.q, hasQ: !!s.q, setQ: e => this.setState({ q: e.target.value }), clearQ: () => this.setState({ q: '' }),
      results, hasResults: n > 0, noResults: n === 0,
      countLabel: q ? (n === 1 ? '1 match' : n + ' matches') : 'Showing all ' + IND.length + ' industries',
      signals: SIG, shareCols: s.w >= 1000 ? 'minmax(0,1fr) minmax(0,1.6fr)' : 'minmax(0,1fr)'
    };
  }
}
