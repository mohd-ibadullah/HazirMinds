// @ts-nocheck
// Ported from the approved design file "See It in Action".
import { DCLogic, React } from '../../../lib/dc-runtime.js';

export default class Component extends DCLogic {
  state = { w: typeof window !== 'undefined' ? window.innerWidth : 1440, reduce: false, step: 0, c: '', m: '', v: '', a: '', h: '', rr: '', disp: { missed: null, value: null, hrs: null, tv: null }, fInd: '', fSel: [], fPri: '' };
  componentDidMount() {
    this.onResize = () => this.setState({ w: window.innerWidth });
    window.addEventListener('resize', this.onResize);
    this.mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.setState({ reduce: this.mq.matches });
  }
  componentWillUnmount() { window.removeEventListener('resize', this.onResize); cancelAnimationFrame(this.raf); }
  num(x) { const n = parseFloat(x); return isNaN(n) ? null : n; }
  targets(s) {
    const C = this.num(s.c), M = this.num(s.m), V = this.num(s.v), A = this.num(s.a), H = this.num(s.h), R = this.num(s.rr);
    const missed = C != null && M != null ? C * 4.33 * M / 100 : null;
    const value = missed != null && V != null && A != null ? C * 4.33 * (M / 100) * (V / 100) * A : null;
    const hrs = H != null ? H * 4.33 : null;
    const tv = hrs != null && R != null ? H * 4.33 * R : null;
    return { missed, value, hrs, tv };
  }
  tween() {
    const to = this.targets(this.state);
    cancelAnimationFrame(this.raf);
    if (this.state.reduce) { this.setState({ disp: to }); return; }
    const from = { ...this.state.disp }, t0 = performance.now(), dur = 450;
    const tick = t => {
      const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3), d = {};
      for (const key in to) d[key] = to[key] == null ? null : (from[key] == null ? 0 : from[key]) + (to[key] - (from[key] == null ? 0 : from[key])) * e;
      this.setState({ disp: d });
      if (k < 1) this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }
  renderVals() {
    const s = this.state;
    const set = k => e => this.setState({ [k]: e.target.value.replace(/[^0-9.]/g, '') }, () => this.tween());
    const go = i => () => this.setState({ step: Math.max(0, Math.min(4, i)) });
    const TOUR = [
      { title: 'A call comes in', screen: 'Calls', cap: "It's 2:14 a.m. The AI Receptionist answers on your dedicated number and introduces itself as an AI. Select \u201cView the call\u201d." },
      { title: 'Transcript and callback details', screen: 'Call details', cap: "The full transcript and the caller's callback details are saved. Select \u201cOpen the pipeline\u201d." },
      { title: 'The lead appears in the pipeline', screen: 'Pipeline', cap: 'Dana R. lands in the New column with the call attached, and a follow-up is drafted. Select her card.' },
      { title: 'A follow-up waits for approval', screen: 'Approvals', cap: 'Nothing is sent until a person on your team approves it. Select \u201cApprove\u201d.' },
      { title: 'Approved and sent', screen: 'Approvals', cap: 'The message goes out, and the approval is logged in the audit trail.' }
    ];
    const FP = [
      { label: 'Missed calls or slow replies', svc: 'AI Receptionist', book: 'Missed calls or slow replies' },
      { label: 'Scheduling back-and-forth', svc: 'AI Receptionist with booking (standard)', book: 'Scheduling back-and-forth' },
      { label: 'Leads going cold', svc: 'Automated Communications, with Client Pipeline & Dashboard', book: 'Leads going cold' },
      { label: "A website that doesn't bring in leads", svc: 'AI-Powered Website', book: 'Website not bringing in leads' },
      { label: 'Owner doing everything', svc: 'AI Receptionist, then Automated Communications', book: 'Too much manual busywork' },
      { label: 'Disconnected tools or manual data entry', svc: 'Custom Integrations & Software', book: 'Connecting our systems or custom software' }
    ];
    const pill = on => on ? { bg: '#E3EDE9', fg: '#0B3A35', bd: '1.5px solid #0F4C45', fw: '600', chk: 'inline-flex' } : { bg: '#FFFFFF', fg: '#1A211F', bd: '1px solid #8A8F8B', fw: '400', chk: 'none' };
    const one = n => (Math.round(n * 10) / 10).toLocaleString('en-US');
    const money = n => '$' + Math.round(n).toLocaleString('en-US');
    const d = s.disp;
    const sel = s.fSel.map(i => FP[i]);
    const startSvc = sel.length ? sel[0].svc : '';
    const later = [...new Set(sel.slice(1).map(x => x.svc))].filter(x => x !== startSvc);
    const q = new URLSearchParams();
    if (s.fInd) q.set('industry', s.fInd);
    if (sel.length) q.set('solve', [...new Set(sel.map(x => x.book))].join('|'));
    const wide = s.w >= 980;
    return {
      tourCols: wide ? '300px minmax(0,1fr)' : 'minmax(0,1fr)', tourDivider: wide ? '1px solid #DED5C6' : 'none', tourDividerB: wide ? 'none' : '1px solid #DED5C6',
      tsteps: TOUR.map((t, i) => { const on = i === s.step, done = i < s.step; return { n: i + 1, title: t.title, go: go(i), cur: on ? 'step' : undefined, bg: on ? '#FFFFFF' : 'transparent', bd: on ? '#DED5C6' : 'transparent', nBg: on || done ? '#0F4C45' : 'transparent', nFg: on || done ? '#FAF7F2' : '#0F4C45' }; }),
      s0: s.step === 0, s1: s.step === 1, s2: s.step === 2, s3: s.step === 3, s4: s.step === 4,
      screenName: TOUR[s.step].screen, tourNum: s.step + 1, tourCaption: TOUR[s.step].cap,
      fade: s.reduce ? 'none' : 'hm-fade .25s ease-out',
      pulse: React.createElement('span', { key: 'p' + s.step, 'aria-hidden': true, style: { position: 'absolute', inset: '-6px', borderRadius: '999px', border: '2px solid #1D6B60', pointerEvents: 'none', animation: s.reduce ? 'none' : 'hm-pulse 1.4s ease-out 2', opacity: s.reduce ? 0.7 : 0 } }),
      next: go(s.step + 1), prev: go(s.step - 1), restartTour: go(0),
      atStart: s.step === 0, atEnd: s.step === 4,
      prevBd: s.step === 0 ? '#CFC7B9' : '#0F4C45', prevFg: s.step === 0 ? '#7A7F7B' : '#0F4C45',
      nextBg: s.step === 4 ? '#E7E1D6' : '#0F4C45', nextFg: s.step === 4 ? '#6E736F' : '#FAF7F2',
      c: s.c, m: s.m, v: s.v, a: s.a, h: s.h, rr: s.rr,
      setC: set('c'), setM: set('m'), setV: set('v'), setA: set('a'), setH: set('h'), setR: set('rr'),
      dMissed: d.missed == null ? '—' : one(d.missed), dValue: d.value == null ? '—' : money(d.value),
      dHrs: d.hrs == null ? '—' : one(d.hrs), dTv: d.tv == null ? '—' : money(d.tv),
      fInd: s.fInd, setInd: e => this.setState({ fInd: e.target.value }),
      fProbs: FP.map((p, i) => { const idx = s.fSel.indexOf(i), on = idx >= 0; return { label: p.label, sel: on, order: on ? idx + 1 : '', ...pill(on), go: () => this.setState({ fSel: on ? s.fSel.filter(x => x !== i) : [...s.fSel, i] }) }; }),
      fPris: ['More customers', 'Less busywork', 'Time back'].map(label => ({ label, sel: s.fPri === label, ...pill(s.fPri === label), go: () => this.setState({ fPri: s.fPri === label ? '' : label }) })),
      noResult: !sel.length, hasResult: sel.length > 0, startSvc, later, hasLater: later.length > 0,
      hasCtx: !!(s.fInd || s.fPri), ctx: [s.fInd, s.fPri && ('What matters most: ' + s.fPri.toLowerCase())].filter(Boolean).join(' · '),
      finderHref: '/book-a-discovery-call' + (q.toString() ? '?' + q.toString() : ''),
      resPos: wide ? 'sticky' : 'static'
    };
  }
}
