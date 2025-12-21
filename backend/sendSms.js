// backend/sendSms.js
// Utility to send SMS using Twilio
const twilio = require('twilio');
require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

let client = null;
if (accountSid && authToken) {
  client = twilio(accountSid, authToken);
}

async function sendSms(to, body) {
  if (!client) {
    console.log('Twilio credentials not set. Skipping SMS.');
    console.log(`Would send SMS to ${to}: ${body}`);
    return Promise.resolve();
  }
  return client.messages.create({
    body,
    from: fromNumber,
    to
  });
}

module.exports = sendSms;
