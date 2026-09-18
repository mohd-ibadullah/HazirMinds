/* Article bodies for /resources/<slug>.
 *
 * HOUSE RULE, enforced by qa/finalpass-content.js: every figure is either arithmetic the reader
 * can redo with their own numbers, or a named source with its date and sample size attached.
 * No unnamed studies, no invented multipliers, no client claims. Where we do not know something,
 * the article says so. */

const JS = require('./site.json');

/* The illustrative figures in these articles are derived from site.json rather than typed in,
   so changing the calculator defaults or a tier price cannot leave an article contradicting the
   pricing page. Competitor prices are quoted with the date they were read, as a third-party
   snapshot, and are not product prices — which is why this file is not in the F4 gate list in
   build.js. */
const calc = JS.calc;
const leakMonth = calc.calls * calc.value;
const leakYear = leakMonth * 12;
const usd = n => '$' + n.toLocaleString('en-US');

module.exports = [
  {
    slug: 'missed-call-cost',
    title: 'The true cost of a missed call, by industry',
    cat: 'Pricing',
    read: '6 min',
    lede: 'There is no single honest number for the cost of a missed call, because it depends entirely on what that call was worth to you. Here is the arithmetic instead, so you can put your own numbers in.',
    desc: 'How to work out what a missed call actually costs your business: the arithmetic, the inputs you need, and why the widely quoted industry averages do not survive scrutiny.',
    body: `      <p>Every missed-call calculator you will find online, ours included, is doing the same three-step sum. The only thing that differs is which numbers get hidden in the assumptions.</p>

      <p>The sum is:</p>

      <ul>
        <li><strong>Missed calls per month</strong> — calls that rang out, went to voicemail, or hit a busy signal during opening hours and outside them.</li>
        <li><strong>How many of those were real jobs</strong> — not spam, not suppliers, not existing customers asking a question you already answered.</li>
        <li><strong>What one job is worth</strong> — the average invoice, or better, the average gross profit on an invoice.</li>
      </ul>

      <p>Multiply the three and you have your monthly leak. Ours defaults to ${calc.calls} missed calls, a ${usd(calc.value)} job and a 100% assumption — deliberately the most conservative version of the sum, because it claims no conversion rate at all. Some of those callers would have booked anyway; some would have gone elsewhere. We leave that judgement to you rather than inventing a percentage and calling it research.</p>

      <h2>What the numbers look like with a real input</h2>

      <div class="table-scroll">

      <table class="compare compare--3col">
        <thead>
          <tr><th>Input</th><th>Example</th><th>Where it comes from</th></tr>
        </thead>
        <tbody>
          <tr><td>Missed calls / month</td><td>${calc.calls}</td><td>Your phone system's call log — the only authoritative source</td></tr>
          <tr><td>Average job value</td><td>${usd(calc.value)}</td><td>Your last 20 invoices, averaged</td></tr>
          <tr><td>Monthly leak</td><td>${usd(leakMonth)}</td><td>${calc.calls} × ${usd(calc.value)} — arithmetic, not a study</td></tr>
          <tr><td>Annual leak</td><td>${usd(leakYear)}</td><td>The same figure × 12</td></tr>
        </tbody>
      </table>
      </div>

      <div class="note">
        <p><strong>Read this as a floor, not a forecast.</strong> The ${usd(leakYear)} assumes every single missed call was a bookable job worth ${usd(calc.value)}. That will not be true. It is also why we do not publish a "conversion uplift" figure next to it — we have not measured that across enough businesses to claim one.</p>
      </div>

      <h2>Why the industry averages you have seen are shaky</h2>

      <p>The most-quoted statistic in this space — that businesses miss roughly a third of inbound calls — traces back to a 2016 vendor survey of 85 small businesses run by 411 Locals. Eighty-five businesses is a small sample, it is a decade old, and the company sold call-answering services. We cite it because it is the origin of the number, and we label it as exactly that: <span class="src">411 LOCALS, 2016 — 85 BUSINESSES, VENDOR STUDY</span>.</p>

      <p>Other figures floating around — "80% of callers hang up without leaving a voicemail", "a missed call costs $1,200" — generally trace to lead-response vendors or to salary surveys repackaged as call statistics. Where we cannot find a primary source, this site labels the figure <em>industry vendor estimates</em> rather than presenting it as fact.</p>

      <p>Your own call log beats all of them. Pull the last 90 days, count the calls that rang out, and you will have a number that is worth more than any published average.</p>

      <h2>The cost that does not show up on the calculator</h2>

      <p>The arithmetic above counts lost revenue. It misses three things that are harder to price:</p>

      <ul>
        <li><strong>The review you never got.</strong> Someone who called, got voicemail and went elsewhere does not leave you a one-star review. They leave you nothing, and you never learn they existed.</li>
        <li><strong>The after-hours calls.</strong> A call at 8pm is not a smaller call. For emergency trades, the after-hours caller is often the highest-intent caller of the day.</li>
        <li><strong>The second call.</strong> Customers who cannot reach you rarely try once. They try, fail, and call your competitor — which is a comparison you never get to enter.</li>
      </ul>

      <h2>What to do about it, in order</h2>

      <ol>
        <li><strong>Measure first.</strong> Ninety days of call logs. Count ring-outs by hour of day. The hourly pattern usually shows you whether your problem is lunchtime, closing time, or the after-hours window.</li>
        <li><strong>Cover the hours you are losing.</strong> If the ring-outs concentrate at 6–9pm, you do not need more staff during the day. You need something answering when nobody is there.</li>
        <li><strong>Text back immediately.</strong> A missed call that gets a text within seconds is a conversation that is still open. That mechanism is what <a href="/use-cases/missed-call-textback">missed-call text-back</a> does.</li>
        <li><strong>Re-measure.</strong> The same 90-day count, after. If the number moved, the fix worked. If it did not, you have learned something more useful than any benchmark.</li>
      </ol>

      <p>Run the sum with your own numbers in the <a href="/resources">revenue leak calculator</a>, or <a href="/demo">book 15 minutes</a> and we will go through your call log together.</p>`
  },
  {
    slug: 'speed-to-lead',
    title: 'Speed-to-lead: why the first minute decides the lead',
    cat: 'Playbook',
    read: '8 min',
    lede: 'The direction of this one is solid and well-replicated in vendor research. The precise multipliers are not. Here is what to actually build, and how to measure whether it worked for you.',
    desc: 'Speed-to-lead explained: why the first minute matters, what the vendor research does and does not establish, and the five automation steps that shorten the gap.',
    body: `      <h2>First, the honest version of the claim</h2>

      <p>If you have read that "leads contacted within five minutes are 21 times more likely to convert", that figure comes from lead-response research published by InsideSales.com. It is a vendor-published study, not a peer-reviewed one, and the arithmetic behind it has been challenged more than once.</p>

      <p>What the body of vendor research does agree on, consistently and across several publishers, is the <em>shape</em> of the curve: contact rates fall steeply as response time grows, and the fall is largest in the first few minutes. The steepness of the drop, and the exact multiple, differ from study to study.</p>

      <div class="note">
        <p><strong>What we will claim:</strong> getting to a lead faster than your competitors materially improves your odds of reaching them, and the first minute is where most of the advantage sits.</p>
        <p><strong>What we will not claim:</strong> a specific multiplier. It would not survive contact with your business, and we would be quoting a number we have not measured on your line.</p>
      </div>

      <h2>Why the first minute specifically</h2>

      <p>Speed matters most when the lead is still holding their phone. Three things are true in that window that stop being true later:</p>

      <ul>
        <li><strong>Attention is still available.</strong> They called because they had a problem right then. Ten minutes later they are back in whatever they were doing.</li>
        <li><strong>You are still the default.</strong> Most people call two or three businesses in a row. Whatever answers first sets the frame the others are judged against.</li>
        <li><strong>The context is fresh.</strong> When you reply in seconds, you can reference the exact call — "you just rang about the leak" — which reads as competence rather than a cold follow-up.</li>
      </ul>

      <h2>The five steps that actually shorten it</h2>

      <h3>1. Answer or text — never let it ring out silently</h3>
      <p>A call that rings out is a lead with no response time at all. Either answer it, or fire a text within seconds. The text is not a downgrade; for a large share of callers it is the preferred channel.</p>

      <h3>2. Reply inside 60 seconds, automatically</h3>
      <p>This is the only step that cannot be done by hand, because by hand it depends on someone noticing. Missed-call text-back does it as a rule: the call ends, the text is already sent, with the business name and a one-line question.</p>

      <h3>3. Ask one qualifying question, not five</h3>
      <p>"What's the address, and what's happening?" beats a six-field form. Every extra question costs you a reply. You can gather the rest once they are engaged.</p>

      <h3>4. Put a real slot on the table</h3>
      <p>Converting intent into a calendar entry is the step most automations skip. "I have 2–4pm tomorrow, does that work?" produces a booking. "Let us know when suits" produces a maybe.</p>

      <h3>5. Escalate on the signals you defined in advance</h3>
      <p>A caller who asks about pricing on a $30,000 job, or mentions a complaint, or asks something the knowledge base cannot answer, should reach a human — with the transcript and context attached, not a fresh start.</p>

      <h2>How to measure it honestly</h2>

      <p>Pick these four numbers and log them for 30 days before you change anything:</p>

      <div class="table-scroll">

      <table class="compare compare--2col">
        <tbody>
          <tr><td>Median first-touch time</td><td>Minutes from inbound to your first reply</td></tr>
          <tr><td>Contact rate</td><td>Share of leads you actually spoke with</td></tr>
          <tr><td>Booking rate</td><td>Share of leads that became a scheduled job</td></tr>
          <tr><td>Reply rate by hour</td><td>Which hours are killing you</td></tr>
        </tbody>
      </table>
      </div>

      <p>The median, not the average. Averages get dragged around by one lead you replied to in three days, and that single outlier hides what your typical lead experiences.</p>

      <div class="note">
        <p><strong>The trap to avoid:</strong> measuring speed and nothing else. A 20-second autoreply followed by three days of silence is worse than a five-minute reply that turns into a booking, because it burns the caller's attention without using it.</p>
      </div>

      <h2>What this looks like as a system</h2>

      <p>Answer or text in seconds, qualify in one question, offer a concrete slot, escalate on defined triggers, and log every timestamp so you can prove the median moved. That is the whole mechanism behind <a href="/services#speed-to-lead">speed-to-lead</a>. The technology is the easy part; the discipline is defining "escalate on what" before you need it.</p>

      <p>If you want the version that runs on your existing number, <a href="/demo">book 15 minutes</a> and we will look at your current first-touch times.</p>`
  },
  {
    slug: 'ai-vs-human-receptionist',
    title: 'AI receptionist vs human receptionist: an honest ledger',
    cat: 'Comparison',
    read: '7 min',
    lede: 'A vendor comparison that concludes the vendor always wins is not a comparison. Here is where a human beats an AI receptionist outright, where the AI wins, and the honest answer for most businesses.',
    desc: 'An honest comparison of AI and human receptionists: cost per hour, hours covered, consistency, judgement, escalation and the cases where a human is simply better.',
    body: `      <h2>Start with where the human wins</h2>

      <p>If you are comparing the two, the fastest way to a useful answer is to name the situations where software genuinely loses. Ours does, in these cases:</p>

      <ul>
        <li><strong>Emotional calls.</strong> A bereaved family calling a funeral home, an angry customer calling about a botched job, a patient frightened about a diagnosis. A well-trained person reads the room. A voice agent follows a script, and the gap shows.</li>
        <li><strong>Genuine ambiguity.</strong> "We need something for the thing we discussed with Dave." A person asks their way to the answer. An AI either guesses or escalates, and if it guesses you have a problem.</li>
        <li><strong>Negotiation.</strong> Trade-ins, bespoke quotes, discount requests, multi-service bundles. These need someone who can decide, and a voice agent should not be deciding.</li>
        <li><strong>The handover moment.</strong> When a caller asks for "a real person", any delay is noticed. A human receptionist <em>is</em> the real person. That is worth something no script can replicate.</li>
      </ul>

      <h2>Now where the AI wins</h2>

      <p>These are not marginal advantages; they are structural.</p>

      <div class="table-scroll">

      <table class="compare compare--3col">
        <thead>
          <tr><th></th><th>Human receptionist</th><th>AI receptionist</th></tr>
        </thead>
        <tbody>
          <tr><td>Hours covered</td><td>Their shift. Usually 8–5, with lunch.</td><td>Every hour of every day, including holidays</td></tr>
          <tr><td>Simultaneous calls</td><td>One. The second call rings out.</td><td>As many as arrive</td></tr>
          <tr><td>Script consistency</td><td>Varies with mood, energy and who is on shift</td><td>Identical every time by construction</td></tr>
          <tr><td>Sick days, holidays, turnover</td><td>Cover needed; knowledge leaves with them</td><td>None</td></tr>
          <tr><td>Cost of the third shift</td><td>A second salary or an answering service</td><td>Already included</td></tr>
          <tr><td>Training a new person</td><td>Weeks before they are reliable</td><td>A knowledge-base update</td></tr>
        </tbody>
      </table>
      </div>

      <h2>The cost, with sources</h2>

      <p>This is where most comparisons quietly cheat. Here are the published figures, read from the vendors' own pricing pages on 16 September 2026:</p>

      <div class="table-scroll">

      <table class="compare compare--3col">
        <thead>
          <tr><th>Option</th><th>Published price</th><th>What it covers</th></tr>
        </thead>
        <tbody>
          <tr><td>Smith.ai, AI-first</td><td>Free (25 calls) · $150/mo (75) · $500/mo (300)</td><td>A published self-serve ladder, with overages from $2.00 to $11.50 per call</td></tr>
          <tr><td>Smith.ai, human-first</td><td>$300/mo for 30 calls</td><td>Their human receptionists — roughly $10 a call before overage</td></tr>
          <tr><td>HazirMinds Chronos</td><td>${usd(JS.tiers.chronos.monthly)}/mo, 300 minutes included</td><td>AI voice, text-back, SMS reminders; extra minutes metered</td></tr>
          <tr><td>In-house receptionist</td><td>Salary plus employer costs</td><td>Roughly 40 hours a week, one call at a time</td></tr>
        </tbody>
      </table>
      </div>

      <div class="note">
        <p><strong>On the salary line:</strong> US salary surveys put receptionist pay in a wide band depending on market and industry, and the fully loaded cost — payroll tax, benefits, cover, management time — is materially above the headline wage. We show the line without a number rather than picking a midpoint and presenting it as your cost. Your accountant already knows yours.</p>
      </div>

      <h2>The ledger, honestly totalled</h2>

      <p>Count the calls. If a meaningful share of your inbound happens outside 9–5, or arrives while nobody is free to answer, the AI is not replacing your receptionist — it is covering the hours you were losing. That is a different purchase, and usually an easier one to justify.</p>

      <p>If <em>all</em> your calls land inside opening hours at a comfortable volume, and those calls need judgement, a human is the better answer. We would rather you conclude that than buy something you do not need.</p>

      <h2>What most businesses actually do</h2>

      <p>The pattern that survives contact with reality is a hybrid, and it is worth saying plainly which half does what:</p>

      <ol>
        <li><strong>The AI answers everything first</strong> — greets, qualifies, books, and handles the routine majority without a human involved.</li>
        <li><strong>It escalates on triggers you define</strong> — a complaint, a high-value job, a request for a person, a question outside the approved knowledge base.</li>
        <li><strong>The human does the human parts</strong> — the sensitive call, the negotiation, the relationship. And receives the transcript, so the caller never repeats themselves.</li>
      </ol>

      <p>You can hear the greeting and the escalation behaviour on <a href="/">the live call on our home page</a>, and <a href="/demo">book 15 minutes</a> if you want to test it against your own call patterns.</p>`
  },
  {
    slug: 'consent-disclosure-recording',
    title: 'Consent, disclosure and call recording: what the rules actually require',
    cat: 'Compliance',
    read: '5 min',
    lede: 'Three separate legal questions get bundled into one when people talk about "AI phone compliance". They have different rules, different consequences, and different fixes. Here is the plain-language orientation — not legal advice.',
    desc: 'A plain-language orientation to call consent, AI disclosure and recording rules: TCPA consent, two-party recording states, and the new AI-disclosure statutes.',
    body: `      <div class="note">
        <p><strong>Read this as orientation, not advice.</strong> We are describing the shape of the rules and the questions to put to your lawyer. We are not a law firm, this is not legal advice, and the specifics depend on your state, your industry and who you are calling.</p>
      </div>

      <h2>Question 1 — may you contact them at all?</h2>

      <p>This is the telephone-consumer-protection question, and it is the one with real money attached: statutory damages are per call or per text, which is why plaintiff firms specialise in it.</p>

      <p>The framework, in outline:</p>

      <ul>
        <li><strong>Marketing calls and texts to mobile numbers</strong> generally need prior express written consent — a specific, signed, unambiguous agreement, not a pre-ticked box.</li>
        <li><strong>Informational messages</strong> about a transaction the person already started sit at a lower bar, but the bar is not zero and the categories blur the moment you add a promotional line.</li>
        <li><strong>Calling hours</strong> are restricted — the telemarketing rules place the permitted window at 8am to 9pm in the called party's local time.</li>
        <li><strong>Revocation must work.</strong> When someone says "stop", the system has to honour it, and "reasonably promptly". An opt-out that takes a week to propagate is not a defence, it is the evidence.</li>
      </ul>

      <p>The practical implication for an AI phone system: consent state is not a checkbox in your CRM, it is an input the agent checks before it dials. If your automation texts a list you bought, the automation is the violation, not the list.</p>

      <h2>Question 2 — may you record it?</h2>

      <p>Recording law is state law, and states split into two camps:</p>

      <ul>
        <li><strong>One-party consent</strong> — as long as one participant knows, recording is generally lawful.</li>
        <li><strong>All-party consent</strong> — everyone on the call must consent. California, Illinois, Pennsylvania and Washington are among the commonly cited all-party states, and the count sits around a dozen.</li>
      </ul>

      <p>The complication is that the rule usually follows the most protective state on the call, not the state you are sitting in. A single-state operator calling into an all-party state is the classic fact pattern in these cases.</p>

      <p>The fix is unglamorous: a disclosure at the top of every call, in the greeting, before anything is recorded. Not buried in a policy page — in the audio, where the person can hear it and object.</p>

      <h2>Question 3 — must you say it is an AI?</h2>

      <p>This is the newest layer and the one that is still moving. Recent state statutes have started to require disclosure that a caller is interacting with an artificial intelligence rather than a person, alongside related obligations such as crisis referral and record-keeping. Colorado's artificial-intelligence act, HB 26-1263, is one such example, with obligations taking effect on 1 January 2027.</p>

      <p>We are not going to publish a state-by-state table here. Statutes in this area are being amended and litigated in real time, and a table that is right today would be wrong by the time you read it. The durable advice is simpler: <strong>disclose, always.</strong></p>

      <p>Disclosing costs you very little. In our own testing the overwhelming majority of callers carry on without comment, and the ones who do comment are usually relieved — they wanted to know. The alternative is discovering the requirement in a complaint.</p>

      <h2>What a governed setup looks like</h2>

      <p>Four controls, all cheap to build and all expensive to discover missing:</p>

      <div class="table-scroll">

      <table class="compare compare--2col">
        <tbody>
          <tr><td>Consent state checked before dialling</td><td>The agent refuses to contact a number without a recorded opt-in</td></tr>
          <tr><td>Disclosure in the greeting</td><td>Both that it is an AI, and that the call is recorded</td></tr>
          <tr><td>Opt-out honoured immediately</td><td>Written to the record on the call, not batched nightly</td></tr>
          <tr><td>Consent and disclosure logged</td><td>Timestamped, per contact, exportable — so a question is answered with a record</td></tr>
        </tbody>
      </table>
      </div>

      <p>Those four are what we mean by a consent and TCPA proof trail. They are also the reason we <a href="/demo">walk through your current call flows</a> before quoting anything — the controls are the product, and they have to match how you actually operate.</p>`
  },
  {
    slug: 'database-reactivation',
    title: 'Database reactivation: found money in your CRM',
    cat: 'Playbook',
    read: '4 min',
    lede: 'Most businesses are sitting on a list of people who already raised their hand and were never followed up. This is how to work that list lawfully, and how to tell whether it worked.',
    desc: 'How database reactivation works in practice: consent first, honest arithmetic instead of invented conversion rates, the cadence, and how to measure the result.',
    body: `      <h2>Why the list exists</h2>

      <p>Every business has one. The quote that went out and was never chased. The enquiry from eighteen months ago that arrived during a busy week. The customer who bought once and was never asked back. None of these people is cold — they contacted you. They are warmer than any lead you could buy.</p>

      <p>The reason they are still sitting there is almost never strategy. It is that following up is nobody's named job.</p>

      <h2>Consent first, or do not start</h2>

      <div class="note">
        <p><strong>This step is not optional and it comes first.</strong> Marketing texts and automated calls to mobile numbers generally require prior express written consent, and the rules on revocation are strict. If your list does not carry a recorded opt-in that covers marketing, the lawful version of this playbook is a phone call from a person — not a text blast. See <a href="/resources/consent-disclosure-recording">the consent article</a> for the outline, and your lawyer for your specifics.</p>
      </div>

      <p>So the first pass over any list is a filter, not a message: who has a documented opt-in, who has asked not to be contacted, and who falls in neither camp. The third group is the one that gets worked by hand.</p>

      <h2>The arithmetic — with your numbers, not ours</h2>

      <p>We are not going to hand you a reactivation conversion rate. Vendors publish those because they sell reactivation, and the honest range is so wide as to be useless: it depends on the list's age, why they went quiet, and what you are selling them. Do the sum with a deliberately pessimistic input and see whether it still clears the bar:</p>

      <div class="table-scroll">

      <table class="compare compare--3col">
        <thead>
          <tr><th>Input</th><th>Pessimistic example</th><th>Your number</th></tr>
        </thead>
        <tbody>
          <tr><td>Contacts with valid consent</td><td>800</td><td>—</td></tr>
          <tr><td>Reachable (delivered, answered, or replied)</td><td>60% → 480</td><td>—</td></tr>
          <tr><td>Reply or conversation rate</td><td>5% → 24 conversations</td><td>—</td></tr>
          <tr><td>Booked rate of those conversations</td><td>40% → 10 jobs</td><td>—</td></tr>
          <tr><td>Value per job</td><td>$400 → $4,000</td><td>—</td></tr>
        </tbody>
      </table>
      </div>

      <p>Ten jobs from a list you already own. If even that pessimistic version does not clear the cost of the campaign, stop here — that is a real answer and better found now. If it does, the rest is execution.</p>

      <h2>The cadence that does not burn the list</h2>

      <ol>
        <li><strong>Segment by why they went quiet.</strong> Never-quoted, quoted-not-closed, and lapsed-customer are three different messages. One generic "we miss you" text wastes all three.</li>
        <li><strong>Lead with something they can use.</strong> A seasonal reminder, a change in the rules that affects them, a maintenance interval that has come round. Not "just checking in".</li>
        <li><strong>Three touches, then stop.</strong> A text, a follow-up a few days later, and one final note. Then move them to the do-not-contact-over-this list. Persistence is not the same as pressure.</li>
        <li><strong>Make the opt-out one word.</strong> And honour it on the call, immediately, written to the record.</li>
        <li><strong>Route replies to a person.</strong> The whole value of reactivation is a warm conversation. An automated funnel that answers a warm reply with a link wastes the touch.</li>
      </ol>

      <h2>How to know if it worked</h2>

      <p>Log four things per campaign and compare against doing nothing: contacts reached, conversations held, jobs booked, and the revenue those jobs produced. Attribution matters — if a reactivated customer would have called you anyway next month, you have not found money, you have rescheduled it.</p>

      <p>The cleanest control is a hold-out: send to 80% of a segment, leave 20% alone for thirty days, and compare. If the hold-out produces as many jobs as the contacted group, your campaign did nothing. That is a cheap experiment and almost nobody runs it.</p>

      <h2>Where automation actually helps</h2>

      <p>Not in the message — you can write three good ones. In the consent check, the send window, the opt-out handling, the logging, and the routing of replies to a human quickly enough that the conversation is still warm. That is the part that <a href="/services">database reactivation</a> as a service covers, and it is the part people abandon when they try to run this manually.</p>`
  },
  {
    slug: 'voicemail-to-booked-job',
    title: 'From voicemail to booked job in 5 seconds',
    cat: 'Tactics',
    read: '3 min',
    lede: 'The mechanics of missed-call text-back, step by step, with the timings that matter and the two places implementations usually break.',
    desc: 'Missed-call text-back explained step by step: what happens in the five seconds after a call rings out, the timings that matter, and where implementations break.',
    body: `      <h2>The problem with voicemail</h2>

      <p>Voicemail asks the caller to do work. They have to decide whether to leave a message, choose what to say without knowing who will hear it, and then wait. Most do not. And when they do, you receive a message you usually cannot reach immediately anyway.</p>

      <p>Text-back inverts it. Instead of asking the caller to act, you send them a text while their phone is still in their hand.</p>

      <h2>The sequence, with timings</h2>

      <div class="table-scroll">

      <table class="compare compare--3col">
        <thead>
          <tr><th>When</th><th>What happens</th><th>Why the timing matters</th></tr>
        </thead>
        <tbody>
          <tr><td>0s</td><td>The call rings out, forward, or hits after-hours</td><td>Detected from the call event, not from a human noticing</td></tr>
          <tr><td>~2s</td><td>A text goes out: the business name, one question</td><td>The caller is still holding the phone. This is the whole window.</td></tr>
          <tr><td>On reply</td><td>The agent asks one qualifying question</td><td>One. Each extra question costs a reply.</td></tr>
          <tr><td>Same thread</td><td>A concrete slot is offered — "2–4pm tomorrow?"</td><td>A specific option converts; an open invitation does not</td></tr>
          <tr><td>On booking</td><td>Confirmation, address, and a reminder is set</td><td>Reminders are where no-show reduction actually happens</td></tr>
        </tbody>
      </table>
      </div>

      <p>Five seconds in, the conversation exists. By the time your competitor is listening to their voicemail, you are holding a thread.</p>

      <h2>Where implementations break</h2>

      <h3>1. The text arrives from a number the caller does not recognise</h3>

      <p>A text from a random long number, minutes after a call, reads as spam. The message has to establish who it is in the first four words: <em>"Smith Heating — you just rang us."</em> Without that, you have converted a lead into an opt-out.</p>

      <h3>2. The reply does not escalate</h3>

      <p>The most common failure is a text-back that opens a conversation nobody is watching. The caller replies with their address and their problem, gets silence, and calls someone else. Routing the reply to a person — or to an agent with the authority to book — is the part that determines whether this is a lead-capture tool or a lead-destruction tool.</p>

      <h2>What to check before you trust it</h2>

      <ul>
        <li><strong>Does it fire on every path?</strong> Rings out, busy, after-hours, voicemail — all four. Deployments that cover only "ring out" miss the busiest failure mode, which is after-hours.</li>
        <li><strong>What happens at 2am?</strong> A text is fine at any hour; it is the caller who decides when to read it. A <em>call</em> at 2am is not fine. Confirm which your setup does.</li>
        <li><strong>Is the opt-out honoured on the thread?</strong> When someone replies "stop", that has to write to the record immediately.</li>
        <li><strong>Can you prove it ran?</strong> You should be able to pull the log: call received at this time, text sent at this time, reply at this time, booking at this time.</li>
      </ul>

      <p>You can watch the behaviour on <a href="/">the demo on our home page</a>, and <a href="/demo">book 15 minutes</a> to test it against your own call log.</p>`
  }
];
