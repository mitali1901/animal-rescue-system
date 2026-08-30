import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

/**
 * Configure and return Nodemailer transporter
 * Strictly uses EMAIL_USER + EMAIL_PASS (Gmail App Password) or SMTP settings
 */
export async function getTransporter() {
  dotenv.config(); // Reload .env values

  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  // Check if real Gmail credentials are provided
  if (
    emailUser &&
    emailPass &&
    emailUser !== 'your_email@gmail.com' &&
    emailPass !== 'your_gmail_app_password' &&
    !emailUser.includes('example.com')
  ) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser.trim(),
        pass: emailPass.trim().replace(/\s+/g, '') // remove spaces from 16-char app password if any
      }
    });

    // Verify SMTP connection
    await transporter.verify();
    console.log(`✅ Nodemailer connected successfully to Gmail account: ${emailUser}`);
    return transporter;
  }

  // Check if custom SMTP is provided
  if (
    process.env.SMTP_USER &&
    process.env.SMTP_PASS &&
    process.env.SMTP_USER !== 'demo.rescue.volunteer@ethereal.email' &&
    process.env.SMTP_USER !== 'your_email@gmail.com'
  ) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER.trim(),
        pass: process.env.SMTP_PASS.trim()
      }
    });
    await transporter.verify();
    return transporter;
  }

  // If credentials are still placeholders, throw explicit error so the user knows
  throw new Error(
    'Real Gmail credentials are not configured. Please open backend/.env and replace placeholders with your real EMAIL_USER, EMAIL_PASS (Gmail App Password), and ADMIN_EMAIL.'
  );
}

/**
 * Send Adoption Request Email to ADMIN_EMAIL using Nodemailer
 * @param {Object} data - Contains petName, applicantName, phone, email, housingType, hasOtherPets, message
 */
export async function sendAdoptionRequestEmail(data) {
  dotenv.config();

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail || adminEmail === 'your_admin_email@gmail.com') {
    throw new Error('ADMIN_EMAIL is not configured in backend/.env. Please set your real receiving email address.');
  }

  const mailer = await getTransporter();
  const senderEmail = process.env.EMAIL_USER;

  const subject = `New Adoption Request: ${data.petName || 'Rescued Pet'}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #FAF6F0; margin: 0; padding: 24px; color: #2B2D42; }
        .card { background: #FFFFFF; max-width: 600px; margin: 0 auto; border-radius: 20px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.08); border: 2px solid #B7E4C7; }
        .header { background: linear-gradient(135deg, #D8F3DC 0%, #B7E4C7 100%); padding: 30px 24px; text-align: center; }
        .header h1 { margin: 0; color: #1B4332; font-size: 24px; }
        .header p { margin: 6px 0 0 0; color: #2D6A4F; font-size: 14px; font-weight: 600; }
        .content { padding: 28px 24px; }
        .badge { display: inline-block; background: #D8F3DC; color: #1B4332; font-weight: bold; padding: 6px 16px; border-radius: 20px; font-size: 13px; margin-bottom: 16px; }
        .field-group { margin-bottom: 16px; }
        .label { font-size: 12px; font-weight: bold; color: #8D99AE; text-transform: uppercase; margin-bottom: 4px; }
        .value { font-size: 15px; color: #2B2D42; font-weight: 500; }
        .message-box { background: #FAF6F0; border-left: 4px solid #52B788; padding: 14px 18px; border-radius: 12px; margin: 18px 0; }
        .footer { background: #FAF6F0; padding: 16px; text-align: center; font-size: 12px; color: #8D99AE; border-top: 1px solid #EAEAEA; }
      </style>
    </head>
    <body>
      <div class="card">
        
        <div class="header">
          <div style="font-size: 36px; margin-bottom: 6px;">🐾</div>
          <h1>New Adoption Request: ${data.petName || 'Rescued Pet'}</h1>
          <p>PawsCare Animal Adoption Program</p>
        </div>

        <div class="content">
          <div>
            <span class="badge">Target Pet: 🐶🐱 ${data.petName || 'Rescued Pet'}</span>
          </div>

          <div class="field-group">
            <div class="label">Applicant Full Name:</div>
            <div class="value" style="font-size: 17px; font-weight: 700; color: #1B4332;">${data.applicantName}</div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
            <div class="field-group">
              <div class="label">Email Address:</div>
              <div class="value">✉️ <a href="mailto:${data.email}" style="color: #2D6A4F; text-decoration: none; font-weight: 700;">${data.email}</a></div>
            </div>

            <div class="field-group">
              <div class="label">Phone Number:</div>
              <div class="value">📞 <strong>${data.phone}</strong></div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
            <div class="field-group">
              <div class="label">Housing Type:</div>
              <div class="value">🏡 ${data.housingType || 'Apartment / House'}</div>
            </div>

            <div class="field-group">
              <div class="label">Currently Has Pets:</div>
              <div class="value">🐾 ${data.hasOtherPets || 'No'}</div>
            </div>
          </div>

          <div class="message-box">
            <div class="label" style="color: #2D6A4F;">Why would you be a great match for ${data.petName || 'this pet'}?</div>
            <div class="value" style="margin-top: 6px; font-style: italic; line-height: 1.5;">
              "${data.message || 'No additional message provided.'}"
            </div>
          </div>

          <div class="field-group">
            <div class="label">Submission Date & Time:</div>
            <div class="value" style="font-size: 13px; color: #5C677D;">
              🗓️ ${new Date().toLocaleString()}
            </div>
          </div>
        </div>

        <div class="footer">
          This adoption request was automatically dispatched from the PawsCare Portal to <strong>${adminEmail}</strong>.
        </div>

      </div>
    </body>
    </html>
  `;

  const info = await mailer.sendMail({
    from: `"PawsCare Adoption Portal" <${senderEmail}>`,
    to: adminEmail,
    subject: subject,
    html: htmlContent
  });

  console.log(`✅ Real Adoption Request email delivered to ${adminEmail}! MessageId: ${info.messageId}`);

  return {
    success: true,
    messageId: info.messageId,
    recipient: adminEmail
  };
}

