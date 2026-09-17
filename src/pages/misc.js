// HazirMinds — misc pages: case-studies, about, resources, demo, privacy, terms, 404
const L = require('../lib');
const { esc, I, nav, footer, chromeEnd, roiBar, site, TEL, CALL_LABEL, CALL_TEXT, CALL_ICON } = L;
const pricing = require('../data/pricing');
const JS = require('../data/site.json');

function shell(o) {
  return `<!doctype html>
<html lang="en">
${L.head(o)}
<body>
<a class="skip-link" href="#main">Skip to content</a>
${roiBar()}
${nav()}
<main id="main">
${o.main}
</main>
${footer()}
${chromeEnd()}`;
}

/* ---------------- case studies ---------------- */
function caseStudies() {
  const bc = L.breadcrumbs([['Home', '/'], ['Case Studies', '/case-studies']]);
  const main = `
  <section class="hero-sub-plain section--paper" style="padding-bottom:0">
    <div class="container">
      ${bc.html}
      <h1 style="max-width:20ch">What "out-earning the fee" looks like</h1>
      <p class="lede" style="margin-top:18px;max-width:62ch">Three representative HazirMinds deployments — composite personas drawn from real rollout patterns, with the numbers owners care about. We label them honestly: results are illustrative.</p>
    </div>
  </section>
  <section class="section">
    <div class="container">
      <h2 class="sr-only" style="position:absolute;left:-9999px">Representative deployments</h2>
      <div class="grid grid-3" data-reveal="children">
        ${site.personas.map(p => `
        <article class="card card--hover" style="display:flex;flex-direction:column;gap:16px">
          <div class="cs-mark" aria-hidden="true"><span>${p.mark}</span></div>
          <span class="cs-caption">Representative result — composite persona, not a client</span>
          <div>
            <h3>${p.name}</h3>
            <p class="num" style="margin-top:4px">${p.trade}</p>
          </div>
          <p class="serif-accent" style="font-size:17px">"${p.quote}"</p>
          <div class="cs-metrics">
            ${p.metrics.map(m => `<div class="m"><b>${m[0]}</b><span>${m[1]}</span></div>`).join('')}
          </div>
          <div class="pill pill--brass" style="align-self:flex-start;font-size:11.5px;white-space:normal">PROOF HORIZON: ${p.horizon}</div>
          <p class="muted" style="font-size:13.5px">${p.scenario}</p>
        </article>`).join('')}
      </div>
    </div>
  </section>
  <section class="section">
    <div class="container">
      <div class="sec-head" data-reveal="children">
        <span class="eyebrow">Deployment detail</span>
        <h2>Scenario → controls → outcome</h2>
        <p class="lede">Every representative deployment below shows the same three things: what the business was dealing with, which controls we put around the AI, and what changed. The controls are the platform's, not per-client inventions — they apply to every deployment we run.</p>
      </div>
      ${site.personas.map(p => `
      <article class="card" style="margin-top:22px" data-reveal>
        <div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between">
          <h3>${p.name} — ${p.trade}</h3>
          <span class="pill pill--brass" style="font-size:11px;white-space:normal;max-width:100%">PROOF HORIZON: ${p.horizon}</span>
        </div>
        <div class="grid grid-2" style="margin-top:18px;gap:32px;align-items:start">
          <div>
            <span class="eyebrow">Scenario</span>
            <p class="muted" style="margin-top:10px">${p.scenario}</p>
          </div>
          <div>
            <span class="eyebrow">Controls applied</span>
            <ul class="steps-plain" style="margin-top:12px">
              <li><b>Least-privilege permissions.</b> The agent may answer, book and log inside the scope you approved. It may not quote above your threshold, promise anything outside your written policy, or contact anyone you didn't authorise.</li>
              <li><b>Approval gate before go-live.</b> Nothing answered a real customer until you signed the boundaries — what it may say, book, quote and escalate.</li>
              <li><b>Escalation path.</b> Anything outside scope — or any caller who asks for a person — is handed to a human with the call context attached.</li>
              <li><b>Receipts.</b> Every action taken on every call is logged and readable after the fact, not reconstructed from memory.</li>
            </ul>
          </div>
        </div>
        <p class="cs-caption" style="margin-top:18px">Representative result — composite persona, not a client</p>
      </article>`).join('')}
    </div>
  </section>
  <section class="section section--paper">
    <div class="container">
      <div class="sec-head center" data-reveal="children">
        <span class="eyebrow">The framework</span>
        <h2>Why these numbers repeat</h2>
      </div>
      <div class="grid grid-4" data-reveal="children">
        <div class="card"><span class="num">01</span><h3 style="font-size:18px;margin-top:8px">Zero missed calls</h3><p class="muted" style="font-size:14px">The baseline win: every call answered in under a second, forever.</p></div>
        <div class="card"><span class="num">02</span><h3 style="font-size:18px;margin-top:8px">Instant booking</h3><p class="muted" style="font-size:14px">Answered calls convert because the AI books on the call, not "someone will call back."</p></div>
        <div class="card"><span class="num">03</span><h3 style="font-size:18px;margin-top:8px">Follow-up that fires</h3><p class="muted" style="font-size:14px">No-shows, quotes and stale leads get chased automatically until they resolve.</p></div>
        <div class="card"><span class="num">04</span><h3 style="font-size:18px;margin-top:8px">Compounding tuning</h3><p class="muted" style="font-size:14px">Weekly script improvements from real transcripts lift conversion month over month.</p></div>
      </div>
      <div class="final-cta" data-reveal style="margin-top:56px">
        <div class="inner" style="max-width:640px">
          <span class="serif-accent">${site.tagline}</span>
          <h2>Your business could be the next case study</h2>
          <div class="hero-ctas">${L.btnDemoPlain('Book a Free Demo', 'cs_final', 'btn--primary btn--lg')}</div>
        </div>
      </div>
    </div>
  </section>`;
  return shell({
    title: 'Case Studies — Representative Results',
    path: '/case-studies',
    desc: 'Three representative HazirMinds deployments: home services, dental and legal. Honest labels, illustrative metrics, one repeatable framework.',
    ld: [L.orgLd(), bc.ld],
    main
  });
}

