<?php
/**
 * Copy this file to api/config.php and fill in the two values, then it is live.
 *
 *   cp api/config.sample.php api/config.php
 *
 * api/config.php is gitignored on purpose — it holds your destination address, and nothing in
 * this repository should carry a real inbox. Until it exists, POST /api/lead.php answers
 * 503 not_configured and the form shows its "that didn't send" panel with a prefilled mailto,
 * so a lead is never silently swallowed.
 *
 * Both addresses MUST be on your own domain. Gmail/Yahoo/Outlook addresses in the From line are
 * rejected or spam-foldered by most receivers because SPF and DKIM will not align.
 */

return [
    // Where leads are delivered.
    'to'   => 'contact@hazirminds.ai',

    // The envelope + From address. Must be a mailbox that exists on this domain, e.g.
    // contact@hazirminds.ai — create it in cPanel → Email Accounts.
    'from' => 'contact@hazirminds.ai',
];