export const sendAdoptionApplicationEmail = sendAdoptionRequestEmail;

/**
 * Send Rescue Report Email
 */
export async function sendRescueReportEmail(report) {
  const mailer = await getTransporter();
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@animalrescue.org';
  const senderEmail = process.env.EMAIL_USER && process.env.EMAIL_USER !== 'your_email@gmail.com'
    ? process.env.EMAIL_USER
    : (process.env.SMTP_FROM || 'alerts@pawsrescue.org');

  const subject = `🚨 [NEW INJURED ANIMAL REPORT] ${report.animalType} — ${report.title} (#${report.id})`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial; padding: 20px; background: #FAF6F0;">
      <div style="background: #FFF; padding: 24px; border-radius: 16px; max-width: 550px; margin: auto; border: 2px solid #FFCAD4;">
        <h2 style="color: #7A3B2E;">🐾 Injured Animal Report (#${report.id})</h2>
        <p><strong>Type:</strong> ${report.animalType} (${report.breed || 'Unknown'})</p>
        <p><strong>Severity:</strong> ${report.severity}</p>
        <p><strong>Summary:</strong> ${report.title}</p>
        <p><strong>Location:</strong> ${report.locationName}</p>
        <p><strong>Description:</strong> ${report.description}</p>
        <p><strong>Reporter:</strong> ${report.reporterName || 'Anonymous'} (${report.contactPhone || 'No Phone'}, ${report.reporterEmail || 'No Email'})</p>
      </div>
    </body>
    </html>
  `;

  try {
    const info = await mailer.sendMail({
      from: `"PawsCare Rescue Alert" <${senderEmail}>`,
      to: adminEmail,
      subject: subject,
      html: htmlContent
    });
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.warn(`Email send error: ${err.message}`);
    return { success: false, note: err.message };
  }
}
