/**
 * Shield Construction LLC — Google Sheets Form Handler
 *
 * Setup:
 * 1. Create a new Google Sheet (e.g. "Shield Construction Leads")
 * 2. Extensions → Apps Script → paste this file → Save
 * 3. Set NOTIFY_EMAIL below to your alert inbox
 * 4. Run setupSheet() once (authorize when prompted)
 * 5. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Copy the Web App URL into js/config.js → GOOGLE_SCRIPT_URL
 * 7. After any script change: Deploy → Manage deployments → Edit → New version
 */

var SHEET_NAME = 'Leads';
var NOTIFY_EMAIL = 'contact@shield-cons.com';
var RATE_LIMIT_MINUTES = 10;

function setupSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Timestamp',
      'Form Type',
      'Name',
      'Phone',
      'Email',
      'Property Address',
      'Damage Type',
      'Insurance Company',
      'Message',
      'Source Page'
    ]);
    sheet.getRange(1, 1, 1, 10).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
}

function doPost(e) {
  try {
    var payload = {};
    if (e && e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    }

    if (payload.website && String(payload.website).trim()) {
      return jsonResponse_({ ok: true, skipped: 'honeypot' });
    }

    var sheet = getSheet_();

    if (isRateLimited_(payload, sheet)) {
      return jsonResponse_({
        ok: false,
        error: 'rate_limit',
        message: 'A request was already received recently. Please wait about ' + RATE_LIMIT_MINUTES + ' minutes or call us at (770) 558-5151.'
      });
    }

    sheet.appendRow([
      payload.timestamp || new Date().toISOString(),
      payload.formType || '',
      payload.name || '',
      payload.phone || '',
      payload.email || '',
      payload.propertyAddress || '',
      payload.damageType || '',
      payload.insuranceCompany || '',
      payload.message || '',
      payload.source || ''
    ]);

    try {
      sendNotificationEmail_(payload);
    } catch (mailErr) {
      // Row is saved; email failure should not block the visitor's submission.
      Logger.log('Notification email failed: ' + mailErr);
    }

    return jsonResponse_({ ok: true });
  } catch (err) {
    return jsonResponse_({ ok: false, error: String(err) });
  }
}

function doGet() {
  return jsonResponse_({
    ok: true,
    message: 'Shield Construction form endpoint is running.'
  });
}

function isRateLimited_(payload, sheet) {
  var phone = normalizePhone_(payload.phone);
  var email = String(payload.email || '').toLowerCase().trim();
  if (!phone && !email) return false;

  var rows = sheet.getDataRange().getValues();
  var cutoff = Date.now() - RATE_LIMIT_MINUTES * 60 * 1000;

  for (var i = rows.length - 1; i >= 1; i--) {
    var rowTime = new Date(rows[i][0]).getTime();
    if (isNaN(rowTime) || rowTime < cutoff) break;

    var rowPhone = normalizePhone_(rows[i][3]);
    var rowEmail = String(rows[i][4] || '').toLowerCase().trim();

    if (phone && rowPhone && phone === rowPhone) return true;
    if (email && rowEmail && email === rowEmail) return true;
  }

  return false;
}

function normalizePhone_(value) {
  return String(value || '').replace(/\D/g, '').slice(-10);
}

function sendNotificationEmail_(payload) {
  if (!NOTIFY_EMAIL) return;

  var formLabel = payload.formType === 'emergency-popup'
    ? 'Emergency Popup'
    : 'Request Inspection';

  var subject = '[Shield Construction] New ' + formLabel + ' — ' + (payload.name || 'Unknown');

  var lines = [
    'New website form submission',
    '',
    'Form: ' + formLabel,
    'Name: ' + (payload.name || ''),
    'Phone: ' + (payload.phone || ''),
    'Email: ' + (payload.email || ''),
    'Property Address: ' + (payload.propertyAddress || ''),
    'Damage Type: ' + (payload.damageType || ''),
    'Insurance Company: ' + (payload.insuranceCompany || ''),
    'Message: ' + (payload.message || ''),
    'Source Page: ' + (payload.source || ''),
    'Submitted: ' + (payload.timestamp || new Date().toISOString()),
    '',
    'Open your Google Sheet "Leads" tab for full history.'
  ];

  var options = {};
  if (payload.email) {
    options.replyTo = payload.email;
  }

  MailApp.sendEmail(NOTIFY_EMAIL, subject, lines.join('\n'), options);
}

/** Run once from Apps Script editor to authorize Gmail send permission. */
function testNotificationEmail() {
  sendNotificationEmail_({
    formType: 'request-inspection',
    name: 'Test User',
    phone: '(770) 555-0000',
    email: 'test@example.com',
    propertyAddress: '123 Test St',
    damageType: 'Storm',
    insuranceCompany: 'Test Insurance',
    message: 'This is a test notification from Apps Script.',
    source: 'manual-test',
    timestamp: new Date().toISOString()
  });
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    setupSheet();
    sheet = ss.getSheetByName(SHEET_NAME);
  }
  return sheet;
}

function jsonResponse_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
