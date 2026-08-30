import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

/**
 * Configure and return Nodemailer transporter
 * Supports Gmail App Password (EMAIL_USER + EMAIL_PASS) or custom SMTP credentials
 */
export async function getTransporter() {
  dotenv.config();

  const emailUser = (process.env.EMAIL_USER || '').trim();
  const emailPass = (process.env.EMAIL_PASS || '').trim().replace(/\s+/g, '');
  const smtpHost = (process.env.SMTP_HOST || '').trim();
  const smtpUser = (process.env.SMTP_USER || '').trim();
  const smtpPass = (process.env.SMTP_PASS || '').trim();

  // 1. Gmail configuration via EMAIL_USER & EMAIL_PASS
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
        user: emailUser,
        pass: emailPass
      }
    });

    try {
      await transporter.verify();
      return transporter;
    } catch (authErr) {
      throw new Error(
        `Gmail Authentication Failed for ${emailUser} (${authErr.message}). Ensure you are using a 16-character Google App Password with 2-Step Verification enabled.`
      );
    }
  }

  // 2. Custom SMTP provider configuration
  if (
    smtpHost &&
    (smtpUser || emailUser) &&
    (smtpPass || emailPass) &&
    smtpUser !== 'your_email@gmail.com'
  ) {
    const activeUser = smtpUser || emailUser;
    const activePass = smtpPass || emailPass;

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
      auth: {
        user: activeUser,
        pass: activePass
      }
    });

    try {
      await transporter.verify();
      return transporter;
    } catch (authErr) {
      throw new Error(`SMTP connection failed for ${smtpHost}: ${authErr.message}`);
    }
  }

  throw new Error(
    'Sender email credentials are missing. Please open backend/.env and configure EMAIL_USER and EMAIL_PASS (Gmail 16-character App Password).'
  );
}

/**
 * Send 6-Digit Email Verification OTP
 * @param {string} email
 * @param {string} fullName
 * @param {string} otp
 */
