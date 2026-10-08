// @ts-nocheck
// Ported from the approved design file "Managed Infrastructure".
import { DCLogic, React } from '../../../lib/dc-runtime.js';

export default class Component extends DCLogic {
  state = { w: typeof window !== 'undefined' ? window.innerWidth : 1440, i: 0 };
  componentDidMount() { this.onResize = () => this.setState({ w: window.innerWidth }); window.addEventListener('resize', this.onResize); }
  componentWillUnmount() { window.removeEventListener('resize', this.onResize); }
  base() { return { drafts: !!this.props.showDrafts, faqCols: this.state.w >= 1000 ? 'minmax(0,1fr) minmax(0,2fr)' : 'minmax(0,1fr)' }; }
  renderVals() {
    const s = this.state;
    const STEPS = [
      { icon: 'call', title: 'A call comes in', text: 'The call reaches your dedicated number through Twilio, our voice provider.', on: ['caller', 'twilio'] },
      { icon: 'lock', title: 'Encrypted in transit', text: 'Everything moving between services is encrypted with TLS.', on: ['twilio', 'env'] },
      { icon: 'deployed_code', title: 'Handled in your isolated environment', text: "Your environment is separate from every other client's, enforced at the database level.", on: ['env'] },
      { icon: 'menu_book', title: 'The AI answers from your approved knowledge', text: "The AI model, from Anthropic, works only from what you've approved. Your data isn't used to train models for others without your written opt-in.", on: ['ai', 'env'] },
      { icon: 'database', title: 'Stored encrypted at rest', text: 'Recordings and transcripts are stored with AES-256 encryption on AWS in the United States.', on: ['store'] },
      { icon: 'badge', title: 'Only your authorized users can see it', text: 'Access is role-based and enforced by the system.', on: ['access', 'team'] },
      { icon: 'history', title: 'Logged in the audit trail', text: "Every consequential action is logged, so there's a record of who did what, and when.", on: ['log'] }
    ];
    const st = STEPS[s.i];
    const node = ([k, icon, label]) => { const on = st.on.includes(k); return { icon, label, bd: on ? '1.5px solid #0F4C45' : '1px solid #DED5C6', bg: on ? '#0F4C45' : '#FAF7F2', fg: on ? '#FAF7F2' : '#585E5A' }; };
    const go = i => () => this.setState({ i });
    const pOff = s.i === 0, nOff = s.i === STEPS.length - 1;
    return { ...this.base(),
      tsteps: STEPS.map((x, i) => { const on = i === s.i, done = i < s.i; return { num: i + 1, title: x.title, cur: on ? 'step' : undefined, go: go(i), bd: on ? '1.5px solid #0F4C45' : '1px solid transparent', bg: on ? '#FFFFFF' : 'transparent', numBg: on || done ? '#0F4C45' : '#E3EDE9', numFg: on || done ? '#FAF7F2' : '#0F4C45' }; }),
      stepNum: s.i + 1, stepTotal: STEPS.length, stIcon: st.icon, stTitle: st.title, stText: st.text,
      outer: [['caller', 'person', 'Caller'], ['twilio', 'settings_phone', 'Twilio · voice'], ['ai', 'neurology', 'Anthropic · AI model'], ['team', 'groups', 'Your team']].map(node),
      inner: [['env', 'deployed_code', 'Processing'], ['store', 'database', 'Encrypted storage'], ['access', 'badge', 'Access control'], ['log', 'history', 'Audit log']].map(node),
      prev: go(Math.max(0, s.i - 1)), next: go(Math.min(STEPS.length - 1, s.i + 1)), prevOff: pOff, nextOff: nOff,
      prevBd: pOff ? '#DED5C6' : '#0F4C45', prevFg: pOff ? '#6E736F' : '#0F4C45', prevCur: pOff ? 'not-allowed' : 'pointer',
      nextBg: nOff ? '#EEE8DE' : '#0F4C45', nextFg: nOff ? '#6E736F' : '#FAF7F2', nextCur: nOff ? 'not-allowed' : 'pointer' };
  }
}
