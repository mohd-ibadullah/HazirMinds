// @ts-nocheck
// Ported from the approved design file "Book a Discovery Call".
import { DCLogic, React } from '../../../lib/dc-runtime.js';

export default class Component extends DCLogic {
  state = { w: typeof window !== 'undefined' ? window.innerWidth : 1440, step: 1, tried: false, sending: false, sendErr: '', sent: false, name: '', email: '', company: '', size: '', industry: '', solve: [], timeline: '', board: '', phone: '', notes: '', heard: '', hp: '', startedAt: Date.now() };
  componentDidMount() {
    this.onResize = () => this.setState({ w: window.innerWidth });
    window.addEventListener('resize', this.onResize);
    try {
      const q = new URLSearchParams(window.location.search);
      const topic = q.get('topic') || this.props.topic;
      const st = {};
      if (topic === 'security') st.solve = ['Security review'];
      if ((q.get('board') || this.props.board) === 'yes') st.board = 'Yes';
      const sv = q.get('solve');
      if (sv) st.solve = [...new Set([...(st.solve || []), ...sv.split('|')])];
      const ind = q.get('industry');
      if (ind) st.industry = ind;
      if (Object.keys(st).length) this.setState(st);
    } catch (e) {}
  }
  cardRef = React.createRef();
  focusCard() {
    setTimeout(() => requestAnimationFrame(() => {
      const el = this.cardRef.current; if (!el) return;
      try { el.focus({ preventScroll: true }); } catch (x) {}
      const top = el.getBoundingClientRect().top;
      if (top < 80 || top > window.innerHeight * 0.6) window.scrollTo(0, Math.max(0, top + window.scrollY - 88));
    }), 30);
  }
  componentWillUnmount() { window.removeEventListener('resize', this.onResize); }
  errors(step) {
    const s = this.state, e = {};
    if (step === 1) {
      if (!s.name.trim()) e.name = 'Enter your full name.';
      if (!s.email.trim()) e.email = 'Enter your email address.';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email.trim())) e.email = 'Enter an email address like name@company.com.';
      if (!s.company.trim()) e.company = 'Enter your company or organization name.';
    } else {
      if (!s.size) e.size = 'Choose your company size.';
      if (!s.industry) e.industry = 'Choose your industry.';
      if (!s.solve.length) e.solve = 'Pick at least one thing you would like to solve.';
    }
    return e;
  }
  /* The only path by which this form reaches HazirMinds. POSTs to /api/lead, which
     fails closed: nothing moves to the next step until the endpoint answers ok. */
  sendMessage(status, data) {
    if (status === 400) return 'Check your name and email address, then try again.';
    if (status === 429) return 'That was a few too many attempts. Please wait a minute and try again.';
    if (status === 502 || status === 503) return 'We could not send it just now. Email contact@hazirminds.ai and we will pick it up from there.';
    if (data && data.error === 'not_configured') return 'This form is not connected yet. Email contact@hazirminds.ai and we will pick it up from there.';
    return 'Something went wrong on our side. Email contact@hazirminds.ai and we will pick it up from there.';
  }
  async submit() {
    const s = this.state;
    if (s.sending) return;
    this.setState({ sending: true, sendErr: '' });
    const bits = [];
    if (s.solve.length) bits.push('Would like to solve: ' + s.solve.join(', '));
    if (s.timeline) bits.push('Timeline: ' + s.timeline);
    if (s.board) bits.push('Board or leadership presentation: ' + s.board);
    if (s.heard) bits.push('Heard about us via: ' + s.heard);
    if (s.notes.trim()) bits.push('Notes: ' + s.notes.trim());
    const page = typeof window !== 'undefined' ? window.location.pathname + (window.location.search || '') : '/book-a-discovery-call';
    const payload = {
      form: 'book-a-discovery-call',
      page: page,
      name: s.name.trim(),
      email: s.email.trim(),
      company: s.company.trim(),
      phone: s.phone.trim(),
      industry: s.industry,
      size: s.size,
      notes: bits.join(' | ').slice(0, 2000)
    };
    try {
      const r = await fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      let data = {};
      try { data = await r.json(); } catch (x) {}
      if (r.ok && data && data.ok) {
        this.setState({
          sending: false, sent: true, sendErr: '', step: 3, tried: false,
          consent: { text: 'By submitting, you agree to our Privacy Policy. We\u2019ll use your details to respond to your request.', version: 'v0.1', at: new Date().toISOString(), page: page }
        });
        this.focusCard();
        return;
      }
      this.setState({ sending: false, sendErr: this.sendMessage(r.status, data) });
    } catch (x) {
      this.setState({ sending: false, sendErr: 'We could not reach the server. Check your connection and try again, or email contact@hazirminds.ai.' });
    }
    this.focusCard();
  }
  renderVals() {
    const s = this.state;
    const set = k => e => this.setState({ [k]: e.target.value });
    const err = s.tried ? this.errors(s.step) : {};
    const n = Object.keys(err).length;
    const pill = (on) => on
      ? { bg: '#E3EDE9', fg: '#0B3A35', bd: '1.5px solid #0F4C45', fw: '600', chk: 'inline-block' }
      : { bg: '#FFFFFF', fg: '#1A211F', bd: '1px solid #8A8F8B', fw: '400', chk: 'none' };
    const single = (k, list, optional) => list.map(label => ({ label, sel: s[k] === label, ...pill(s[k] === label), go: () => this.setState({ [k]: optional && s[k] === label ? '' : label }) }));
    const SIZES = ['Just me', '2–10', '11–50', '51–200', '201–500', '500+'];
    const SOLVE = ['Missed calls or slow replies', 'Scheduling back-and-forth', 'Leads going cold', 'Website not bringing in leads', 'Too much manual busywork', 'Connecting our systems or custom software', 'Security review', 'Not sure yet, help me find out'];
    const fieldBorder = k => err[k] ? '1.5px solid #A4241B' : '1px solid #8A8F8B';
    const labels = { name: 'Full name', email: 'Email', company: 'Company name', size: 'Company size', industry: 'Industry', solve: 'What would you like to solve?' };
    const advance = () => {
      if (s.hp) return;
      const e = this.errors(s.step);
      if (Object.keys(e).length) { this.setState({ tried: true }); return; }
      if (s.step === 1) { this.setState({ step: 2, tried: false }); this.focusCard(); return; }
      this.submit();
    };
    return {
      asidePos: s.w >= 900 ? 'sticky' : 'static',
      isForm: s.step <= 2, isStep1: s.step === 1, isStep2: s.step === 2, isSchedule: s.step === 3, isThanks: s.step === 4,
      stepNum: Math.min(s.step, 2), stepName: s.step === 1 ? 'About you' : 'Your business', seg2: s.step >= 2 ? '#0F4C45' : '#DED5C6',
      onSubmit: e => { e.preventDefault(); advance(); },
      back: () => { this.setState({ step: 1, tried: false }); this.focusCard(); },
      picked: () => { this.setState({ step: 4 }); this.focusCard(); }, cardRef: this.cardRef,
      restart: () => this.setState({ step: 1, tried: false, sending: false, sendErr: '', sent: false, name: '', email: '', company: '', size: '', industry: '', solve: [], timeline: '', board: '', phone: '', notes: '', heard: '' }),
      hasErrors: n > 0,
      sending: s.sending,
      submitLabel: s.sending ? 'Sending' : 'Choose a time',
      sendErr: s.sendErr,
      sendErrOn: !!s.sendErr,
      errorTitle: n === 1 ? 'One field needs your attention' : n + ' fields need your attention',
      errorList: Object.keys(err).map(k => labels[k]).join(' · '),
      name: s.name, email: s.email, company: s.company, phone: s.phone, notes: s.notes, heard: s.heard, industry: s.industry, hp: s.hp,
      setName: set('name'), setEmail: set('email'), setCompany: set('company'), setPhone: set('phone'), setHeard: set('heard'), setIndustry: set('industry'), setHp: set('hp'),
      setNotes: e => this.setState({ notes: e.target.value.slice(0, 500) }), notesCount: s.notes.length,
      eName: err.name, eNameOn: !!err.name, bName: fieldBorder('name'),
      eEmail: err.email, eEmailOn: !!err.email, bEmail: fieldBorder('email'),
      eCompany: err.company, eCompanyOn: !!err.company, bCompany: fieldBorder('company'),
      eSize: err.size, eSizeOn: !!err.size,
      eIndustry: err.industry, eIndustryOn: !!err.industry, bIndustry: fieldBorder('industry'),
      eSolve: err.solve, eSolveOn: !!err.solve,
      sizes: single('size', SIZES, false),
      timeline: single('timeline', ['Just exploring', 'Next 3 months', 'Ready now'], true),
      board: single('board', ['Yes', 'Not now'], true),
      solve: SOLVE.map(label => { const on = s.solve.includes(label); return { label, sel: on, ...pill(on), go: () => this.setState({ solve: on ? s.solve.filter(x => x !== label) : [...s.solve, label] }) }; }),
      firstName: (s.name.trim().split(/\s+/)[0]) || 'there'
    };
  }
}
