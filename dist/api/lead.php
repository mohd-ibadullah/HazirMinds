<?php
/**
 * HazirMinds — lead intake endpoint (PHP / cPanel shared hosting).
 *
 * This is the shared-hosting counterpart to api/lead.js. Both speak the same contract, so the
 * front end never needs to know which host it is running on:
 *
 *   405  {"ok":false,"error":"method_not_allowed"}   non-POST
 *   400  {"ok":false,"error":"invalid_input",...}    missing/invalid fields
 *   503  {"ok":false,"error":"not_configured"}       api/config.php not filled in
 *   200  {"ok":true}                                 accepted and delivered
 *
 * The form's success panel is driven by this response — nothing is shown optimistically, and a
 * failure hands the visitor a prefilled mailto instead of silently swallowing the lead.
 *
 * Configuration lives in api/config.php (never committed). See api/config.sample.php.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

/** Reply and stop. */
function respond(int $status, array $body): void
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

/* ---------- 1. method ---------- */
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, ['ok' => false, 'error' => 'method_not_allowed']);
}

/* ---------- 2. configuration ---------- */
$configPath = __DIR__ . '/config.php';
if (!is_readable($configPath)) {
    respond(503, ['ok' => false, 'error' => 'not_configured']);
}
$config = require $configPath;
if (!is_array($config) || empty($config['to']) || empty($config['from'])) {
    respond(503, ['ok' => false, 'error' => 'not_configured']);
}

/* ---------- 3. input ---------- */
$raw = file_get_contents('php://input');
if ($raw === false || $raw === '') {
    respond(400, ['ok' => false, 'error' => 'invalid_input', 'fields' => ['body' => 'empty']]);
}
if (strlen($raw) > 20000) {
    respond(400, ['ok' => false, 'error' => 'invalid_input', 'fields' => ['body' => 'too_large']]);
}

$in = json_decode($raw, true);
if (!is_array($in)) {
    respond(400, ['ok' => false, 'error' => 'invalid_input', 'fields' => ['body' => 'malformed_json']]);
}

/** Trim + strip control characters (header-injection defence for anything that reaches a header). */
$clean = static function ($v): string {
    if (!is_scalar($v)) {
        return '';
    }
    $v = str_replace(["\r", "\n", "\0"], ' ', (string) $v);
    return trim(preg_replace('/[[:cntrl:]]/', '', $v) ?? '');
};

$fields = [
    'name'     => $clean($in['name']     ?? ''),
    'email'    => $clean($in['email']    ?? ''),
    'company'  => $clean($in['company']  ?? ''),
    'phone'    => $clean($in['phone']    ?? ''),
    'industry' => $clean($in['industry'] ?? ''),
    'size'     => $clean($in['size']     ?? ''),
    'notes'    => $clean($in['notes']    ?? ''),
    'form'     => $clean($in['form']     ?? 'form'),
    'page'     => $clean($in['page']     ?? ''),
];

$errors = [];
if ($fields['name'] === '') {
    $errors['name'] = 'required';
}
if ($fields['email'] === '' || !filter_var($fields['email'], FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'invalid';
}
if ($errors) {
    respond(400, ['ok' => false, 'error' => 'invalid_input', 'fields' => $errors]);
}

/* Cheap flood guard: one submission per 20 seconds per IP. Deliberately simple — a shared host
   has no Redis, and dropping a legitimate lead is worse than accepting a duplicate. */
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$throttleFile = sys_get_temp_dir() . '/hm_lead_' . md5($ip);
if (is_readable($throttleFile) && (time() - (int) file_get_contents($throttleFile)) < 20) {
    respond(429, ['ok' => false, 'error' => 'too_many_requests']);
}
@file_put_contents($throttleFile, (string) time(), LOCK_EX);

/* ---------- 4. deliver ---------- */
$subject = sprintf(
    '[HazirMinds] %s — %s',
    $fields['form'] === 'audit-form' ? 'Governance Report Card request' : 'Demo request',
    $fields['company'] !== '' ? $fields['company'] : $fields['name']
);

$lines = [];
foreach ($fields as $k => $v) {
    if ($v !== '') {
        $lines[] = ucfirst($k) . ': ' . $v;
    }
}
$lines[] = '---';
$lines[] = 'Received: ' . gmdate('Y-m-d H:i:s') . ' UTC';
$lines[] = 'IP: ' . $ip;
$body = implode("\n", $lines);

$fromDomain = parse_url('https://' . ($_SERVER['HTTP_HOST'] ?? 'hazirminds.ai'), PHP_URL_HOST);
$headers = [
    'From: ' . $config['from'],
    'Reply-To: ' . $fields['email'],
    'Content-Type: text/plain; charset=utf-8',
    'X-Mailer: hazirminds-site',
    'Message-ID: <' . bin2hex(random_bytes(12)) . '@' . $fromDomain . '>',
];

$sent = @mail(
    $config['to'],
    '=?UTF-8?B?' . base64_encode($subject) . '?=',
    $body,
    implode("\r\n", $headers),
    '-f' . $config['from']
);

/* Always keep a local record — mail() can be silently dropped by a shared host, and a lead that
   exists only in a mail queue is a lead that can be lost. api/.htaccess denies direct access. */
$log = __DIR__ . '/leads.log';
$entry = [
    'at'     => gmdate('c'),
    'sent'   => (bool) $sent,
    'ip'     => $ip,
    'fields' => $fields,
];
@file_put_contents($log, json_encode($entry, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . "\n", FILE_APPEND | LOCK_EX);

if (!$sent) {
    respond(502, ['ok' => false, 'error' => 'delivery_failed']);
}

respond(200, ['ok' => true]);