export async function sendVerificationOtpEmail(email, fullName, otp) {
  const mailer = await getTransporter();
  const senderEmail = process.env.EMAIL_USER || 'auth@pawsrescue.org';
  const subject = `Your PawsCare Verification Code: ${otp} 🐾`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #FAF6F0; margin: 0; padding: 24px; color: #2B2D42; }
        .card { background: #FFFFFF; max-width: 540px; margin: 0 auto; border-radius: 20px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.08); border: 2px solid #FFCAD4; }
        .header { background: linear-gradient(135deg, #FFCAD4 0%, #FFE5D9 100%); padding: 28px 24px; text-align: center; }
        .header h1 { margin: 0; color: #7A3B2E; font-size: 24px; font-weight: 800; }
        .content { padding: 28px 24px; text-align: center; }
        .otp-box { background: #FFF0F3; border: 2px dashed #E07A5F; border-radius: 16px; padding: 18px; margin: 20px 0; font-size: 34px; letter-spacing: 8px; font-weight: 800; color: #C92A2A; font-family: monospace; }
        .footer { background: #FAF6F0; padding: 16px; text-align: center; font-size: 12px; color: #8D99AE; border-top: 1px solid #EAEAEA; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <div style="font-size: 36px; margin-bottom: 6px;">🐾</div>
          <h1>PawsCare Account Verification</h1>
        </div>
        <div class="content">
          <p style="font-size: 16px; margin: 0 0 12px 0;">Hi <strong>${fullName}</strong>,</p>
          <p style="font-size: 14px; color: #5C677D; margin: 0 0 20px 0; line-height: 1.5;">
            Thank you for starting your registration with PawsCare! Please use the following 6-digit verification code to complete your signup:
          </p>
          
          <div class="otp-box">${otp}</div>
          
          <p style="font-size: 13px; color: #8D99AE; margin: 0;">
            ⏳ This code is valid for <strong>10 minutes</strong>. If you did not request this, please ignore this email.
          </p>
        </div>
        <div class="footer">
          With love, <strong>PawsCare Animal Rescue Team 🐾</strong>
        </div>
      </div>
    </body>
    </html>
  `;

  const info = await mailer.sendMail({
    from: `"PawsCare Security" <${senderEmail}>`,
    to: email,
    subject,
    html: htmlContent
  });

  console.log(`✉️ Verification OTP [${otp}] sent to ${email}. MessageId: ${info.messageId}`);
  return { success: true, messageId: info.messageId };
}

/**
 * Send Welcome Email after successful account creation
 * @param {string} email
 * @param {string} fullName
 */
export async function sendWelcomeEmail(email, fullName) {
  const mailer = await getTransporter();
  const senderEmail = process.env.EMAIL_USER || 'welcome@pawsrescue.org';
  const subject = `Welcome to PawsCare! 🐾`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #FAF6F0; margin: 0; padding: 24px; color: #2B2D42; }
        .card { background: #FFFFFF; max-width: 560px; margin: 0 auto; border-radius: 20px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.08); border: 2px solid #B7E4C7; }
        .header { background: linear-gradient(135deg, #D8F3DC 0%, #B7E4C7 100%); padding: 32px 24px; text-align: center; }
        .header h1 { margin: 0; color: #1B4332; font-size: 26px; font-weight: 800; }
        .content { padding: 28px 24px; }
        .welcome-box { background: #FAF6F0; border-left: 4px solid #52B788; padding: 18px; border-radius: 12px; margin: 18px 0; }
        .footer { background: #FAF6F0; padding: 18px; text-align: center; font-size: 12px; color: #8D99AE; border-top: 1px solid #EAEAEA; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <div style="font-size: 40px; margin-bottom: 6px;">🐾</div>
          <h1>Welcome to PawsCare!</h1>
          <p style="margin: 4px 0 0 0; color: #2D6A4F; font-weight: 600;">Rescue • Adopt • Heal</p>
        </div>
        <div class="content">
          <p style="font-size: 16px; margin: 0 0 12px 0;">Hi <strong>${fullName}</strong>,</p>
          
          <div class="welcome-box">
            <p style="margin: 0 0 10px 0; font-size: 15px; color: #1B4332; font-weight: 700;">
              Thank you for creating your PawsCare account! 🐾
            </p>
            <p style="margin: 0 0 10px 0; font-size: 14px; color: #2B2D42; line-height: 1.6;">
              Your account has been successfully created and verified. We're happy to have you join PawsCare and our mission to help animals.
            </p>
            <p style="margin: 0; font-size: 14px; color: #2D6A4F; font-weight: 700;">
              Welcome to the PawsCare family! ❤️
            </p>
          </div>

          <p style="font-size: 14px; color: #5C677D; line-height: 1.6;">
            You now have full access to adopt loving pets, report and track injured street rescues, chat with our AI Veterinary Assistant, and access certified pet first-aid guides.
          </p>

          <p style="font-size: 14px; color: #2B2D42; margin-top: 20px;">
            — <strong>PawsCare Team 🐾</strong>
          </p>
        </div>
        <div class="footer">
          Sent with care to ${email} by PawsCare Animal Rescue Portal.
        </div>
      </div>
    </body>
    </html>
  `;

  const info = await mailer.sendMail({
    from: `"PawsCare Team" <${senderEmail}>`,
    to: email,
    subject,
    html: htmlContent
  });

  console.log(`✉️ Welcome email sent to ${email}. MessageId: ${info.messageId}`);
  return { success: true, messageId: info.messageId };
}

/**
 * Send Login Notification Security Alert Email
 * @param {string} email
 * @param {string} fullName
 * @param {string} loginTime
 */
export async function sendLoginNotificationEmail(email, fullName, loginTime) {
  const mailer = await getTransporter();
  const senderEmail = process.env.EMAIL_USER || 'security@pawsrescue.org';
  const subject = `New Login to Your PawsCare Account 🐾`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #FAF6F0; margin: 0; padding: 24px; color: #2B2D42; }
        .card { background: #FFFFFF; max-width: 540px; margin: 0 auto; border-radius: 20px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.08); border: 2px solid #E8DEF8; }
        .header { background: linear-gradient(135deg, #F3E8FF 0%, #E8DEF8 100%); padding: 28px 24px; text-align: center; }
        .header h1 { margin: 0; color: #3B1C54; font-size: 22px; font-weight: 800; }
        .content { padding: 28px 24px; }
        .alert-box { background: #FAF6F0; border-left: 4px solid #9D4EDD; padding: 14px 18px; border-radius: 12px; margin: 16px 0; font-size: 14px; line-height: 1.6; }
        .footer { background: #FAF6F0; padding: 16px; text-align: center; font-size: 12px; color: #8D99AE; border-top: 1px solid #EAEAEA; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <div style="font-size: 34px; margin-bottom: 6px;">🔐</div>
          <h1>New Login Detected</h1>
        </div>
        <div class="content">
          <p style="font-size: 15px; margin: 0 0 10px 0;">Hi <strong>${fullName}</strong>,</p>
          <p style="font-size: 14px; color: #5C677D; margin: 0 0 14px 0;">
            You have successfully logged in to your PawsCare account.
          </p>

          <div class="alert-box">
            <div>🗓️ <strong>Login Time:</strong> ${loginTime || new Date().toLocaleString()}</div>
            <div style="margin-top: 4px;">✉️ <strong>Account:</strong> ${email}</div>
          </div>

          <p style="font-size: 13px; color: #5C677D; margin: 16px 0 0 0;">
            If this was you, no action is needed. If you did not log in, please secure your account immediately.
          </p>

          <p style="font-size: 14px; color: #2B2D42; margin-top: 18px;">
            — <strong>PawsCare Team 🐾</strong>
          </p>
        </div>
        <div class="footer">
          PawsCare Security Notifications • Protecting Animal Lovers
        </div>
      </div>
    </body>
    </html>
  `;

  const info = await mailer.sendMail({
    from: `"PawsCare Security" <${senderEmail}>`,
    to: email,
    subject,
    html: htmlContent
  });

  console.log(`✉️ Login security alert sent to ${email}. MessageId: ${info.messageId}`);
  return { success: true, messageId: info.messageId };
}

/**
 * Send Adoption Request Email to ADMIN_EMAIL using Nodemailer
 * @param {Object} data - Contains petName, applicantName, phone, email, housingType, hasOtherPets, message, petBreed, petAge, id
 */
export async function sendAdoptionRequestEmail(data) {
  dotenv.config();

  const adminEmail = (process.env.ADMIN_EMAIL || '').trim();
  if (!adminEmail || adminEmail === 'your_admin_email@gmail.com' || adminEmail === 'MY_EMAIL_ADDRESS') {
    throw new Error(
      'ADMIN_EMAIL is not configured in backend/.env. Please open backend/.env and set your real receiving email address.'
    );
  }

  const mailer = await getTransporter();
  const senderEmail = process.env.EMAIL_USER || process.env.SMTP_USER || 'adoptions@pawsrescue.org';
  const petName = data.petName || 'Rescued Pet';
  const subject = `New Adoption Application — ${petName}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #FAF6F0; margin: 0; padding: 24px; color: #2B2D42; }
        .card { background: #FFFFFF; max-width: 620px; margin: 0 auto; border-radius: 20px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.08); border: 2px solid #B7E4C7; }
        .header { background: linear-gradient(135deg, #D8F3DC 0%, #B7E4C7 100%); padding: 28px 24px; text-align: center; }
        .header h1 { margin: 0; color: #1B4332; font-size: 24px; font-weight: 800; }
        .header p { margin: 6px 0 0 0; color: #2D6A4F; font-size: 14px; font-weight: 600; }
        .content { padding: 28px 24px; }
        .badge { display: inline-block; background: #D8F3DC; color: #1B4332; font-weight: bold; padding: 6px 16px; border-radius: 20px; font-size: 13px; margin-bottom: 16px; }
        .section-title { font-size: 16px; color: #1B4332; border-bottom: 2px solid #E8F5E9; padding-bottom: 6px; margin: 22px 0 14px 0; font-weight: 700; }
        .field-group { margin-bottom: 14px; }
        .label { font-size: 12px; font-weight: bold; color: #8D99AE; text-transform: uppercase; margin-bottom: 4px; }
        .value { font-size: 15px; color: #2B2D42; font-weight: 600; }
        .message-box { background: #FAF6F0; border-left: 4px solid #52B788; padding: 14px 18px; border-radius: 12px; margin: 16px 0; font-style: italic; line-height: 1.5; color: #2B2D42; }
        .footer { background: #FAF6F0; padding: 18px; text-align: center; font-size: 12px; color: #8D99AE; border-top: 1px solid #EAEAEA; }
        .pet-card-inline { background: #F0FFF4; border: 1px solid #C6F6D5; border-radius: 14px; padding: 14px 18px; margin-bottom: 18px; }
      </style>
    </head>
    <body>
      <div class="card">
        
        <div class="header">
          <div style="font-size: 38px; margin-bottom: 6px;">🐾</div>
          <h1>PawsCare — New Adoption Application</h1>
          <p>Rescue • Adopt • Heal</p>
        </div>

        <div class="content">
          
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <span class="badge">Target Pet: ${petName}</span>
            <span style="font-size: 12px; color: #8D99AE;">Application ID: <strong>#${data.id || 'N/A'}</strong></span>
          </div>

          <div class="pet-card-inline">
            <div style="font-size: 17px; font-weight: 800; color: #1B4332; margin-bottom: 4px;">🐾 ${petName}</div>
            <div style="font-size: 14px; color: #2D6A4F;">
              <strong>Breed:</strong> ${data.petBreed || 'Adoptable Pet'} &nbsp;•&nbsp; <strong>Age:</strong> ${data.petAge || 'Rescued Animal'}
            </div>
          </div>

          <div class="section-title">👤 Applicant Details</div>

          <div class="field-group">
            <div class="label">Full Name:</div>
            <div class="value" style="font-size: 16px; color: #1B4332;">${data.applicantName}</div>
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

          <div class="section-title">🏡 Application & Living Details</div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
            <div class="field-group">
              <div class="label">Housing Type:</div>
              <div class="value">🏡 ${data.housingType || 'Apartment with Yard'}</div>
            </div>

            <div class="field-group">
              <div class="label">Currently Has Pets:</div>
              <div class="value">🐾 ${data.hasOtherPets || 'No'}</div>
            </div>
          </div>

          <div class="field-group" style="margin-top: 14px;">
            <div class="label" style="color: #2D6A4F;">Why would you be a great match for ${petName}?</div>
            <div class="message-box">
              "${data.message || 'No additional message provided.'}"
            </div>
          </div>

          <div class="field-group">
            <div class="label">Submitted Date & Time:</div>
            <div class="value" style="font-size: 13px; color: #5C677D;">
              🗓️ ${new Date(data.submittedAt || Date.now()).toLocaleString()}
            </div>
          </div>

        </div>

        <div class="footer">
          This adoption application was automatically dispatched from the PawsCare Portal to <strong>${adminEmail}</strong>.
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

  console.log(`✅ Real Adoption Application email delivered to ${adminEmail}! MessageId: ${info.messageId}`);

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
