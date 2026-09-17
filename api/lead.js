/* POST /api/lead — the only path by which a lead can leave this site.
 *
 * The forms on /demo and the home-page audit block previously called
 * preventDefault(), showed a "you're in — check your inbox" panel and sent the
 * data nowhere. This endpoint makes that promise true.
 *
 * It fails closed: it reports ok:true only after the mail API has accepted the
 * message. If no credentials are configured it returns 503 and the client shows
 * an error with a prefilled mailto link, so a lead is never silently dropped.
 *
 * Zero npm dependencies — uses the runtime's global fetch and Resend's HTTP API.
 *
 * Responses:
 *   200  {"ok":true}                        accepted by the mail API
 *   400  {"ok":false,"error":"invalid_input"}
 *   405  {"ok":false,"error":"method_not_allowed"}
 *   429  {"ok":false,"error":"too_many_requests","retry_after":N}
 *   502  {"ok":false,"error":"send_failed"}
 *   503  {"ok":false,"error":"not_configured"}
 *
 * Configure in Vercel → Project → Settings → Environment Variables:
 *   RESEND_API_KEY   required for delivery (any HTTP mail API works, see below)
 *   LEAD_TO_EMAIL    where leads land              (default hello@hazirminds.ai)
 *   LEAD_FROM_EMAIL  verified sender               (default Resend onboarding sender)
 */

const MAX = 2000;

/* ---- best-effort throttle -----------------------------------------------------------------
   Vercel runs this in short-lived instances, so this map lives per instance and a cold start
   forgets it. It is not a firewall; it stops one client hammering the form in a burst, which is
   the realistic case for a marketing site. Two limits, both per IP:
     · MIN_GAP_MS floor between two consecutive submissions
     · MAX_HITS submissions inside WINDOW_MS
   Heavier protection belongs in front of the function (Vercel Firewall, Cloudflare). */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 5;
const MIN_GAP_MS = 15000;
const HITS = new Map();

function ipOf(req) {
  const fwd = req.headers['x-forwarded-for'];
  const first = (Array.isArray(fwd) ? fwd[0] : String(fwd || '')).split(',')[0].trim();
  return first || (req.socket && req.socket.remoteAddress) || 'unknown';
}

/* returns 0 when allowed, otherwise the number of seconds to wait */
function throttle(ip) {
  const now = Date.now();
  if (HITS.size > 5000) HITS.clear(); /* never let the map grow without bound */
  const seen = (HITS.get(ip) || []).filter(function (t) { return now - t < WINDOW_MS; });
  HITS.set(ip, seen);
  if (seen.length >= MAX_HITS) {
    return Math.max(1, Math.ceil((WINDOW_MS - (now - seen[0])) / 1000));
  }
  const last = seen[seen.length - 1];
  if (last && now - last < MIN_GAP_MS) {
    return Math.max(1, Math.ceil((MIN_GAP_MS - (now - last)) / 1000));
  }
  seen.push(now);
  return 0;
}

function clean(v) {
  return String(v == null ? '' : v).replace(/[\u0000-\u001f\u007f]/g, ' ').slice(0, MAX).trim();
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = null; }
  }
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ ok: false, error: 'invalid_body' });
  }

  const lead = {
    form: clean(body.form) || 'form',
    page: clean(body.page),
    name: clean(body.name),
    email: clean(body.email),
    company: clean(body.company),
    phone: clean(body.phone),
    industry: clean(body.industry),
    size: clean(body.size),
    notes: clean(body.notes)
  };

  const missing = ['name', 'email'].filter(function (k) { return !lead[k]; });
  if (missing.length || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(lead.email)) {
    return res.status(400).json({ ok: false, error: 'invalid_input', missing: missing });
  }

  /* Throttle after validation: a malformed POST is cheap to answer and must not spend a real
     visitor's budget. */
  const retryAfter = throttle(ipOf(req));
  if (retryAfter) {
    res.setHeader('Retry-After', String(retryAfter));
    return res.status(429).json({ ok: false, error: 'too_many_requests', retry_after: retryAfter });
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_TO_EMAIL || 'hello@hazirminds.ai';
  const from = process.env.LEAD_FROM_EMAIL || 'HazirMinds Leads <onboarding@resend.dev>';

  // Always leave a trace in the function logs, so a missing key degrades to
  // "recoverable from logs" rather than "silently lost".
  console.log('LEAD ' + JSON.stringify(Object.assign({ received_at: new Date().toISOString() }, lead)));

  if (!key) {
    console.error('lead_not_delivered: RESEND_API_KEY is not set');
    return res.status(503).json({ ok: false, error: 'not_configured' });
  }

  const lines = [
    'New ' + lead.form + ' lead',
    '',
    'Name:     ' + lead.name,
    'Email:    ' + lead.email,
    'Company:  ' + lead.company,
    'Phone:    ' + lead.phone,
    'Industry: ' + lead.industry,
    'Team:     ' + lead.size,
    'Page:     ' + lead.page,
    '',
    'Notes:',
    lead.notes || '(none)'
  ];

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: from,
        to: [to],
        reply_to: lead.email,
        subject: '[' + lead.form + '] ' + lead.name + (lead.company ? ' — ' + lead.company : ''),
        text: lines.join('\n')
      })
    });
    const data = await r.json().catch(function () { return {}; });

    if (!r.ok) {
      console.error('lead_send_failed ' + r.status + ' ' + JSON.stringify(data).slice(0, 400));
      return res.status(502).json({ ok: false, error: 'send_failed' });
    }
    return res.status(200).json({ ok: true, id: data.id || null });
  } catch (e) {
    console.error('lead_send_threw ' + (e && e.message));
    return res.status(502).json({ ok: false, error: 'send_failed' });
  }
};
