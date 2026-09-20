// HazirMinds — /masjids: AI Operating System for Masjids & Islamic Community Organizations
const L = require('../lib');
const { esc, I, nav, footer, chromeEnd, roiBar, site } = L;
const SJ = require('../data/site.json');
const M = SJ.masjid;
const CTX = require('../data/context');

const bc = L.breadcrumbs([['Home', '/'], ['For Masjids', '/masjids']]);

/* Lifecycle diagram — intake → validation → routing → approval → one record → channels → follow-up → audit */
function lifecycle() {
  const steps = [
    { t: 'Intake', d: 'One form: event, dates, rooms, audience, channels' },
    { t: 'AI validation', d: 'Completeness, conflicts, duplicates — uncertain? flagged, never guessed' },
    { t: 'Committee routing', d: 'Communications, Education, Youth, Women\u2019s, Facilities\u2026' },
    { t: 'Approval chain', d: 'Team \u2192 owner \u2192 comms review \u2192 final approval' },
    { t: 'One record', d: 'The approved event record — the single source of truth' },
    { t: 'Many channels', d: 'Site, app, newsletter, WhatsApp, social, screens, registration' },
    { t: 'Follow-up', d: 'Reminders, attendance, thank-yous, archives' },
    { t: 'Audit', d: 'Who · when · what changed · who approved · what published' }
  ];
  return `
  <div class="masjid-lifecycle" data-lifecycle>
    ${steps.map((s, i) => `
    <div class="lc-step" data-lc-step>
      <span class="lc-n">${'0' + (i + 1)}</span>
      <h3 style="font-size:16.5px">${s.t}</h3>
      <p>${s.d}</p>
    </div>${i < steps.length - 1 ? '<span class="lc-arrow" aria-hidden="true">' + I('arrow') + '</span>' : ''}`).join('')}
  </div>
  <p class="stat-note center" style="margin-top:16px">ONE REQUEST → ONE SOURCE OF TRUTH → APPROVAL → AI WORK → MANY CHANNELS → FOLLOW-UP → REPORTING → AUDIT</p>`;
}

/* Channels fan-out visual */
function channels() {
  const ch = ['Website', 'Mobile app', 'Email & newsletter', 'WhatsApp', 'Social media', 'Lobby screens', 'Registration', 'Reminders & attendance'];
  return `
  <div class="masjid-channels">
    <div class="mc-src"><span class="eyebrow">One approved record</span><div class="mc-core">Event / Request Record</div></div>
    <div class="mc-fan" role="list">
      ${ch.map(c => `<span class="pill" role="listitem">${c}</span>`).join('')}
    </div>
  </div>
  <p class="stat-note center" style="margin-top:12px">Volunteers never re-enter data. A change or cancellation cascades to every channel — registrants and teams notified, originals archived.</p>`;
}

const faq = L.faqBlock(M.faqs);