/* ---------------- about ---------------- */
function about() {
  const bc = L.breadcrumbs([['Home', '/'], ['About', '/about']]);
  const main = `
  <section class="hero-sub-plain section--paper" style="padding-bottom:0">
    <div class="container">
      ${bc.html}
      <h1 style="max-width:18ch">We build the AI team we run for you.</h1>
      <p class="lede" style="margin-top:18px;max-width:60ch">HazirMinds is a technology company. Our agents, our configuration, our governance — operated by us, on infrastructure we run for you. When you call, you reach HazirMinds, not a middleman.</p>
    </div>
  </section>
  <section class="section" style="padding-bottom:0">
    <div class="container">
      <div class="band-media" data-reveal>
        <img src="/img/ab/ab-team-1200.webp"
             srcset="/img/ab/ab-team-600.webp 600w, /img/ab/ab-team-900.webp 900w, /img/ab/ab-team-1200.webp 1200w, /img/ab/ab-team-1600.webp 1600w"
             sizes="(max-width: 900px) 100vw, 1200px" width="1600" height="1200"
             loading="lazy" decoding="async"
             alt="People working through a problem together — the work behind the platform.">
      </div>
      <p class="stat-note center" style="margin-top:12px">A technology company is a group of people making decisions. Ours leaves records too.</p>
    </div>
  </section>
  <section class="section">
    <div class="container grid grid-2" style="align-items:start;overflow:clip">
      <div data-reveal="children">
        <span class="eyebrow">Why “HazirMinds”</span>
        <h2 style="font-size:clamp(26px,3vw,40px)">Always hazir</h2>
        <p class="muted" style="margin-top:16px"><em>Hazir</em> — Urdu and Arabic — means present, ready, attentive. It's the word a household uses for the person you can count on: the one who is <em>there</em> when it matters. HazirMinds builds AI teams that are always hazir — present on every call, every lead, every decision — while your people keep the authority.</p>
        <p class="muted">Our proof standard follows from the name: every claim on this site is labeled with its evidence horizon — Built → Deployed → Operated → Verified outcome → Accepted by client. We never promote a lower horizon into a stronger claim. That's what “always present” means when applied to ourselves.</p>
        <div class="chips" style="margin-top:20px">
          <span class="pill pill--brass">Founded 2024</span>
          <span class="pill">United States</span>
          <span class="pill">Isolated per-client environments</span>
          <span class="pill">Public honesty standard</span>
        </div>
      </div>
      <div class="card card--panel" data-reveal>
        <span class="eyebrow">How we operate</span>
        <div class="kv"><span>Platform, infrastructure &amp; agents</span><b class="tag-ok">Operated by us</b></div>
        <div class="kv"><span>Agents trained on your business</span><b>Every deployment</b></div>
        <div class="kv"><span>Weekly tuning from real transcripts</span><b>Included</b></div>
        <div class="kv"><span>Go-live window</span><b>7–14 days</b></div>
        <div class="kv"><span>Contracts after day 60</span><b>Month-to-month</b></div>
        <div class="kv"><span>Measurement</span><b class="tag-ok">Acceptance criteria you sign</b></div>
        <div style="margin-top:22px">${L.btnDemo('Meet the team behind the AI', 'about_demo', 'btn--primary')}</div>
      </div>
    </div>
  </section>
  <section class="section section--paper" style="padding-top:0">
    <div class="container">
      <div class="sec-head" data-reveal="children">
        <span class="eyebrow">Our doctrine — the part that never changes</span>
        <h2>Four invariants we will not trade away</h2>
        <p class="lede">Every deployment inherits these constraints. They are enforced by the platform, not promised in a policy document.</p>
      </div>
      <div class="grid grid-2" data-reveal="children" style="margin-top:30px">
        <div class="card">
          <span class="eyebrow">01 · Capability ≠ Authority</span>
          <p style="margin-top:10px">Just because an agent <em>can</em> do something does not mean it <em>may</em>. Every agent carries the narrowest permissions that let it do its job — what it may touch, spend, say or send is written down before it answers a single call.</p>
        </div>
        <div class="card">
          <span class="eyebrow">02 · Execution ≠ Liability</span>
          <p style="margin-top:10px">Your business stays accountable for its own promises. Our AI carries work only inside a scope you approved, and that boundary is enforced and auditable — not described in a brochure.</p>
        </div>
        <div class="card">
          <span class="eyebrow">03 · Deployment ≠ Adoption</span>
          <p style="margin-top:10px">Going live proves nothing by itself. We measure the outcome against the acceptance criteria you signed at kickoff — and report against them in writing.</p>
        </div>
        <div class="card">
          <span class="eyebrow">04 · Continuity ≠ Persona</span>
          <p style="margin-top:10px">Your memory, your rules and your evidence outlive any model or vendor change. Components underneath can be swapped without your business losing its history.</p>
        </div>
      </div>
    </div>
  </section>
  <section class="section">
    <div class="container grid grid-2" style="align-items:start;gap:48px">
      <div data-reveal="children">
        <span class="eyebrow">How we work</span>
        <h2 style="font-size:clamp(24px,2.6vw,34px)">Five steps between first call and first answered call</h2>
        <ol class="steps-plain">
          <li><b>Scoping.</b> We map where calls and leads are leaking, and — more importantly — how much authority your team is actually willing to delegate. No authority, no deployment.</li>
          <li><b>Build.</b> Agents are trained on your services, pricing, hours, exceptions and tone of voice. Nothing ships on defaults and nothing ships on our assumptions about your business.</li>
          <li><b>Approval gates.</b> You approve the boundaries before the first customer is ever answered — what the AI may say, book, quote and escalate.</li>
          <li><b>Operate.</b> Weekly tuning from real transcripts. Every action the AI took is logged with a receipt you can read.</li>
          <li><b>Verify.</b> We measure the outcome against the criteria you signed. Lower evidence never gets promoted into a stronger claim — not in your dashboard, and not on this website.</li>
        </ol>
      </div>
      <div data-reveal="children">
        <span class="eyebrow">Team principles</span>
        <h2 style="font-size:clamp(24px,2.6vw,34px)">What we hold ourselves to</h2>
        <div class="card card--panel" style="margin-top:22px">
          <div class="kv"><span>We say what we can prove</span><b>Every claim carries its evidence horizon</b></div>
          <div class="kv"><span>We quote before we build</span><b>Full rate card before go-live</b></div>
          <div class="kv"><span>We keep your exit open</span><b>Month-to-month after day 60</b></div>
          <div class="kv"><span>We write things down</span><b>Every AI action carries a receipt</b></div>
          <div class="kv"><span>We run the stack for you</span><b>Operated and governed by us</b></div>
        </div>
        <p class="muted" style="margin-top:20px">If we can't demonstrate something to you the way we'd want it demonstrated to us, we don't put it on the site — and we won't put it in a proposal either.</p>
      </div>
    </div>
  </section>
  <section class="section section--paper" style="padding-top:0">
    <div class="container">
      <div class="final-cta" data-reveal>
        <div class="inner" style="max-width:640px">
          <span class="serif-accent">Never miss the moment.</span>
          <h2>Ready when your customers are</h2>
          <div class="hero-ctas">${L.btnDemoPlain('Book a Free Demo', 'about_final', 'btn--primary btn--lg')}</div>
        </div>
      </div>
    </div>
  </section>`;
  return shell({
    title: 'About — The Company Behind the AI',
    path: '/about',
    desc: 'HazirMinds builds and operates its own AI platform and infrastructure. Hazir means the right moment — our whole company exists so you never miss yours.',
    ld: [L.orgLd(), bc.ld],
    main
  });
}

