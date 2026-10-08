// @ts-nocheck
// Ported from the approved design file "Automated Communications".
import { DCLogic, React } from '../../../lib/dc-runtime.js';

export default class Component extends DCLogic {
  state = { w: typeof window !== 'undefined' ? window.innerWidth : 1440, trig: 'inq', appr: {} };
  componentDidMount() { this.onResize = () => this.setState({ w: window.innerWidth }); window.addEventListener('resize', this.onResize); }
  componentWillUnmount() { window.removeEventListener('resize', this.onResize); }
  base() { return { drafts: !!this.props.showDrafts, faqCols: this.state.w >= 1000 ? 'minmax(0,1fr) minmax(0,2fr)' : 'minmax(0,1fr)' }; }
  renderVals() {
    const s = this.state;
    const T = {
      inq: { label: 'A new inquiry comes in', icon: 'mark_chat_unread', hint: 'From a call, chat or form', steps: [
        { when: 'Instantly', title: 'Confirmation to the customer', icon: 'mark_email_read', ch: 'Text', text: 'Thanks for reaching out to Oakline Home Services. We got your message and will reply today.', appr: false },
        { when: 'Instantly', title: 'Notification to your team', icon: 'notifications', ch: 'Team inbox', text: 'New inquiry from Dana R.: water heater not working. Added to your pipeline.', internal: true },
        { when: 'Next morning', title: 'Follow-up to the customer', icon: 'forward_to_inbox', ch: 'WhatsApp', text: 'Hi Dana, checking in about your water heater. Would Thursday morning work for a visit?', appr: true } ] },
      book: { label: 'An appointment is booked', icon: 'event_available', hint: 'By your team or the AI Receptionist', steps: [
        { when: 'Instantly', title: 'Booking confirmation', icon: 'mark_email_read', ch: 'Text', text: "You're booked for Thursday at 9 a.m. Let us know if you need to change it.", appr: false },
        { when: 'Instantly', title: 'Notification to your team', icon: 'notifications', ch: 'Team inbox', text: 'Dana R. booked Thursday, 9 a.m.: water heater visit.', internal: true },
        { when: 'Day before', title: 'Reminder to the customer', icon: 'alarm', ch: 'Phone call', text: "Reminder: we'll see you tomorrow at 9 a.m. If you need to change it, just let us know.", appr: false } ] },
      done: { label: 'A job is completed', icon: 'task_alt', hint: 'When your team marks it done', steps: [
        { when: 'Same day', title: 'Thank-you message', icon: 'favorite', ch: 'Email', text: "Thanks for choosing Oakline today. Reply with any questions about your visit.", appr: false },
        { when: 'One week later', title: 'Check-in', icon: 'forward_to_inbox', ch: 'Email', text: "Hi Dana, how's the new water heater working? We're here if you need anything.", appr: true } ] }
    };
    const t = T[s.trig];
    const key = i => s.trig + '-' + i;
    const CH = [['Text', 'sms'], ['Email', 'mail'], ['WhatsApp', 'chat'], ['Phone call', 'call']];
    const steps = t.steps.map((x, i) => {
      const on = s.appr[key(i)] ?? x.appr;
      const ch = (s.ch || {})[key(i)] ?? x.ch;
      return { ...x, meta: x.when + ' · ' + ch, isCall: !x.internal && ch === 'Phone call',
        chs: CH.map(([label, icon]) => { const sel = label === ch; return { label, icon, on: sel, bd: sel ? '1.5px solid #0F4C45' : '1px solid #8A8F8B', bg: sel ? '#E3EDE9' : '#FFFFFF', fw: sel ? '600' : '400', go: () => this.setState(st => ({ ch: { ...(st.ch || {}), [key(i)]: label } })) }; }), bt: i === 0 ? 'none' : '1px solid #EEE8DE', canApprove: !x.internal, internal: !!x.internal, appr: on,
        track: on ? '#0F4C45' : '#8A8F8B', knob: on ? '21px' : '3px',
        status: on ? 'Waits for approval' : 'Sends automatically', chipBg: on ? '#F7ECD6' : '#E5F0E8', chipFg: on ? '#7A4E00' : '#1E6B3E',
        toggle: () => this.setState(st => ({ appr: { ...st.appr, [key(i)]: !on } })) };
    });
    const n = steps.length, w = steps.filter(x => x.appr && x.canApprove).length;
    return { ...this.base(),
      triggers: Object.keys(T).map(k => { const on = k === s.trig; return { label: T[k].label, icon: T[k].icon, hint: T[k].hint, sel: on, bd: on ? '1.5px solid #0F4C45' : '1px solid #DED5C6', bg: on ? '#FFFFFF' : 'rgba(255,255,255,.55)', go: () => this.setState({ trig: k }) }; }),
      trigLabel: t.label.toLowerCase(), steps,
      summary: n + ' messages · ' + (w === 0 ? 'none wait' : w === 1 ? '1 waits' : w + ' wait') + " for a person's approval" };
  }
}
