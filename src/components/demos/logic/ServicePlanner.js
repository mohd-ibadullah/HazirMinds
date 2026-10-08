// @ts-nocheck
// Ported from the approved design file "Services".
import { DCLogic, React } from '../../../lib/dc-runtime.js';

export default class Component extends DCLogic {
  state = { sel: [] };
  renderVals() {
    const P = this.props, s = this.state;
    const SV = {
      rec: { name: 'AI Receptionist', icon: 'call', solve: 'Missed calls or slow replies', usage: true },
      web: { name: 'AI-Powered Website', icon: 'language', solve: 'Website not bringing in leads', usage: true },
      com: { name: 'Automated Communications', icon: 'forward_to_inbox', solve: 'Leads going cold', usage: true },
      pipe: { name: 'Client Pipeline & Dashboard', icon: 'view_kanban', solve: 'Too much manual busywork' },
      cweb: { name: 'Custom Websites & Mobile Apps', icon: 'devices', solve: 'Website not bringing in leads', custom: true },
      cint: { name: 'Custom Integrations & Software', icon: 'hub', solve: 'Connecting our systems or custom software', custom: true }
    };
    const PAL = [["#D5EDE3","#0F6B57"],["#DBE8F7","#2B5C8F"],["#FBE0D6","#A23E1E"],["#F8EACB","#8A5A00"],["#E6E0F5","#5B3E9A"]], CK = { rec: 0, web: 1, com: 2, pipe: 3, cweb: 1, cint: 4, call: 0, language: 1, forward_to_inbox: 2, view_kanban: 3 };
    Object.keys(SV).forEach(k => { SV[k].tBg = PAL[CK[k]][0]; SV[k].tFg = PAL[CK[k]][1]; });
    const toggle = k => () => this.setState(st => ({ sel: st.sel.includes(k) ? st.sel.filter(x => x !== k) : [...st.sel, k] }));
    const opt = k => {
      const on = s.sel.includes(k);
      return { key: k, name: SV[k].name, icon: SV[k].icon, sel: on, go: toggle(k),
        bd: on ? '1.5px solid #0F4C45' : '1px solid #DED5C6', bg: on ? '#FFFFFF' : 'rgba(255,255,255,.55)',
        box: on ? 'check_box' : 'check_box_outline_blank', boxFg: on ? '#0F4C45' : '#585E5A' };
    };
    const picks = s.sel.map(k => SV[k]);
    const anyAi = picks.some(p => !p.custom), anyCustom = picks.some(p => p.custom), anyUsage = picks.some(p => p.usage);
    const terms = [{ icon: 'event_repeat', label: 'Month-to-month', text: 'No long lock-in. A 30-day written notice is all it takes to stop.' }];
    if (anyAi) terms.push({ icon: 'money_off', label: 'No setup fee for standard services', text: 'A setup fee applies only when customization is required.' });
    if (anyCustom) terms.push({ icon: 'tune', label: 'Custom work is quoted as a fixed price', text: 'After assessment and requirements gathering, before anything is built.' });
    if (anyUsage) terms.push({ icon: 'receipt_long', label: 'Usage billed at actual provider cost', text: 'Voice minutes, text and WhatsApp messages, and AI processing, with no markup.' });
    if (anyAi) terms.push({ icon: 'web', label: 'Free static website', text: 'Included when you subscribe to at least one AI service. Terms apply.' });
    terms.push({ icon: 'database', label: 'Your data stays yours', text: 'You own your data and can export it if you leave.' });
    const solve = [...new Set(picks.map(p => p.solve))];
    const n = s.sel.length;
    return {
      drafts: !!P.showDrafts,
      cards: [
        { id: 'svc-rec', icon: 'call', kicker: 'Front door · calls', name: 'AI Receptionist', pitch: 'Every call answered, every caller helped — even at 2 a.m.', desc: 'Answers inbound calls on a dedicated business number, handles inquiries, and delivers messages with transcript and callback details. Call activity is visible in the admin dashboard.', href: '/ai-receptionist', link: 'Explore AI Receptionist →' },
        { id: 'svc-web', icon: 'language', kicker: 'Front door · visitors', name: 'AI-Powered Website', pitch: 'Most agencies build you a website. We build you a system that works for your business every day.', desc: 'A website connected to your business, with built-in AI chat and voice that capture and qualify visitors.', href: '/ai-powered-website', link: 'Explore AI-Powered Website →' },
        { id: 'svc-com', icon: 'forward_to_inbox', kicker: 'Follow-up', name: 'Automated Communications', pitch: "Follow-up that never forgets, so leads don't go cold.", desc: 'Confirmations, follow-ups, reminders and notifications that run automatically through workflows you approve.', href: '/automated-communications', link: 'Explore Automated Communications →' },
        { id: 'svc-pipe', icon: 'view_kanban', kicker: 'One view', name: 'Client Pipeline & Dashboard', pitch: 'See every lead, call and deal in one place.', desc: 'A CRM pipeline and one dashboard to track leads, client activity, deals and call history.', href: '/client-pipeline-dashboard', link: 'Explore Pipeline & Dashboard →' }
      ].map(c => ({ ...c, tBg: PAL[CK[c.icon]][0], tFg: PAL[CK[c.icon]][1] })),
      aiOpts: ['rec', 'web', 'com', 'pipe'].map(opt),
      _c: 0,
      cwOpts: ['cweb', 'cint'].map(opt),
      picks, terms, empty: n === 0, hasPicks: n > 0, startSmall: n >= 3,
      countLabel: n === 0 ? 'Nothing picked' : n === 1 ? '1 service' : n + ' services',
      bookHref: '/book-a-discovery-call' + (solve.length ? '?solve=' + encodeURIComponent(solve.join('|')) : ''),
      clear: () => this.setState({ sel: [] })
    };
  }
}
