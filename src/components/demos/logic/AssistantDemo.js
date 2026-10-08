// @ts-nocheck
// Ported from the approved design file "AI-Powered Website".
import { DCLogic, React } from '../../../lib/dc-runtime.js';

export default class Component extends DCLogic {
  state = { w: typeof window !== 'undefined' ? window.innerWidth : 1440, thread: [], last: null };
  componentDidMount() { this.onResize = () => this.setState({ w: window.innerWidth }); window.addEventListener('resize', this.onResize); }
  componentWillUnmount() { window.removeEventListener('resize', this.onResize); }
  base() { return { drafts: !!this.props.showDrafts, faqCols: this.state.w >= 1000 ? 'minmax(0,1fr) minmax(0,2fr)' : 'minmax(0,1fr)' }; }
  renderVals() {
    const s = this.state;
    const KB = [
      { id: 'hours', label: 'Hours', text: 'Open Monday to Saturday, 7 a.m. to 7 p.m.' },
      { id: 'est', label: 'Estimates', text: 'Estimates are free for repairs and installs.' },
      { id: 'book', label: 'Booking', text: 'Visits can be booked for any open weekday morning. The team confirms by phone.' }
    ];
    const QS = [
      { label: 'What are your hours?', k: 'hours', out: 'answer', reply: "We're open Monday to Saturday, 7 a.m. to 7 p.m. Is there something I can help you book?" },
      { label: 'Do you give free estimates?', k: 'est', out: 'answer', reply: 'Yes. Estimates are free for repairs and installs. Would you like one?' },
      { label: 'Can someone come Thursday morning?', k: 'book', out: 'lead', reply: "Thursday morning is open. Can I take your name and the best number to reach you? The team will call to confirm." },
      { label: 'How much does a full remodel cost?', k: null, out: 'handoff', reply: "I don't have approved pricing for remodels, so I won't guess. I can pass your question to the team. What's the best way to reach you?" }
    ];
    const OUT = {
      answer: { icon: 'menu_book', title: 'Answered from approved knowledge', text: 'It used one approved fact, and nothing else.', bg: '#E3EDE9', fg: '#0F4C45' },
      lead: { icon: 'person_add', title: 'Lead captured', text: 'Name, need and callback number go to your team with the full conversation.', bg: '#E3EDE9', fg: '#0F4C45' },
      handoff: { icon: 'support_agent', title: 'Handed to a person', text: "Remodel pricing isn't in the approved knowledge, so it didn't guess. Your team gets the question and the visitor's contact details.", bg: '#F7ECD6', fg: '#7A4E00' }
    };
    const msg = (from, text) => from === 'ai'
      ? { who: 'AI', text, align: 'flex-start', radius: '12px 12px 12px 4px', bg: '#E3EDE9', whoFg: '#0F4C45' }
      : { who: 'Visitor', text, align: 'flex-end', radius: '12px 12px 4px 12px', bg: '#F5F1EA', whoFg: '#585E5A' };
    const thread = [msg('ai', "Hi, I'm an AI assistant for Oakline Home Services. I answer from information the business has approved. How can I help?"), ...s.thread.map(m => msg(m.from, m.text))];
    const last = s.last, o = last ? OUT[last.out] : null;
    return { ...this.base(), threadRev: thread.slice().reverse(), hasThread: s.thread.length > 0,
      qs: QS.map(q => ({ label: q.label, go: () => this.setState(st => ({ thread: [...st.thread, { from: 'v', text: q.label }, { from: 'ai', text: q.reply }], last: q })) })),
      reset: () => this.setState({ thread: [], last: null }),
      kb: KB.map(k => { const used = !!last && last.k === k.id; return { label: k.label, text: k.text, used, bd: used ? '1.5px solid #0F4C45' : '1px solid #DED5C6', bg: used ? '#E3EDE9' : '#FAF7F2' }; }),
      hasOutcome: !!o, outIcon: o ? o.icon : '', outTitle: o ? o.title : '', outText: o ? o.text : '', outBg: o ? o.bg : '#fff', outFg: o ? o.fg : '#0F4C45' };
  }
}