/* ---------------- resources ---------------- */
function resources() {
  const bc = L.breadcrumbs([['Home', '/'], ['Resources', '/resources']]);
  const articles = require('../data/articles').map(a => [a.title, a.cat, a.read, a.slug]);
  const main = `
  <section class="hero-sub-plain section--paper" style="padding-bottom:0">
    <div class="container">
      ${bc.html}
      <h1 style="max-width:16ch">Tools &amp; playbooks</h1>
      <p class="lede" style="margin-top:18px;max-width:56ch">Start with the calculator owners actually use, then take a playbook with you.</p>
    </div>
  </section>
  <section class="section" style="padding-top:44px">
    <div class="container">
      <div class="report-card" style="max-width:760px;margin-inline:auto" data-reveal>
        <div class="card card--panel card--hairline-top">
          <span class="eyebrow">Lead magnet · free</span>
          <h2 style="font-size:clamp(24px,2.6vw,34px)">The Governance Report Card</h2>
          <p class="lede" style="margin-top:10px;font-size:15px">Eight questions. Score your AI risk, consent trail, audit readiness and escalation gaps — get your score instantly.</p>
          <div data-report-card>
            <div class="rc-q" style="margin-top:18px">
              <b>1. Do you know exactly what your AI is allowed to do — and not do?</b>
              <div class="rc-opts" role="group">
                <button class="rc-opt" data-w="0" aria-pressed="false">No written scope</button>
                <button class="rc-opt" data-w="1" aria-pressed="false">Verbal only</button>
                <button class="rc-opt" data-w="2" aria-pressed="false">Documented per role</button>
              </div>
            </div>
            <div class="rc-q">
              <b>2. Can you produce consent records for every opt-in you've collected?</b>
              <div class="rc-opts" role="group">
                <button class="rc-opt" data-w="0" aria-pressed="false">No trail</button>
                <button class="rc-opt" data-w="1" aria-pressed="false">Partial</button>
                <button class="rc-opt" data-w="2" aria-pressed="false">Fully timestamped</button>
              </div>
            </div>
            <div class="rc-q">
              <b>3. When the AI is unsure, what happens?</b>
              <div class="rc-opts" role="group">
                <button class="rc-opt" data-w="0" aria-pressed="false">It guesses</button>
                <button class="rc-opt" data-w="1" aria-pressed="false">Depends on the agent</button>
                <button class="rc-opt" data-w="2" aria-pressed="false">Discloses + escalates</button>
              </div>
            </div>
            <div class="rc-q">
              <b>4. Can you audit what the AI did last week?</b>
              <div class="rc-opts" role="group">
                <button class="rc-opt" data-w="0" aria-pressed="false">No log</button>
                <button class="rc-opt" data-w="1" aria-pressed="false">Fragments</button>
                <button class="rc-opt" data-w="2" aria-pressed="false">Full audit trail</button>
              </div>
            </div>
            <div class="rc-q">
              <b>5. Are consequential actions (send, publish, pay, delete) gated?</b>
              <div class="rc-opts" role="group">
                <button class="rc-opt" data-w="0" aria-pressed="false">Ungated</button>
                <button class="rc-opt" data-w="1" aria-pressed="false">Some</button>
                <button class="rc-opt" data-w="2" aria-pressed="false">All, by policy</button>
              </div>
            </div>
            <div class="rc-q">
              <b>6. Do factual AI answers carry a source?</b>
              <div class="rc-opts" role="group">
                <button class="rc-opt" data-w="0" aria-pressed="false">No</button>
                <button class="rc-opt" data-w="1" aria-pressed="false">Sometimes</button>
                <button class="rc-opt" data-w="2" aria-pressed="false">Always — receipts</button>
              </div>
            </div>
            <div class="rc-q">
              <b>7. Is your AI knowledge confined to approved sources?</b>
              <div class="rc-opts" role="group">
                <button class="rc-opt" data-w="0" aria-pressed="false">Open web</button>
                <button class="rc-opt" data-w="1" aria-pressed="false">Mostly</button>
                <button class="rc-opt" data-w="2" aria-pressed="false">Approved knowledge only</button>
              </div>
            </div>
            <div class="rc-q">
              <b>8. Are AI call flows regression-tested on a schedule?</b>
              <div class="rc-opts" role="group">
                <button class="rc-opt" data-w="0" aria-pressed="false">Never</button>
                <button class="rc-opt" data-w="1" aria-pressed="false">Ad hoc</button>
                <button class="rc-opt" data-w="2" aria-pressed="false">Nightly</button>
              </div>
            </div>
            <div class="rc-result" hidden style="text-align:center;padding:26px 0 8px">
              <span class="num">YOUR GOVERNANCE SCORE</span>
              <div class="rc-score" data-rc-score>0</div>
              <span class="stat-note" data-rc-note></span>
              <div style="margin-top:20px">${L.btnDemo('Close your gaps — book a demo', 'rc_demo', 'btn--primary')}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="calc" data-calc data-reveal style="margin-top:56px">
        <div class="calc-controls">
          <span class="eyebrow">Revenue leak calculator</span>
          <div class="calc-field"><label for="rc-calls">Missed calls per month <output for="rc-calls" data-out-calls>${JS.calc.calls}</output></label><input id="rc-calls" type="range" min="0" max="200" step="1" value="${JS.calc.calls}" data-calc-calls></div>
          <div class="calc-field"><label for="rc-value">Average job value <output for="rc-value" data-out-value>$${JS.calc.value}</output></label><input id="rc-value" type="range" min="50" max="5000" step="50" value="${JS.calc.value}" data-calc-value></div>
          <p class="form-note">A conservative floor: it ignores referrals, reviews and lifetime value.</p>
        </div>
        <div class="calc-result">
          <span class="eyebrow">Monthly revenue leak</span>
          <div class="big" data-calc-out>$${(JS.calc.calls * JS.calc.value).toLocaleString('en-US')}</div>
          <p>That's <b data-calc-year>$${(JS.calc.calls * JS.calc.value * 12).toLocaleString('en-US')}</b> a year.</p>
          <span class="note">Illustrative estimate.</span>
        </div>
      </div>
    </div>
  </section>
  <section class="section section--paper">
    <div class="container">
      <div class="sec-head" data-reveal="children">
        <span class="eyebrow">Reading list</span>
        <h2>Playbooks &amp; honest comparisons</h2>
      </div>
      <div class="grid grid-3" data-reveal="children">
        ${articles.map(a => `
        <a class="card" href="/resources/${a[3]}" style="display:flex;flex-direction:column;gap:10px;text-decoration:none">
          <span class="num">${a[1]} · ${a[2]}</span>
          <h3 style="font-size:18px">${a[0]}</h3>
          <span class="link-arrow" style="margin-top:auto">Read it</span>
        </a>`).join('')}
      </div>
      <p class="center form-note" style="margin-top:18px">Every figure in these articles is either your own arithmetic or a named source with its date — see the <a href="/resources/missed-call-cost">first one</a> for how that works.</p>
    </div>
  </section>
  <section class="section">
    <div class="container">
      <div class="sec-head" data-reveal="children">
        <span class="eyebrow">Reference</span>
        <h2>The governance vocabulary, in plain terms</h2>
        <p class="lede center" style="margin-inline:auto">Six words we use precisely, and what each one commits us to.</p>
      </div>
      <div class="grid grid-3" data-reveal="children">
        <div class="card"><h3 style="font-size:18px">Invariants</h3><p>Four rules that hold on every deployment: capability is not authority, execution is not liability, deployment is not adoption, continuity is not persona.</p></div>
        <div class="card"><h3 style="font-size:18px">Responsibility layers</h3><p>Every action sits under a named authority holder. You set the rules and give the approvals; the AI operates inside them and stops where they stop.</p></div>
        <div class="card"><h3 style="font-size:18px">Hallucination control</h3><p>Answers are drawn from approved knowledge only. When confidence is low the agent says so rather than guessing, and hands the conversation to a human.</p></div>
        <div class="card"><h3 style="font-size:18px">Proof horizons</h3><p>Every claim we publish is labelled by how it was established. A modelled outcome is never presented as a measured one.</p></div>
        <div class="card"><h3 style="font-size:18px">Receipts</h3><p>Each action leaves a record of what happened, what it was based on, and who approved it.</p></div>
        <div class="card"><h3 style="font-size:18px">Escalation</h3><p>Defined triggers hand a conversation to a person, with the context needed to continue it.</p></div>
      </div>
      <p class="center form-note" style="margin-top:22px">Deployments go live in 7–14 days. See the <a href="/enterprise" style="color:var(--rust-text)">enterprise governance layer</a> or the <a href="/pricing" style="color:var(--rust-text)">rate card</a>.</p>
    </div>
  </section>`;
  return shell({
    title: 'Resources — ROI Calculator & Playbooks',
    path: '/resources',
    desc: 'Calculate your revenue leak from missed calls, then browse HazirMinds playbooks on speed-to-lead, reactivation and AI receptionists.',
    ld: [L.orgLd(), bc.ld],
    main
  });
}

