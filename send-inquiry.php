<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

// Accept JSON or form-encoded.
$raw = file_get_contents('php://input');
$payload = [];

if (is_string($raw) && strlen(trim($raw)) > 0 && str_starts_with(ltrim($raw), '{')) {
    $decoded = json_decode($raw, true);
    if (is_array($decoded)) {
        $payload = $decoded;
    }
} else {
    $payload = $_POST;
}

function get_string(array $arr, string $key): string
{
    $val = $arr[$key] ?? '';
    if (is_array($val)) {
        return implode(', ', array_map('strval', $val));
    }
    return trim((string) $val);
}

function is_default_placeholder(string $value): bool
{
    $value = trim($value);
    if ($value === '') {
        return true;
    }

    // Matches the default template values in mail-config.php.
    if ($value === 'your-smtp-email@example.com') {
        return true;
    }
    if ($value === 'YOUR_APP_PASSWORD_HERE') {
        return true;
    }

    return false;
}

$inquiryType = get_string($payload, 'inquiry_type'); // quick | tour
$name = get_string($payload, 'name');
$email = get_string($payload, 'email');
$country = get_string($payload, 'country');
$whatsapp = get_string($payload, 'whatsapp');
$selectedTour = get_string($payload, 'tour');
$selectedPackage = get_string($payload, 'package');
$arrival = get_string($payload, 'arrival_date');
$departure = get_string($payload, 'departure_date');
$adults = get_string($payload, 'adults');
$children = get_string($payload, 'children');
$rooms = get_string($payload, 'rooms');
$hotelCategory = $payload['hotel_category'] ?? [];
$mealPlan = $payload['meal_plan'] ?? [];
$interest = $payload['interest'] ?? [];
$budget = get_string($payload, 'budget');
$message = get_string($payload, 'message');

if ($name === '' || $email === '') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Name and Email are required.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid email address.']);
    exit;
}

$subjectParts = [];
$subjectParts[] = 'New Inquiry';
if ($inquiryType !== '') $subjectParts[] = strtoupper($inquiryType);
if ($selectedPackage !== '') $subjectParts[] = $selectedPackage;
$subject = implode(' - ', $subjectParts);

$lines = [];
$lines[] = 'New inquiry received from JUCON TRAVELS website';
$lines[] = '';
$lines[] = 'Inquiry Type: ' . ($inquiryType !== '' ? $inquiryType : '');
$lines[] = 'Name: ' . $name;
$lines[] = 'Email: ' . $email;
if ($country !== '') $lines[] = 'Country: ' . $country;
if ($whatsapp !== '') $lines[] = 'WhatsApp: ' . $whatsapp;
if ($selectedTour !== '') $lines[] = 'Tour: ' . $selectedTour;
if ($selectedPackage !== '') $lines[] = 'Package: ' . $selectedPackage;
if ($arrival !== '') $lines[] = 'Arrival Date: ' . $arrival;
if ($departure !== '') $lines[] = 'Departure Date: ' . $departure;
if ($adults !== '') $lines[] = 'Adults: ' . $adults;
if ($children !== '') $lines[] = 'Children: ' . $children;
if ($rooms !== '') $lines[] = 'Rooms: ' . $rooms;

if (is_array($hotelCategory) && count($hotelCategory) > 0) {
    $lines[] = 'Hotel Category: ' . implode(', ', array_map('strval', $hotelCategory));
}
if (is_array($mealPlan) && count($mealPlan) > 0) {
    $lines[] = 'Meal Plan: ' . implode(', ', array_map('strval', $mealPlan));
}
if (is_array($interest) && count($interest) > 0) {
    $lines[] = 'Places of Interest: ' . implode(', ', array_map('strval', $interest));
}
if ($budget !== '') $lines[] = 'Budget: ' . $budget;

$lines[] = '';
$lines[] = 'Message / Queries:';
$lines[] = $message !== '' ? $message : '(none)';

$bodyText = implode("\n", $lines);

$configPath = __DIR__ . '/mail-config.php';
if (!file_exists($configPath)) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Mail config missing.']);
    exit;
}

$config = require $configPath;

$autoload = __DIR__ . '/vendor/autoload.php';
if (!file_exists($autoload)) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Mailer not installed. Run composer install.']);
    exit;
}

require_once $autoload;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

try {
    $mail = new PHPMailer(true);

    $mail->isSMTP();
    $mail->Host = (string)($config['smtp_host'] ?? '');
    $mail->Port = (int)($config['smtp_port'] ?? 587);
    $mail->SMTPAuth = true;
    $mail->Username = (string)($config['smtp_username'] ?? '');
    $mail->Password = (string)($config['smtp_password'] ?? '');

    $secure = (string)($config['smtp_secure'] ?? 'tls');
    if ($secure === 'ssl') {
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    } else {
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    }

    $fromEmail = (string)($config['from_email'] ?? '');
    $fromName = (string)($config['from_name'] ?? 'JUCON TRAVELS');
    $toEmail = (string)($config['to_email'] ?? '');
    $toName = (string)($config['to_name'] ?? 'Admin');

    // Convenience: if from_email is not set, fall back to the authenticated SMTP username.
    // For Gmail/most providers, the From must match the authenticated account anyway.
    if (trim($fromEmail) === '' && trim((string)$mail->Username) !== '') {
        $fromEmail = (string)$mail->Username;
    }

    $smtpConfigured = !(
        is_default_placeholder($fromEmail) ||
        is_default_placeholder($toEmail) ||
        is_default_placeholder($mail->Username) ||
        is_default_placeholder($mail->Password)
    );
    if (!$smtpConfigured) {
        // Fallback: try PHP mail() (may work on production hosting; often not configured on localhost).
        $fallbackTo = (string)($config['to_email'] ?? '');
        if ($fallbackTo === '') {
            http_response_code(500);
            echo json_encode(['ok' => false, 'error' => 'Email recipient is not configured (mail-config.php).']);
            exit;
        }

        $headers = [];
        if ($fromEmail !== '') {
            $headers[] = 'From: ' . $fromName . ' <' . $fromEmail . '>';
        }
        $headers[] = 'Reply-To: ' . $name . ' <' . $email . '>';
        $headers[] = 'Content-Type: text/plain; charset=UTF-8';

        $ok = @mail($fallbackTo, $subject, $bodyText, implode("\r\n", $headers));
        if ($ok) {
            echo json_encode(['ok' => true, 'sent_via' => 'mail()']);
        } else {
            http_response_code(500);
            echo json_encode([
                'ok' => false,
                'error' => 'SMTP is not configured yet (mail-config.php). Add your SMTP username + app password, then try again.'
            ]);
        }
        exit;
    }

    // Option 3 (requested): make the email appear "from" the customer.
    // NOTE: Many SMTP providers (including Gmail) may reject this unless the account is allowed
    // to send-as that address/alias. If it fails, revert to using $fromEmail as From.
    $mail->setFrom($email, $name, false);
    // Keep the envelope sender aligned with the authenticated account (bounces/Return-Path).
    $mail->Sender = $fromEmail;
    $mail->addAddress($toEmail, $toName);

    // So the admin can reply directly to the customer.
    $mail->addReplyTo($email, $name);

    $mail->Subject = $subject;
    $mail->Body = $bodyText;

    $mail->send();

    echo json_encode(['ok' => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => $e->getMessage()]);
}
