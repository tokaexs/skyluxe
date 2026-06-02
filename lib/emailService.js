const nodemailer = require('nodemailer');

// Initialize Nodemailer SMTP transporter
// Defaults to standard Ethereal mock smtp for safe local sandbox runs
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || 'mock.user@ethereal.email',
    pass: process.env.SMTP_PASS || 'mockPass123'
  }
});

/**
 * Send commercial/private flight booking confirmation email
 */
async function sendBookingConfirmationEmail(email, name, pnr, origin, destination, amount) {
  const mailOptions = {
    from: `"SkyLuxe Concierge" <noreply@skyluxe.com>`,
    to: email,
    subject: `SkyLuxe Flight Manifest Confirmed: ${pnr}`,
    html: `
      <div style="background-color: #020202; color: #ffffff; padding: 40px; font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #D4AF37;">
        <h2 style="color: #D4AF37; font-family: serif; border-bottom: 1px solid #D4AF37; padding-bottom: 20px; font-size: 24px; letter-spacing: 2px; text-align: center;">S K Y L U X E</h2>
        
        <p>Dear ${name},</p>
        <p>Your luxury flight segment has been secured and logged in our operations manifest. Below are your booking references:</p>
        
        <div style="background-color: #111; padding: 20px; border-radius: 10px; margin: 30px 0; border: 1px solid #222;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="color: #888; padding: 8px 0;">Booking PNR:</td>
              <td style="text-align: right; color: #D4AF37; font-weight: bold;">${pnr}</td>
            </tr>
            <tr>
              <td style="color: #888; padding: 8px 0;">Departure Hub:</td>
              <td style="text-align: right; color: #fff;">${origin}</td>
            </tr>
            <tr>
              <td style="color: #888; padding: 8px 0;">Arrival Hub:</td>
              <td style="text-align: right; color: #fff;">${destination}</td>
            </tr>
            <tr>
              <td style="color: #888; padding: 8px 0;">Total Settlement:</td>
              <td style="text-align: right; color: #fff;">$${amount.toLocaleString()} USD</td>
            </tr>
          </table>
        </div>
        
        <p>Your digital boarding pass, FBO lounge instructions, and tax statements have been synced to your Executive Dashboard.</p>
        
        <p style="margin-top: 40px; color: #666; font-size: 11px; text-align: center; border-top: 1px solid #222; padding-top: 20px;">
          This is an automated operational notification. For special requests, connect with your concierge team inside your SkyLuxe dashboard.
        </p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Booking confirmation email dispatched. Preview URL: ${nodemailer.getTestMessageUrl(info) || 'Local SMTP'}`);
  } catch (error) {
    console.warn('Booking email dispatch skipped (SMTP connection not active):', error.message);
  }
}

/**
 * Send general payment success email
 */
async function sendPaymentSuccessEmail(email, name, amount, paymentId) {
  const mailOptions = {
    from: `"SkyLuxe Billing" <billing@skyluxe.com>`,
    to: email,
    subject: `SkyLuxe FBO Account Settlement Credit: $${amount}`,
    html: `
      <div style="background-color: #020202; color: #ffffff; padding: 40px; font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #D4AF37;">
        <h2 style="color: #D4AF37; font-family: serif; border-bottom: 1px solid #D4AF37; padding-bottom: 20px; font-size: 24px; letter-spacing: 2px; text-align: center;">S K Y L U X E</h2>
        
        <p>Dear ${name},</p>
        <p>We confirm a successful payment settlement. Your flight wallet account has been credited.</p>
        
        <div style="background-color: #111; padding: 20px; border-radius: 10px; margin: 30px 0; border: 1px solid #222;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="color: #888; padding: 8px 0;">Transaction ID:</td>
              <td style="text-align: right; color: #fff;">${paymentId}</td>
            </tr>
            <tr>
              <td style="color: #888; padding: 8px 0;">Amount Credited:</td>
              <td style="text-align: right; color: #D4AF37; font-weight: bold;">$${amount.toLocaleString()} USD</td>
            </tr>
            <tr>
              <td style="color: #888; padding: 8px 0;">Status:</td>
              <td style="text-align: right; color: #22c55e;">Settle Success</td>
            </tr>
          </table>
        </div>
        
        <p>You can use this balance to book private charters, commercial flights, or add premium concierge upgrades.</p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Payment email dispatched. Preview URL: ${nodemailer.getTestMessageUrl(info) || 'Local SMTP'}`);
  } catch (error) {
    console.warn('Payment email dispatch skipped:', error.message);
  }
}

/**
 * Send membership tier upgrade activation email
 */
async function sendMembershipActivationEmail(email, name, tier, amount) {
  const mailOptions = {
    from: `"SkyLuxe Sovereignty" <membership@skyluxe.com>`,
    to: email,
    subject: `SkyLuxe Elite Privilege Activated: ${tier.toUpperCase()}`,
    html: `
      <div style="background-color: #020202; color: #ffffff; padding: 40px; font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #D4AF37;">
        <h2 style="color: #D4AF37; font-family: serif; border-bottom: 1px solid #D4AF37; padding-bottom: 20px; font-size: 24px; letter-spacing: 2px; text-align: center;">S K Y L U X E</h2>
        
        <p>Dear ${name},</p>
        <p>Welcome to the sovereign circle. Your <strong>SkyLuxe ${tier.replace('_', ' ').toUpperCase()}</strong> subscription tier is active.</p>
        
        <div style="background-color: #111; padding: 20px; border-radius: 10px; margin: 30px 0; border: 1px solid #222;">
          <p style="color: #D4AF37; font-weight: bold; margin-bottom: 10px;">Elite Benefits Unlocked:</p>
          <ul style="font-size: 13px; line-height: 1.6; color: #ccc; padding-left: 20px;">
            <li>Guaranteed private jet dispatch capabilities</li>
            <li>VIP terminal FBO access and security clearance</li>
            <li>Michelin-grade dining selections on all charter flights</li>
            <li>Premium partner lounge upgrades and custom ground logistics</li>
          </ul>
        </div>
        
        <p>Your subscription statement has been processed. We wish you pleasant travels across our networks.</p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Membership email dispatched. Preview URL: ${nodemailer.getTestMessageUrl(info) || 'Local SMTP'}`);
  } catch (error) {
    console.warn('Membership email dispatch skipped:', error.message);
  }
}

module.exports = {
  sendBookingConfirmationEmail,
  sendPaymentSuccessEmail,
  sendMembershipActivationEmail
};