/* ---------------- demo (booking endpoint) ---------------- */
function demo() {
  const bc = L.breadcrumbs([['Home', '/'], ['Book a Demo', '/demo']]);
  const faq = L.faqBlock([
    { q: 'Do I have to change my phone number or phone system?',
      a: 'No. Your number stays yours and your existing system keeps working. We route calls to the AI and hand a live call back to your team or your line whenever the scope you approved says a human should take it. Nothing about your published number changes for your customers.' },
    { q: 'How long until it is live on my business?',
      a: '7–14 days for a done-for-you deployment. That window covers training the agent on your services, pricing, hours and exceptions, plus the approval gates you sign off before the first customer is answered. Achievable, not rushed — we do not go live on defaults.' },
    { q: 'What happens when the AI cannot answer something?',
      a: 'It escalates. Every agent carries a written escalation path: if a request falls outside the scope you approved — or the caller asks for a person — the call is handed over with the context attached, and the handover is logged as a receipt.' },
    { q: 'What happens after the 15-minute demo?',
      a: 'You get a written plan: the activation we would deploy, the rate card, and the acceptance criteria we would measure against. There is no obligation and no auto-enrolment — if you proceed, the deployment is measured against those criteria and reported to you in writing.' }
  ]);
  const main = `
  <section class="hero-sub-plain section--paper" style="padding-bottom:0">
    <div class="container">
      ${bc.html}
      <h1 style="max-width:16ch">Hear your own AI in 15 minutes</h1>
      <p class="lede" style="margin-top:18px;max-width:58ch">${site.phone
        ? `Book a slot below — or call our live AI right now at <a href="${TEL}" style="color:var(--rust-text);font-weight:600">${site.phone}</a>. It answers in under a second.`
        : `Book a slot below — or email us at <a href="${TEL}" style="color:var(--rust-text);font-weight:600">${site.email}</a>. Tell us what you want the AI to handle first.`}</p>
    </div>
  </section>
  <section class="section" style="padding-top:44px">
    <div class="container" style="max-width:760px">
      <div class="band-media" data-reveal style="margin-bottom:26px">
        <img src="/img/dm/dm-welcome-1200.webp"
             srcset="/img/dm/dm-welcome-600.webp 600w, /img/dm/dm-welcome-900.webp 900w, /img/dm/dm-welcome-1200.webp 1200w, /img/dm/dm-welcome-1600.webp 1600w"
             sizes="(max-width: 900px) 100vw, 760px" width="1600" height="1200"
             loading="lazy" decoding="async"
             alt="A welcome area prepared for a meeting — what a demo slot is set up to feel like.">
      </div>
      <div class="card card--panel" data-reveal>
        <span class="eyebrow">Book a Free Demo</span>
        <form data-validate id="demo-form" data-endpoint="${site.leadEndpoint}" aria-label="Demo booking form">
          <div data-fields class="form-grid">
            <div class="form-field"><label for="d-name">Full name</label><input id="d-name" name="name" required autocomplete="name"><span class="err">Please enter your name</span></div>
            <div class="form-field"><label for="d-email">Work email</label><input id="d-email" name="email" type="email" required autocomplete="email"><span class="err">Enter a valid email</span></div>
            <div class="form-field"><label for="d-company">Company</label><input id="d-company" name="company" required autocomplete="organization"><span class="err">Please enter your company</span></div>
            <div class="form-field"><label for="d-phone">Phone</label><input id="d-phone" name="phone" type="tel" required autocomplete="tel"><span class="err">Enter a valid phone number</span></div>
            <div class="form-field"><label for="d-industry">Industry</label>
              <select id="d-industry" name="industry" required>
                <option value="">Choose…</option>
                <option>Home services / HVAC</option><option>Dental</option><option>Legal</option><option>Restaurant</option><option>Real estate</option><option>Auto services</option><option>E-commerce</option><option>Professional services</option><option>Other</option>
              </select><span class="err">Please choose an industry</span></div>
            <div class="form-field"><label for="d-size">Team size</label>
              <select id="d-size" name="size" required>
                <option value="">Choose…</option><option>Just me</option><option>2–10</option><option>11–50</option><option>51–200</option><option>200+</option>
              </select><span class="err">Please choose a team size</span></div>
            <div class="form-field full"><label for="d-notes">What should the AI do first? <span class="muted" style="font-weight:400">(optional)</span></label><textarea id="d-notes" name="notes" rows="3" placeholder="e.g. answer calls after 6 PM and book into ServiceTitan"></textarea><span class="err"></span></div>
            <div class="form-field full"><button class="btn btn--primary btn--lg" type="submit" style="width:100%"><span class="shine"></span>Book my free demo ${I('arrow')}</button>
            <span class="form-note">15 minutes, no commitment, includes a walkthrough of exactly what we measure. You can also email <a href="mailto:${site.email}" style="color:var(--rust-text)">${site.email}</a>.</span></div>
          </div>
          <div class="form-success">
            ${I('check')}
            <div><b>Request received.</b><p class="muted" style="font-size:14px;margin:6px 0 0">We have your details and will reply by email to lock in a slot. Anything to add first? Email <a href="mailto:${site.email}" style="color:var(--rust-text)">${site.email}</a>.</p></div>
          </div>
          <div class="form-error" role="alert">
            ${I('info')}
            <div><b>That didn't send.</b><p class="muted" style="font-size:14px;margin:6px 0 0">Something failed on our end — your details are still in the form above, so you can try again. Or email <a data-mailto="${site.email}" href="mailto:${site.email}" style="color:var(--rust-text)">${site.email}</a> and we'll pick it up from there.</p></div>
          </div>
        </form>
      </div>
      <div class="chips" style="justify-content:center;margin-top:22px" data-reveal>
        <span class="pill">Live in 7–14 days</span><span class="pill">Acceptance criteria you sign</span><span class="pill">Audit trail on every action</span>
      </div>
    </div>
  </section>
  <section class="section section--paper">
    <div class="container grid grid-2" style="align-items:start;gap:48px">
      <div data-reveal="children">
        <span class="eyebrow">The 15 minutes</span>
        <h2 style="font-size:clamp(24px,2.6vw,34px)">What actually happens on the call</h2>
        <ol class="steps-plain">
          <li><b>You hear your own business.</b> We load your services, hours and pricing into the receptionist and let it answer a live call as your company — not a generic demo script.</li>
          <li><b>We try to break it.</b> You ask the awkward questions: the emergency, the price objection, the caller who wants a human, the request your team always has to handle personally. You'll see exactly where it hands over.</li>
          <li><b>We show the receipts.</b> Every action the AI took on that call — what it booked, what it logged, what it escalated — appears as a record, the same one you'd get in production.</li>
          <li><b>We quote before we build.</b> You leave with the rate card and the activation we'd deploy. There is no unpublished meter and no number held back for a second meeting.</li>
        </ol>
        <p class="muted" style="margin-top:18px">Fifteen minutes, no commitment. If the AI can't beat voicemail on a call you care about, that's a useful answer too — and we'll say so.</p>
      </div>
      <div data-reveal="children">
        <span class="eyebrow">On this site</span>
        <h2 style="font-size:clamp(24px,2.6vw,34px)">What the live demo tabs show</h2>
        <p class="muted" style="margin-top:16px">The demo widget on our home page runs the same transcript engine you'll hear on the call, in three industry shapes. Switch the tabs to see how the same governed assistant changes:</p>
        <div class="card card--panel" style="margin-top:18px">
          <div class="kv"><span><b>Home Services</b> — an emergency after hours</span><b>Books a slot, flags urgency</b></div>
          <div class="kv"><span><b>Dental</b> — a new-patient enquiry</span><b>Screens, books, confirms</b></div>
          <div class="kv"><span><b>Law Firm</b> — an after-hours intake</span><b>Qualifies, books, escalates</b></div>
        </div>
        <p class="muted" style="margin-top:18px">Same platform, same permissions model, same receipts. Only the script, the knowledge and the escalation rules change — which is the whole point of a governed deployment rather than a scripted bot.</p>
        <div class="chips" style="margin-top:18px">
          <span class="pill pill--brass">Every action logged</span><span class="pill">Escalates outside scope</span><span class="pill">Your approval gates first</span>
        </div>
      </div>
    </div>
  </section>
  <section class="section">
    <div class="container" style="max-width:820px">
      <div class="sec-head" data-reveal="children">
        <span class="eyebrow">Before you book</span>
        <h2>Questions we get on the call</h2>
      </div>
      <div class="faq" data-reveal="children">
        ${faq.html}
      </div>
      <div class="card card--panel" style="margin-top:26px" data-reveal>
        <span class="eyebrow">Your data</span>
        <p class="muted" style="margin-top:10px">The demo form sends us only what you type here — name, work email, company, phone, industry, team size and your note. We use it to prepare your demo and follow up. No ad trackers, no third-party cookies, nothing sold. Call recordings and transcripts from a live deployment stay in your workspace and are used to tune your own deployment. Full detail in our <a href="/privacy" style="color:var(--rust-text)">Privacy Policy</a>.</p>
      </div>
    </div>
  </section>`;
  return shell({
    title: 'Book a Free Demo — Hear the AI Answer for Your Business',
    path: '/demo',
    desc: 'Book a 15-minute demo and hear a HazirMinds AI receptionist answer as your business. Live in 7–14 days, measured against acceptance criteria you sign.',
    ld: [L.orgLd(), bc.ld, faq.ld],
    main
  });
}