const main = `
  <section class="section masjid-hero on-dark" style="padding-top:96px">
    <div class="container" style="max-width:900px">
      <div data-reveal="children">
        <p class="crumbs" style="color:rgba(250,247,242,.55)"><a href="/" style="color:inherit">Home</a> <span>/</span> <span aria-current="page">For Masjids</span></p>
        <span class="eyebrow">HazirMinds Masjid AI OS</span>
        <h1 style="font-size:clamp(32px,4.6vw,58px);color:var(--cream)">The operating system for masjid work — one record, every channel, governed AI.</h1>
        <p class="lede" style="color:rgba(250,247,242,.75)">${M.positioning}</p>
        <div class="hero-ctas" style="margin-top:28px">
          ${L.btnDemo(CTX.masjids.label, 'masjid_hero', 'btn--brass btn--lg', 'masjids')}
          <a class="btn btn--outline-light btn--lg" href="#masjid-compare" data-cta="masjid_compare">Compare masjid platforms</a>
        </div>
        <div class="chip-row" style="margin-top:24px" data-reveal="children">
          <span class="pill">events &amp; communications</span><span class="pill">registrations &amp; check-in</span><span class="pill">facilities &amp; volunteers</span><span class="pill">donations &amp; CRM</span><span class="pill">governed AI assistants</span><span class="pill">multi-masjid isolation</span>
        </div>
      </div>
    </div>
  </section>

  <section class="section section--paper" style="padding-bottom:0">
    <div class="container">
      <div class="band-media" data-reveal>
        <img src="/img/mj/mj-hall-1600.webp"
             srcset="/img/mj/mj-hall-600.webp 600w, /img/mj/mj-hall-900.webp 900w, /img/mj/mj-hall-1600.webp 1600w, /img/mj/mj-hall-2400.webp 2400w"
             sizes="(max-width: 900px) 100vw, 1200px" width="2400" height="1600"
             loading="eager" fetchpriority="high" decoding="async"
             alt="Architectural detail of a masjid hall in daylight — quiet, ordered, and in use.">
      </div>
      <p class="stat-note center" style="margin-top:12px">A masjid runs on records. Today most of them live on paper, in WhatsApp, and in someone's memory.</p>
    </div>
  </section>

  <section class="section" id="lifecycle" data-pin-story="lifecycle">
    <div class="container">
      <div class="sec-head center" data-reveal="children">
        <span class="eyebrow">The core workflow</span>
        <h2>From one request to every channel — with humans deciding</h2>
        <p class="lede center" style="margin-inline:auto">AI prepares and recommends; authorized people approve every consequential step. Anything uncertain is flagged, never guessed.</p>
      </div>
      <div class="pin-stage">${lifecycle()}</div>
    </div>
  </section>

  <section class="section section--paper" id="channels">
    <div class="container" style="max-width:900px">
      <div class="sec-head center" data-reveal="children">
        <span class="eyebrow">One record → many channels</span>
        <h2>Publish once. Update everywhere. Or nowhere twice.</h2>
        <p class="lede center" style="margin-inline:auto">Your volunteer enters the event <b>once</b>. Every channel reads from that one record — so the same details can never reach the flyer, the website, the newsletter, the app and the hall screens as five different versions.</p>
      </div>
      ${channels()}
    </div>
  </section>

  <section class="section" id="assistants">
    <div class="container">
      <div class="sec-head center" data-reveal="children">
        <span class="eyebrow">AI assistants — governed, source-linked</span>
        <h2>Phone + web assistants, one approved knowledge base</h2>
      </div>
      <div class="grid grid-2" style="align-items:stretch">
        <div class="card card--hover" data-reveal>
          <span class="icon-tile">${I('headset')}</span>
          <h3>AI phone assistant</h3>
          <p class="muted" style="font-size:15px">Answers <em>only</em> from the approved knowledge base: prayer times, Jumu\u2019ah, programs, youth, registration, hall booking, location, events.</p>
          <ul class="checks">
            <li>${I('check')}<span>Answers 24/7 on the masjid\u2019s dedicated number</span></li>
            <li>${I('check')}<span>Says \u201cI\u2019ll check with the office\u201d when unsure — and routes the message</span></li>
            <li>${I('check')}<span>Every answer carries its source receipt</span></li>
            <li>${I('check')}<span>Religious questions route to a named scholar or imam — and the routing is logged</span></li>
          </ul>
        </div>
        <div class="card card--hover" data-reveal>
          <span class="icon-tile icon-tile--brass">${I('chat')}</span>
          <h3>Website assistant</h3>
          <p class="muted" style="font-size:15px">Same governed source: current answers, event finder, registration links, program explanations, routing to the right committee.</p>
          <ul class="checks">
            <li>${I('check')}<span>Never invents; discloses uncertainty honestly</span></li>
            <li>${I('check')}<span>Validates against current records before answering</span></li>
            <li>${I('check')}<span>Escalates outside scope to the right human</span></li>
          </ul>
        </div>
      </div>
      <p class="stat-note center" style="margin-top:20px">The assistants answer questions about your masjid\u2019s operations, programs, facilities and events. They do not issue religious rulings and do not replace imams or scholars — religious questions are routed to a named person, and every routing is recorded.</p>
      <div class="hallucination-panel" data-reveal style="margin-top:24px;background:var(--deep);border-color:rgba(250,247,242,.12)">
        <span class="eyebrow">No-hallucination design</span>
        <h3 style="color:var(--cream);font-size:22px;letter-spacing:-.015em;line-height:1.25;margin:10px 0 18px">Governed, source-linked AI with escalation — our honest claim</h3>
        <div class="chip-row chip-row--dense chip-row--three">
          ${['approved sources only', 'source-linked answers', 'confidence checks', 'uncertainty disclosure', 'refusal outside scope', 'human escalation', 'regression testing', 'audit receipts', 'controlled tool access'].map(x => `<span class="pill">${I('shield')}${x}</span>`).join('')}
        </div>
        <p class="stat-note" style="margin-top:16px;color:rgba(250,247,242,.6)">We say \u201cgoverned, source-linked AI with escalation\u201d — never \u201cnever hallucinates.\u201d Trust starts with honest wording.</p>
      </div>
    </div>
  </section>

  <section class="section section--paper" id="modules">
    <div class="container">
      <div class="sec-head center" data-reveal="children">
        <span class="eyebrow">Modules</span>
        <h2>Registration · Facilities · Volunteers · Donations · CRM</h2>
      </div>
      <div class="grid grid-3" data-reveal="children">
        <div class="card card--hover"><span class="icon-tile">${I('calendar')}</span><h3>Registration</h3><p class="muted" style="font-size:15px">Forms, capacity, waitlists, guardian info, confirmations, reminders, QR check-in, attendance analytics.</p></div>
        <div class="card card--hover"><span class="icon-tile icon-tile--brass">${I('building')}</span><h3>Facilities</h3><p class="muted" style="font-size:15px">Booking request \u2192 availability \u2192 review \u2192 approval \u2192 confirmation \u2192 calendar + communications. Deposits &amp; e-signatures: <b>Planned</b>.</p></div>
        <div class="card card--hover"><span class="icon-tile">${I('users')}</span><h3>Volunteers</h3><p class="muted" style="font-size:15px">Registration, assignments, shifts, reminders, hours, participation history, certificates.</p></div>
        <div class="card card--hover"><span class="icon-tile icon-tile--ok">${I('refresh')}</span><h3>Donations</h3><p class="muted" style="font-size:15px">Campaigns, event-to-donation flows, recurring giving, receipts, reporting — processing stays with Stripe or your processor, fees shown transparently.</p></div>
        <div class="card card--hover"><span class="icon-tile">${I('users')}</span><h3>CRM</h3><p class="muted" style="font-size:15px">Members, families, volunteers, donors, interests, engagement history — strict permission boundaries on sensitive fields.</p></div>
        <div class="card card--hover"><span class="icon-tile icon-tile--brass">${I('chart')}</span><h3>Analytics &amp; admin</h3><p class="muted" style="font-size:15px">Events, communications, registration, facility utilization, volunteer hours, workflow exceptions — with role-based dashboards.</p></div>
      </div>
    </div>
  </section>

  <section class="section" id="integrations">
    <div class="container">
      <div class="sec-head center" data-reveal="children">
        <span class="eyebrow">Connects to what you already run</span>
        <h2>Your systems stay. They just stop disagreeing with each other.</h2>
        <p class="lede center" style="margin-inline:auto">No rip-and-replace. Each integration below carries the same honest label as the rest of this page — including the ones that are not built yet.</p>
      </div>
      <div class="compare-wrap" data-reveal>
        <table class="compare compare--3col">
          <thead><tr><th scope="col">System</th><th scope="col">What it does here</th><th scope="col">Status</th></tr></thead>
          <tbody>
            <tr><td>WordPress</td><td>Publishes event content, then verifies the live page: right image, right date, working registration button, expired announcements removed.</td><td><span class="pill pill--ok">Available</span></td></tr>
            <tr><td>Constant Contact</td><td>Assembles the weekly newsletter from approved announcements — masjid items first, community items after, Gregorian and Hijri dates both updated.</td><td><span class="pill pill--ok">Available</span></td></tr>
            <tr><td>Cognito Forms</td><td>Registration with capacity, waitlist, guardian fields, closing date, confirmations and reminders.</td><td><span class="pill pill--ok">Available</span></td></tr>
            <tr><td>Google Workspace</td><td>Docs, Sheets, Drive and Calendar — the shared record and the committee calendar.</td><td><span class="pill pill--ok">Available</span></td></tr>
            <tr><td>Stripe / your processor</td><td>Donations and facility bookings at your processor's published rates, shown transparently. Funds stay yours.</td><td><span class="pill pill--ok">Available</span></td></tr>
            <tr><td>CRM platforms</td><td>HubSpot, Salesforce, Pipedrive-class systems — members, families, donors and enquiry history stay in sync.</td><td><span class="pill pill--ok">Available</span></td></tr>
            <tr><td>Madina Apps · hall screens · app slideshow</td><td>Approved screen graphics uploaded, dated, ordered, and expired on schedule.</td><td><span class="pill pill--brass">Available</span></td></tr>
            <tr><td>Canva</td><td>An approved template library your team fills from the event record — one visual identity, no re-designing from scratch.</td><td><span class="pill">Configured at onboarding</span></td></tr>
            <tr><td>WhatsApp Business API</td><td>Team submission and notification, so information stops being copied out of a group chat by hand. Per-conversation fees are set by Meta.</td><td><span class="pill">Configured at onboarding</span></td></tr>
            <tr><td>Branded mobile app</td><td>Your own app receiving selected high-priority announcements.</td><td><span class="pill">Custom / scoped</span></td></tr>
            <tr><td>Facility deposits, payments &amp; e-signatures</td><td>Not built yet. Named here so nobody has to guess.</td><td><span class="pill">Planned</span></td></tr>
          </tbody>
        </table>
      </div>
      <p class="stat-note" style="margin-top:12px">Integrations are designed to be replaceable — if your masjid changes a system, the platform is reconfigured rather than rebuilt.</p>
    </div>
  </section>

  <section class="section section--paper" id="status">
    <div class="container" style="max-width:960px">
      <div class="sec-head center" data-reveal="children">
        <span class="eyebrow">Event lifecycle</span>
        <h2>Everyone can see where an event stands</h2>
        <p class="lede center" style="margin-inline:auto">Thirteen defined states. Nobody has to ask “where is this one?” in a group chat.</p>
      </div>
      <div class="chip-row chip-row--dense" style="justify-content:center" data-reveal="children">
        ${['Draft', 'Submitted', 'Validation', 'Team approval', 'Communications review', 'Content created', 'Flyer ready', 'Approved', 'Published', 'Registration open', 'Event upcoming', 'Event completed', 'Archived'].map(s => `<span class="pill">${s}</span>`).join('')}
      </div>
      <p class="stat-note center" style="margin-top:20px">Requests route to the owning committee — communications, education, facility, imam, women’s, youth or volunteer — and each owner’s approval is recorded before anything is prepared for publishing.</p>
    </div>
  </section>

  <section class="section" id="roles">
    <div class="container">
      <div class="sec-head center" data-reveal="children">
        <span class="eyebrow">Who may do what</span>
        <h2>Everyone sees the record. Not everyone can change it.</h2>
        <p class="lede center" style="margin-inline:auto">Role-based permissions decide what each person can approve, edit or only view. Sensitive fields — donor and family information — sit behind their own boundary.</p>
      </div>
      <div class="compare-wrap" data-reveal>
        <table class="compare compare--2col">
          <thead><tr><th scope="col">Role</th><th scope="col">Authority</th></tr></thead>
          <tbody>
            <tr><td>System administrator</td><td>Full configuration: users, committees, templates, integrations, notification rules, audit review.</td></tr>
            <tr><td>Communications admin</td><td>Owns the publishing workflow — newsletter, website, screens, app channels.</td></tr>
            <tr><td>Committee lead</td><td>Creates and approves that committee’s events and announcements.</td></tr>
            <tr><td>Event coordinator</td><td>Manages the events assigned to them, within the approved scope.</td></tr>
            <tr><td>Facility manager</td><td>Reviews availability and approves or declines hall and facility requests.</td></tr>
            <tr><td>Volunteer</td><td>Performs assigned communication tasks. Cannot publish or approve.</td></tr>
            <tr><td>Reviewer / approver</td><td>Reviews content before it goes out, and signs it off.</td></tr>
            <tr><td>Read-only</td><td>Can see everything they are permitted to see, and change nothing.</td></tr>
          </tbody>
        </table>
      </div>
      <div class="card card--panel" data-reveal style="margin-top:24px">
        <span class="eyebrow">What the audit trail actually records</span>
        <p class="muted" style="margin-top:12px;font-size:15px">Not a summary line. Every consequential action stores <b>who</b> acted, <b>when</b>, <b>what action</b>, the <b>previous value</b>, the <b>new value</b>, and the <b>approval history</b> behind it. So when a date changes, you can see who changed it, from what, to what, and who signed it off.</p>
        <p class="stat-note" style="margin-top:12px">Example chain: a coordinator submits an event → the youth lead approves → communications edits the flyer copy → the communications admin approves → the website publishes → the newsletter sends. Every step carries a name and a timestamp.</p>
      </div>
    </div>
  </section>

  <section class="section gov-band on-dark" id="governance-masjid">
    <div class="container">
      <div class="sec-head center" data-reveal="children">
        <span class="eyebrow">Governance · security · multi-masjid</span>
        <h2 style="color:var(--cream)">AI capability does not automatically mean AI authority</h2>
        <p class="lede center" style="margin-inline:auto;color:rgba(250,247,242,.72)">Nine admin roles, approval gates on every consequential step, and an isolated environment per organization — enforced by the platform, not promised in a policy document.</p>
      </div>

      <div class="masjid-secure" data-reveal>
        <div class="ms-head">
          <span class="ms-badge">${I('shield')}</span>
          <div>
            <h3>Security posture, published as controls</h3>
            <p>Here is what is actually enforced and auditable on every masjid deployment. We list controls we can demonstrate — we never claim &ldquo;end-to-end encryption&rdquo; or &ldquo;zero risk,&rdquo; because those are slogans, not controls.</p>
          </div>
        </div>
        <div class="ms-pillars">
          <div class="ms-pillar">
            <span class="ms-ico">${I('shield')}</span>
            <b>Tenant isolation</b>
            <span>An isolated environment per organization. One mosque can never reach another&rsquo;s records, registrations or assistants.</span>
          </div>
          <div class="ms-pillar">
            <span class="ms-ico">${I('users')}</span>
            <b>Least privilege + MFA</b>
            <span>Role-scoped access across nine admin roles — System Admin to Read Only — with MFA and encryption in transit and at rest.</span>
          </div>
          <div class="ms-pillar">
            <span class="ms-ico">${I('refresh')}</span>
            <b>Audit trail &amp; recovery</b>
            <span>Who changed what, when, and who approved it. Backups, recovery, incident response and access reviews on a schedule.</span>
          </div>
          <div class="ms-pillar">
            <span class="ms-ico">${I('check')}</span>
            <b>Controlled AI tools</b>
            <span>Assistant actions are permission-scoped. Nothing leaves the approved tool list without a human in the loop.</span>
          </div>
        </div>
      </div>

      <div class="grid grid-2" style="align-items:stretch;margin-top:24px">
        <div class="card card--panel" data-reveal>
          <span class="eyebrow">Built-in governance</span>
          <div class="chip-row chip-row--dense" style="margin-top:16px">
            ${['permission scopes', 'role-based access', 'approval gates', 'audit trail', 'source-linked info', 'confidence levels', 'human escalation', 'org policies', 'action logging', 'data boundaries'].map(c => `<span class="pill">${I('shield')}${c}</span>`).join('')}
          </div>
          <p class="muted" style="margin-top:16px;font-size:15px">Nine admin roles — from System Admin to Read Only — and a full admin dashboard: users, committees, templates, knowledge, AI policies, workflows, audit logs, settings.</p>
        </div>
        <div class="card card--panel" data-reveal>
          <span class="eyebrow">Security &amp; isolation</span>
          <ul class="checks" style="margin-top:16px">
            <li>${I('check')}<span>Isolated environment per organization — one mosque can never access another\u2019s data</span></li>
            <li>${I('check')}<span>Least-privilege access, MFA, encryption in transit and at rest</span></li>
            <li>${I('check')}<span>Audit logs, backups + recovery, incident response, access reviews</span></li>
            <li>${I('check')}<span>Restricted AI tool permissions; controlled external actions only</span></li>
          </ul>
          <p class="stat-note" style="margin-top:12px">We publish measurable controls — we never claim \u201cend-to-end encryption\u201d or \u201czero risk.\u201d</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section section--paper" id="labels">
    <div class="container">
      <div class="sec-head center" data-reveal="children">
        <span class="eyebrow">Capability labels</span>
        <h2>Every capability labeled — never overclaimed</h2>
      </div>
      <div class="compare-wrap" data-reveal>
        <table class="compare compare--2col">
          <thead><tr><th scope="col">Capability</th><th scope="col">Label</th></tr></thead>
          <tbody>
            <tr><td>Core events, communications, registrations, facilities, volunteers, CRM, AI assistants, governance</td><td><span class="pill pill--ok">Contract-supported</span></td></tr>
            <tr><td>Prayer-time publishing, screens, app channels, reporting packs</td><td><span class="pill pill--brass">Available</span></td></tr>
            <tr><td>Branding, terminology, Hijri rules, flyer templates, approval chains</td><td><span class="pill">Configured at onboarding</span></td></tr>
            <tr><td>Branded mobile app, custom integrations, custom agent builds</td><td><span class="pill">Custom / scoped per engagement</span></td></tr>
            <tr><td>Deposits &amp; payments for facility bookings, e-signatures, conflict auto-detection</td><td><span class="pill">Planned</span></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <section class="section" id="cost">
    <div class="container">
      <div class="sec-head center" data-reveal="children">
        <span class="eyebrow">Commercial structure</span>
        <h2>One integrated service, one payment — external costs published</h2>
      </div>
      <div class="grid grid-2" style="align-items:stretch">
        <div class="card card--panel" data-reveal>
          <span class="eyebrow">Included HazirMinds capabilities</span>
          <ul class="checks" style="margin-top:12px">
            <li>${I('check')}<span>The full operating layer: lifecycle, approvals, channels, registration, facilities, volunteers, CRM, analytics</span></li>
            <li>${I('check')}<span>Governed AI assistants on your approved knowledge base</span></li>
            <li>${I('check')}<span>Templates, communication standards, onboarding, training, support</span></li>
            <li>${I('check')}<span>Required infrastructure and integrations covered by the engagement</span></li>
          </ul>
        </div>
        <div class="card card--panel" data-reveal>
          <span class="eyebrow">Third-party accounts &amp; usage that remain external</span>
          <ul class="checks" style="margin-top:12px">
            ${M.external.map(x => `<li>${I('info')}<span>${x}</span></li>`).join('')}
          </ul>
          <p class="stat-note" style="margin-top:12px">We never claim third-party software is free or owned by HazirMinds.</p>
        </div>
      </div>
      <div class="honesty-note" data-reveal style="margin-top:28px">
        <h3 style="font-size:17px">The fragmented stack it replaces</h3>
        <p>Typical patchwork: ${M.stack.parts.join(', ')} — <em>${M.stack.stamp}</em>. Consolidated: one governed service with a clear included-vs-external split.</p>
      </div>
    </div>
  </section>

  <section class="section section--paper" id="collateral">
    <div class="container">
      <div class="sec-head center" data-reveal="children">
        <span class="eyebrow">Sales collateral</span>
        <h2>Committee-ready materials — released with your demo</h2>
        <p class="lede center" style="margin-inline:auto">Board papers, budget approvals and volunteer briefings need documents, not marketing pages. Book a demo and we send the full set to your committee.</p>
      </div>
      <div class="grid grid-3" data-reveal="children">
        ${[['Masjid AI OS deck', 'The full platform walkthrough for board and committee review'], ['Leave-behind one-pager', 'A single page your board can read between salah and meetings'], ['Implementation playbook', 'Onboarding steps, roles, timelines and acceptance criteria'], ['ROI framework', 'How to model your masjid\u2019s leak, savings and volunteer hours saved'], ['Lifecycle walkthrough (video)', 'One request in — every channel out, with approvals and receipts'], ['Governance & privacy brief', 'Tenant isolation, permissions, audit trail and data ownership']].map(c => `<div class="card card--hover"><span class="icon-tile icon-tile--brass">${I('package')}</span><h3>${c[0]}</h3><p class="muted" style="font-size:15px">${c[1]}</p><div style="margin-top:12px">${L.btnDemo('Request with demo', 'masjid_collateral', 'btn--ghost btn--sm', 'masjids')}</div></div>`).join('')}
      </div>
      <p class="stat-note center" style="margin-top:12px">Released through the demo form — so we can tailor the walkthrough to your committee\u2019s priorities.</p>
    </div>
  </section>

  <section class="section" id="board-pack">
    <div class="container">
      <div class="sec-head center" data-reveal="children">
        <span class="eyebrow">Governance you can hand to the board</span>
        <h2>A governance pack for the committee, every period</h2>
        <p class="lede center" style="margin-inline:auto">Not a dashboard screenshot. A plain document the board can read, question and keep — covering what the AI was asked, what it answered, what it escalated, and who approved what.</p>
      </div>
      <div class="grid grid-2" style="align-items:stretch">
        <div class="card card--hover" data-reveal>
          <span class="icon-tile icon-tile--brass">${I('chart')}</span>
          <h3>What it contains</h3>
          <ul class="checks">
            <li>${I('check')}<span>Volume handled: calls answered, questions resolved, escalations raised</span></li>
            <li>${I('check')}<span>Every answer sourced — what the agent relied on to say it</span></li>
            <li>${I('check')}<span>Escalations and who they went to, with timestamps</span></li>
            <li>${I('check')}<span>Approvals: who signed off what, and when</span></li>
            <li>${I('check')}<span>Corrections: what was wrong, and what changed as a result</span></li>
          </ul>
        </div>
        <div class="card card--hover" data-reveal>
          <span class="icon-tile">${I('shield')}</span>
          <h3>Why it matters</h3>
          <p class="muted" style="font-size:15px">A volunteer-run masjid handles donations, minors’ registrations and religious questions. When a trustee asks “how do we know this is being handled properly?”, the answer should be a document — not a reassurance.</p>
          <p class="muted" style="font-size:15px;margin-top:12px">The pack is exportable, so it can go to the board, to an auditor, or to your insurer without anyone rebuilding it by hand.</p>
        </div>
      </div>
      <p class="stat-note" style="margin-top:20px">Forward-looking note: Colorado’s conversational-AI law (HB 26-1263) takes effect <b>1 January 2027</b> and places disclosure, crisis-referral and reporting duties on operators of publicly accessible conversational AI. We build the disclosure, escalation and record-keeping to that standard now, so a masjid in any state is not caught out by the next state to legislate.</p>
    </div>
  </section>

  <section class="section section--paper" id="phases">
    <div class="container">
      <div class="sec-head center" data-reveal="children">
        <span class="eyebrow">How it lands</span>
        <h2>Six phases — in the order that de-risks the masjid</h2>
        <p class="lede center" style="margin-inline:auto">Nobody is asked to change everything at once. Each phase stands on its own, and the next one only starts when the last is actually working.</p>
      </div>
      <div class="grid grid-2">
        ${[
          ['Phase 1 — Foundation', 'The central event record, request intake, committees, approval workflow, user roles, communication standards, approved knowledge base.'],
          ['Phase 2 — Communications', 'Content generation, approved templates, flyer preparation, website publishing, weekly newsletter assembly, stable event URLs, notification engine.'],
          ['Phase 3 — Registration & operations', 'Registration forms with capacity and waitlists, reminders, attendance, hall and facility requests, calendar integration.'],
          ['Phase 4 — Publishing automation', 'App and hall-screen channels, automated expiry of old announcements, cross-channel publishing from the single record.'],
          ['Phase 5 — Community assistants', 'Website assistant and AI phone assistant sharing one approved knowledge base — event discovery, registration help, facility questions, general Q&A.'],
          ['Phase 6 — Intelligence', 'Analytics dashboards, volunteer hours and participation, automated reporting, workflow optimisation, AI recommendations.']
        ].map(p => `<div class="card card--hover" data-reveal><h3 style="font-size:17px">${p[0]}</h3><p class="muted" style="font-size:15px">${p[1]}</p></div>`).join('')}
      </div>
    </div>
  </section>

  <section class="section" id="faq-masjid">
    <div class="container" style="max-width:860px">
      <div class="sec-head center" data-reveal="children">
        <span class="eyebrow">Straight answers</span>
        <h2>Masjid AI OS questions</h2>
      </div>
      <div class="faq" data-reveal="children">${faq.html}</div>
    </div>
  </section>

  <section class="section section--paper" id="masjid-compare">
    <div class="container">
      <div class="sec-head" data-reveal="children">
        <span class="eyebrow eyebrow--rust">Verified 2026 comparison</span> <span class="pill pill--brass" style="font-size:11px;vertical-align:middle;margin-left:8px">✓ Source-checked Sept 2026</span>
        <h2 style="margin-top:8px">HazirMinds Masjid AI OS vs masjid platforms</h2>
        <p class="lede" style="max-width:78ch">The established masjid platforms solve communications, donations and apps. None of them offer governed AI, one-record→many-channels lifecycle with approval gates, audit receipts or isolated multi-masjid tenancy. That is the layer we run. Re-verify any vendor price at publish time — rows marked are directory-sourced.</p>
      </div>
      <div class="compare-wrap" data-reveal style="margin-top:32px">
        <table class="compare compare-table">
          <thead><tr><th scope="col">Platform</th><th scope="col">Entry price</th><th scope="col">Model</th><th scope="col">Governed AI</th></tr></thead>
          <tbody data-row-reveal>
            ${M.competitors.map(c => `<tr><td><b>${c.name}</b>${c.flag ? ` <span class="stat-note" style="display:inline">(${c.flag})</span>` : ''}</td><td>${c.entry}</td><td>${c.model}</td><td>${c.ai}</td></tr>`).join('')}
          </tbody>
        </table>
      </div>
      <p class="src-note" style="margin-top:8px">Sources: ${[...new Set(M.competitors.map(c => c.source))].join(' · ')}. Source-checked Sept 2026. Vendor prices change — verify before deciding.</p>

      <div style="margin-top:52px" data-reveal="children">
        <span class="eyebrow">What no reviewed platform offers together</span>
        <h3 style="font-size:clamp(22px,2.4vw,30px);margin-top:8px">The gap list</h3>
        <div class="grid grid-2" style="margin-top:20px">
          ${M.gaps.map(g => `<div class="card"><span class="icon-tile icon-tile--ok">${I('check')}</span><p style="font-size:15px;margin:0">${g}</p></div>`).join('')}
        </div>
      </div>

      <div class="honesty-note" data-reveal style="margin-top:44px">
        <h3>Who should NOT buy HazirMinds</h3>
        <p>If your masjid needs a display-only website and app with prayer times and announcements — and budget is the deciding factor — Masjidal/CMZ-style free or low-cost tiers are honest choices. For campaign crowdfunding reach, LaunchGood does that one job well. If you want to own the code of a custom-branded app outright, a build shop like Buildify is the right lane. HazirMinds is for organizations that want the <em>operating layer</em>: governed AI, one record to every channel, approvals, receipts — priced and acceptance-tested per engagement.</p>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="final-cta" data-reveal>
        <div class="inner" style="max-width:660px">
          <span class="serif-accent">Always present. Never missed.</span>
          <h2>Book a Masjid Demo</h2>
          <p style="color:rgba(250,247,242,.75)">See the lifecycle live: one request in, every channel out, approvals and receipts throughout. Scoped, priced and acceptance-tested with your committee.</p>
          <div class="hero-ctas" style="justify-content:center">${L.btnDemoPlain(CTX.masjids.label, 'masjid_final', 'btn--brass btn--lg', 'masjids')}</div>
        </div>
      </div>
    </div>
  </section>`;

const html = `<!doctype html>
<html lang="en">
${L.head({
  title: 'Masjid AI OS — AI Operating System for Masjids & Islamic Centers',
  path: '/masjids',
  desc: 'HazirMinds Masjid AI OS: events, communications, registrations, facilities, volunteers, donations, knowledge and governed AI — one controlled operational layer for masjids and Islamic community organizations.',
  ld: [L.orgLd(), bc.ld, faq.ld],
  themeAccent: M.accent
})}
<body>
<a class="skip-link" href="#main">Skip to content</a>
${roiBar()}
${nav()}
<main id="main">
${main}
</main>
${footer()}
${chromeEnd()}`;

module.exports = { html };
