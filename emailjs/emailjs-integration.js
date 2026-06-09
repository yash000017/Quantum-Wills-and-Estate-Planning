/**
 * Quantum Wills — EmailJS integration reference
 * ==============================================
 * This file mirrors the logic in index.html. The live site uses the
 * inline script in index.html — update EMAILJS_CONFIG there after setup.
 *
 * Template HTML files:
 *   emailjs/booking-template.html  → Book a Meeting form
 *   emailjs/contact-template.html  → Contact form
 */

// Config lives in emailjs-config.js — keep in sync when testing this file standalone
const EMAILJS_CONFIG = {
  serviceId: 'service_6a6sni2',
  publicKey: 'ziCqBvPC-MPUfeoyY',
  templates: {
    booking: 'template_iytk4bb',
    contact: 'template_j8k4awq'
  }
};

function isEmailJsConfigured() {
  const c = EMAILJS_CONFIG;
  return c.serviceId?.startsWith('service_')
    && c.publicKey?.length > 10
    && c.templates.booking?.startsWith('template_')
    && c.templates.contact?.startsWith('template_');
}

emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });

const EMAILJS_FALLBACK =
  'Could not send your request. Please email us at quantum-wills@gmail.com or call 01442 816 817.';

function showFormSuccess(btn, note, successId) {
  btn.style.display = 'none';
  if (note) note.style.display = 'none';
  document.getElementById(successId).classList.add('visible');
}

async function sendViaEmailJs(templateKey, params, { btn, note, successId, btnText }) {
  btn.disabled = true;
  btn.textContent = 'Sending…';

  if (!isEmailJsConfigured()) {
    console.log('EmailJS not configured — demo mode:', params);
    showFormSuccess(btn, note, successId);
    return;
  }

  try {
    await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templates[templateKey], params);
    showFormSuccess(btn, note, successId);
  } catch (err) {
    console.error('EmailJS error:', err);
    btn.disabled = false;
    btn.textContent = btnText;
    alert(EMAILJS_FALLBACK);
  }
}

/** Contact form — template variables: client_name, client_email, client_phone, topic, message */
async function submitContact() {
  const fname   = document.getElementById('ct-fname').value.trim();
  const lname   = document.getElementById('ct-lname').value.trim();
  const email   = document.getElementById('ct-email').value.trim();
  const phone   = document.getElementById('ct-phone').value.trim();
  const topic   = document.getElementById('ct-topic').value;
  const message = document.getElementById('ct-message').value.trim();

  if (!fname || !email) {
    alert('Please fill in at least your first name and email address.');
    return;
  }
  if (!message) {
    alert('Please enter a message so we know how to help.');
    return;
  }

  await sendViaEmailJs('contact', {
    client_name:  (fname + ' ' + lname).trim(),
    client_email: email,
    client_phone: phone || 'Not provided',
    topic:        topic || 'General Enquiry',
    message:      message,
    to_email:     'quantum-wills@gmail.com'
  }, {
    btn:       document.getElementById('ct-submit-btn'),
    note:      document.getElementById('ct-form-note'),
    successId: 'contact-success',
    btnText:   'Send Message'
  });
}

/** Booking form — template variables: client_name, client_email, client_phone, service, meeting_format, preferred_datetime, notes */
async function submitBooking() {
  const fname    = document.getElementById('bk-fname').value.trim();
  const lname    = document.getElementById('bk-lname').value.trim();
  const email    = document.getElementById('bk-email').value.trim();
  const phone    = document.getElementById('bk-phone').value.trim();
  const service  = document.getElementById('bk-service').value;
  const format   = document.getElementById('bk-format').value;
  const datetime = document.getElementById('bk-datetime').value.trim();
  const notes    = document.getElementById('bk-notes').value.trim();

  if (!fname || !email) {
    alert('Please fill in at least your first name and email address.');
    return;
  }

  await sendViaEmailJs('booking', {
    client_name:        (fname + ' ' + lname).trim(),
    client_email:       email,
    client_phone:       phone || 'Not provided',
    service:            service || 'Not specified',
    meeting_format:     format || 'No preference',
    preferred_datetime: datetime || 'Not specified',
    notes:              notes || 'None',
    to_email:           'quantum-wills@gmail.com'
  }, {
    btn:       document.getElementById('bk-submit-btn'),
    note:      document.getElementById('bk-form-note'),
    successId: 'book-success',
    btnText:   'Request Consultation'
  });
}