/* ---------------- privacy & terms ---------------- */
function legal(kind) {
  const isP = kind === 'privacy';
  const title = isP ? 'Privacy Policy' : 'Terms of Service';
  const bc = L.breadcrumbs([['Home', '/'], [title, '/' + kind]]);
  const ps = isP ? [
    ['What we collect', 'Contact details you give us (name, email, phone, company), call recordings and transcripts for numbers we answer on your behalf, and standard usage analytics.'],
    ['How we use it', 'To operate your AI team, tune its performance, bill accurately, and support you. We do not sell personal data. Ever.'],
    ['Recording & consent', 'Calls answered by HazirMinds agents can include recording announcements where required by law. Transcripts are stored encrypted and retained per your configuration.'],
    ['Data location', 'Client data is processed and stored in the United States. Recordings and transcripts stay in your isolated workspace.'],
    ['Your choices', 'Request access, correction or deletion of your data at any time at ' + site.email + '. We respond within 30 days.'],
    ['Security', 'Encryption in transit and at rest, least-privilege access, audit logging, and infrastructure isolated per client — operated by HazirMinds.']
  ] : [
    ['Service', 'HazirMinds deploys, hosts and operates AI agents for your business as described on our plans page. Plans are month-to-month after the first 60 days.'],
    ['Measurement', 'Each deployment is measured against the acceptance criteria agreed in writing before go-live, and reported to you on request.'],
    ['Billing', 'Plans bill monthly or annually in USD. Overage minutes bill at ' + JS.addons.find(a => a.id === 'minutes').price + '. Taxes may apply.'],
    ['Acceptable use', 'No unlawful, deceptive or spam use of the agents; no use that violates TCPA or applicable call-recording and consent laws.'],
    ['Liability', 'Our liability is limited to fees paid in the prior three months. We are not liable for indirect or consequential damages.'],
    ['Contact', 'Questions about these terms: ' + site.email + '.']
  ];
  const main = `
  <section class="hero-sub-plain" style="padding-bottom:0">
    <div class="container">
      ${bc.html}
      <h1 style="max-width:14ch">${title}</h1>
      <p class="muted" style="margin-top:12px">Last updated September 2026 · HazirMinds, Inc.</p>
    </div>
  </section>
  <section class="section" style="padding-top:44px">
    <div class="container" style="max-width:800px">
      ${ps.map((p, i) => `<div class="card" style="margin-bottom:16px" data-reveal><h2 style="font-size:18px;line-height:1.25;letter-spacing:-.012em;margin-bottom:10px">${i + 1}. ${p[0]}</h2><p class="muted" style="margin:8px 0 0;font-size:15px">${p[1]}</p></div>`).join('')}
      <p class="form-note">Plain-English summaries; the full legal documents are available on request at ${site.email}.</p>
    </div>
  </section>`;
  return shell({
    title: title + ' — Plain English',
    path: '/' + kind,
    desc: isP ? 'How HazirMinds collects, uses and protects your data — including recordings, transcripts and data location.' : 'HazirMinds terms of service: plans, billing, measurement and acceptable use.',
    ld: [L.orgLd()],
    main
  });
}

