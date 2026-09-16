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
 * Configure in Vercel → Project → Settings → Environment Variables:
 *   RESEND_API_KEY   required for delivery (any HTTP mail API works, see below)
 *   LEAD_TO_EMAIL    where leads land              (default hello@hazirminds.ai)
 *   LEAD_FROM_EMAIL  verified sender               (default Resend onboarding sender)
 */

const MAX = 2000;

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
