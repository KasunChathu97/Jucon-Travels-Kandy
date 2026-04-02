<?php

// SMTP configuration for inquiry emails.
// IMPORTANT:
// - Set these values before testing.
// - If using Gmail, you must use a Google "App Password" (not your normal password).
// - The "from" address should normally match the authenticated SMTP account.

return [
    'to_email' => 'jucontravels@gmail.com',
    'to_name' => 'JUCON TRAVELS Admin',

    // Sender identity shown in the email.
    // Put the email address of your SMTP account here.
    'from_email' => 'jucontravels@gmail.com',
    'from_name' => 'JUCON TRAVELS',

    // SMTP server settings
    'smtp_host' => 'smtp.gmail.com',
    'smtp_port' => 587,
    'smtp_secure' => 'tls', // 'tls' or 'ssl'
    // For Gmail: use your full Gmail address and a Google App Password.
    'smtp_username' => 'jucontravels@gmail.com',
    'smtp_password' => 'jwupeyicisxunhdf',
];