/* ---------------- 404 ---------------- */
function notFound() {
  const main = `
  <section class="section center" style="min-height:60vh;display:grid;place-items:center">
    <div class="container" style="max-width:560px">
      <span class="eyebrow" style="justify-content:center">Error 404</span>
      <h1 style="font-size:clamp(48px,8vw,90px)">404</h1>
      <p class="serif-accent">Even our AI can't find this page.</p>
      <p class="muted">The moment passed — but your next one doesn't have to. Try one of these:</p>
      <div class="hero-ctas" style="justify-content:center">
        <a class="btn btn--primary" href="/"><span class="shine"></span>Back home</a>
        <a class="btn btn--ghost" href="/services">Browse every service</a>
      </div>
    </div>
  </section>`;
  return shell({
    title: '404 — Page not found',
    path: '/404',
    desc: 'That page could not be found. Hear the HazirMinds AI answer a live call or browse the labeled catalog — 19 out-of-box, everything else scoped.',
    ld: [],
    main
  });
}

module.exports = {
  pages: [
    { file: 'case-studies/index.html', html: caseStudies() },
    { file: 'about/index.html', html: about() },
    { file: 'resources/index.html', html: resources() },
    { file: 'demo/index.html', html: demo() },
    { file: 'privacy/index.html', html: legal('privacy') },
    { file: 'terms/index.html', html: legal('terms') },
    { file: '404.html', html: notFound() }
  ]
};
