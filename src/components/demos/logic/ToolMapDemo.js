// @ts-nocheck
// Ported from the approved design file "Custom Integrations and Software".
import { DCLogic, React } from '../../../lib/dc-runtime.js';

export default class Component extends DCLogic {
  state = { w: typeof window !== 'undefined' ? window.innerWidth : 1440, sel: ['cal', 'crm', 'acct'] };
  componentDidMount() { this.onResize = () => this.setState({ w: window.innerWidth }); window.addEventListener('resize', this.onResize); }
  componentWillUnmount() { window.removeEventListener('resize', this.onResize); }
  renderVals() {
    const s = this.state;
    const TOOLS = [
      ['cal', 'Calendar or booking', 'calendar_month'], ['crm', 'CRM or client list', 'contacts'],
      ['acct', 'Accounting or invoicing', 'receipt_long'], ['pay', 'Payments', 'payments'],
      ['forms', 'Online forms', 'assignment'], ['mail', 'Email inbox', 'mail'],
      ['sheet', 'Spreadsheets', 'table_chart'], ['ind', 'Software made for your industry', 'apps']
    ];
    const NODE = Object.fromEntries(TOOLS.map(([k, l, i]) => [k, { label: l, icon: i, bg: '#F5F1EA' }]));
    NODE.hz = { label: 'HazirMinds services', icon: 'hub', bg: '#E3EDE9' };
    NODE.sw = { label: 'Custom software', icon: 'code', bg: '#E3EDE9' };
    const C = [
      { need: ['crm'], from: 'hz', to: 'crm', title: 'New leads go into your CRM', text: 'Leads from the AI Receptionist and website chat arrive with the conversation attached.', st: 'auto' },
      { need: ['cal'], from: 'cal', to: 'hz', title: 'Bookings start your reminders', text: 'A new booking in your calendar starts the confirmation and reminder workflow.', st: 'auto' },
      { need: ['forms'], from: 'forms', to: 'hz', title: 'Form entries start a follow-up', text: 'Each new entry gets a confirmation and lands in your pipeline. Nobody retypes it.', st: 'auto' },
      { need: ['mail'], from: 'mail', to: 'hz', title: 'Email inquiries join your pipeline', text: 'New inquiries that arrive by email are added as leads, so none sit unread.', st: 'auto' },
      { need: ['cal', 'acct'], from: 'cal', to: 'acct', title: 'Completed jobs create a draft invoice', text: 'The invoice is drafted for you, and a person checks it before it goes out.', st: 'appr' },
      { need: ['acct'], from: 'acct', to: 'hz', title: 'Overdue invoices get a reminder', text: 'Reminders go out through a workflow you approve, and a person checks each one first.', st: 'appr' },
      { need: ['pay'], from: 'pay', to: 'hz', title: 'Payments show on the client record', text: 'Your team sees who has paid without opening another tool.', st: 'auto' },
      { need: ['pay', 'acct'], from: 'pay', to: 'acct', title: 'Payments are recorded against invoices', text: 'A person approves each entry before it changes your books.', st: 'appr' },
      { need: ['sheet'], from: 'sheet', to: 'sw', title: 'A spreadsheet doing a core job', text: 'When a spreadsheet runs a core part of your business, we can build a simple tool around it.', st: 'scope' },
      { need: ['ind'], from: 'ind', to: 'hz', title: 'Your industry software, connected', text: 'Schedules and client details shared with your HazirMinds services, where the software allows it.', st: 'scope' }
    ];
    const ST = {
      auto: { label: 'Runs automatically', icon: 'bolt', bg: '#E5F0E8', fg: '#1E6B3E' },
      appr: { label: 'Waits for approval', icon: 'how_to_reg', bg: '#F7ECD6', fg: '#7A4E00' },
      scope: { label: 'Scoped with you', icon: 'tune', bg: '#F5F1EA', fg: '#2F3633' }
    };
    const toggle = k => () => this.setState(st => ({ sel: st.sel.includes(k) ? st.sel.filter(x => x !== k) : [...st.sel, k] }));
    const tools = TOOLS.map(([k, label, icon]) => { const on = s.sel.includes(k); return { label, icon, on, go: toggle(k), bd: on ? '1.5px solid #0F4C45' : '1px solid #8A8F8B', bg: on ? '#E3EDE9' : '#FFFFFF', fw: on ? '600' : '400' }; });
    const conns = C.filter(c => c.need.every(n => s.sel.includes(n))).map((c, i) => {
      const f = NODE[c.from], t = NODE[c.to], st = ST[c.st];
      return { title: c.title, text: c.text, bt: i === 0 ? 'none' : '1px solid #EEE8DE',
        fromLabel: f.label, fromIcon: f.icon, fromBg: f.bg, toLabel: t.label, toIcon: t.icon, toBg: t.bg,
        stLabel: st.label, stIcon: st.icon, stBg: st.bg, stFg: st.fg, appr: c.st === 'appr' };
    });
    const n = conns.length, a = conns.filter(c => c.appr).length;
    const summary = s.sel.length === 0 ? 'Pick the tools you use' : n === 0 ? 'No sample connections for this mix yet'
      : (n === 1 ? '1 sample connection' : n + ' sample connections') + ' · ' + (a === 0 ? 'none wait' : a === 1 ? '1 waits' : a + ' wait') + " for a person's approval";
    return { drafts: !!this.props.showDrafts, faqCols: s.w >= 1000 ? 'minmax(0,1fr) minmax(0,2fr)' : 'minmax(0,1fr)',
      tools, conns, hasConns: n > 0, noConns: n === 0, summary };
  }
}
