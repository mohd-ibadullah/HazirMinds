// @ts-nocheck
// Ported from the approved design file "Client Pipeline and Dashboard".
import { DCLogic, React } from '../../../lib/dc-runtime.js';

export default class Component extends DCLogic {
  state = { w: typeof window !== 'undefined' ? window.innerWidth : 1440, leads: null, sel: null };
  componentDidMount() { this.onResize = () => this.setState({ w: window.innerWidth }); window.addEventListener('resize', this.onResize); }
  componentWillUnmount() { window.removeEventListener('resize', this.onResize); }
  base() { return { drafts: !!this.props.showDrafts, faqCols: this.state.w >= 1000 ? 'minmax(0,1fr) minmax(0,2fr)' : 'minmax(0,1fr)' }; }
  seed() { return [
    { id: 'dana', name: 'Dana R.', need: 'Water heater repair', src: 'Call · 2:14 a.m.', srcIcon: 'call', stage: 0, hist: [{ icon: 'call', text: 'Call answered by the AI Receptionist', when: 'Monday, 2:14 a.m.' }, { icon: 'description', text: 'Transcript and callback details saved', when: 'Monday, 2:16 a.m.' }] },
    { id: 'owen', name: 'Owen T.', need: 'Panel upgrade', src: 'Website', srcIcon: 'language', stage: 0, hist: [{ icon: 'language', text: 'Captured by the AI-Powered Website', when: 'Monday, 8:05 p.m.' }] },
    { id: 'marcus', name: 'Marcus L.', need: 'Kitchen remodel quote', src: 'Website chat', srcIcon: 'chat', stage: 1, hist: [{ icon: 'chat', text: 'Qualified in website chat', when: 'Sunday, 9:42 p.m.' }, { icon: 'forward_to_inbox', text: 'Follow-up approved and sent', when: 'Monday, 9:00 a.m.' }] },
    { id: 'priya', name: 'Priya S.', need: 'AC tune-up', src: 'Call', srcIcon: 'call', stage: 2, hist: [{ icon: 'call', text: 'Call answered by the AI Receptionist', when: 'Friday, 4:30 p.m.' }, { icon: 'request_quote', text: 'Estimate sent by your team', when: 'Saturday, 10:15 a.m.' }] },
    { id: 'grace', name: 'Grace K.', need: 'Maintenance plan', src: 'Call', srcIcon: 'call', stage: 3, hist: [{ icon: 'handshake', text: 'Deal marked won by your team', when: 'Last Thursday' }] }
  ]; }
  renderVals() {
    const s = this.state, ST = ['New', 'Qualified', 'Proposal', 'Won'];
    const leads = s.leads || this.seed();
    const move = d => () => this.setState(st => { const L = (st.leads || this.seed()).map(l => { if (l.id !== st.sel) return l; const n = Math.max(0, Math.min(3, l.stage + d)); if (n === l.stage) return l; return { ...l, stage: n, hist: [...l.hist, { icon: 'swap_horiz', text: 'Moved to ' + ST[n] + ' by you', when: 'Just now · logged' }] }; }); return { leads: L }; });
    const cur = leads.find(l => l.id === s.sel);
    const fOff = !cur || cur.stage >= 3, bOff = !cur || cur.stage <= 0;
    return { ...this.base(),
      demoCols: s.w >= 1100 ? 'minmax(0,2fr) minmax(0,1fr)' : 'minmax(0,1fr)',
      cols: ST.map((name, i) => { const cards = leads.filter(l => l.stage === i); return { name, aria: name + ', ' + cards.length + ' leads', count: cards.length, empty: !cards.length, minH: s.w >= 700 ? '260px' : '0',
        cards: cards.map(l => { const on = l.id === s.sel; return { name: l.name, need: l.need, src: l.src, srcIcon: l.srcIcon, sel: on, bd: on ? '1.5px solid #0F4C45' : '1px solid #DED5C6', sh: on ? '0 8px 20px rgba(15,76,69,.14)' : 'none', go: () => this.setState({ sel: l.id }) }; }) }; }),
      noSel: !cur, hasSel: !!cur, selName: cur ? cur.name : '', selNeed: cur ? cur.need + ' · ' + cur.src : '', selStage: cur ? ST[cur.stage] : '',
      selHist: cur ? cur.hist.slice().reverse().map((h, i) => ({ ...h, fg: i === 0 ? '#0F4C45' : '#585E5A' })) : [],
      fwd: move(1), back: move(-1), fwdOff: fOff, backOff: bOff,
      fwdLabel: cur && cur.stage < 3 ? 'Move to ' + ST[cur.stage + 1] : 'Deal won',
      fwdBg: fOff ? '#EEE8DE' : '#0F4C45', fwdFg: fOff ? '#6E736F' : '#FAF7F2', fwdCur: fOff ? 'not-allowed' : 'pointer',
      backBd: bOff ? '#DED5C6' : '#0F4C45', backFg: bOff ? '#6E736F' : '#0F4C45', backCur: bOff ? 'not-allowed' : 'pointer',
      reset: () => this.setState({ leads: null, sel: null }) };
  }
}
