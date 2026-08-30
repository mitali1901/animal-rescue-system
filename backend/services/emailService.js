import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

let transporter;
let adminEmail = process.env.ADMIN_EMAIL || 'admin@animalrescue.org';

async function getTransporter() {
  if (transporter) return transporter;

  // If user provided live SMTP credentials in .env
  if (process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SMTP_HOST !== 'smtp.ethereal.email') {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
    return transporter;
  }

  // Create a live dynamic Ethereal test account so emails work out-of-the-box
  try {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    console.log(`📧 Ethereal test mailer initialized for ${testAccount.user}`);
    return transporter;
  } catch (e) {
    // Fallback direct transporter
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: 'demo@ethereal.email',
        pass: 'demo'
      }
    });
    return transporter;
  }
}

/**
 * Send complete formatted injured animal report email to ADMIN_EMAIL
 * @param {Object} report
 */
export async function sendRescueReportEmail(report) {
  const mailer = await getTransporter();
  const targetEmail = process.env.ADMIN_EMAIL || adminEmail;
  const subject = `🚨 [NEW INJURED ANIMAL REPORT] ${report.animalType} — ${report.title} (#${report.id})`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #FAF6F0; margin: 0; padding: 20px; color: #2B2D42; }
        .card { background: #FFFFFF; max-width: 600px; margin: 0 auto; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 2px solid #FFCAD4; }
        .header { background: linear-gradient(135deg, #FFCAD4 0%, #FFE5D9 100%); padding: 24px; text-align: center; }
        .header h1 { margin: 0; color: #7A3B2E; font-size: 22px; }
        .content { padding: 24px; }
        .badge { display: inline-block; background: #FFD6A5; color: #9C4100; font-weight: bold; padding: 4px 12px; border-radius: 20px; font-size: 12px; text-transform: uppercase; }
        .field-group { margin-bottom: 14px; }
        .label { font-size: 12px; font-weight: bold; color: #8D99AE; text-transform: uppercase; margin-bottom: 4px; }
        .value { font-size: 15px; color: #2B2D42; }
        .alert-box { background: #FFF0F3; border-left: 4px solid #E07A5F; padding: 12px; border-radius: 8px; margin: 16px 0; }
        .footer { background: #FAF6F0; padding: 16px; text-align: center; font-size: 12px; color: #8D99AE; }
        .img-preview { max-width: 100%; border-radius: 12px; margin-top: 10px; border: 1px solid #E0E0E0; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>🐾 PawsCare Emergency Rescue Report</h1>
          <p style="margin: 4px 0 0 0; color: #7A3B2E; font-size: 13px;">Immediate Volunteer & Vet Action Required</p>
        </div>

        <div class="content">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <span class="badge">Severity: ${report.severity}</span>
            <span style="font-size: 12px; color: #8D99AE;">Report ID: <strong>${report.id}</strong></span>
          </div>

          <div class="field-group">
            <div class="label">Animal Species & Breed:</div>
            <div class="value"><strong>${report.animalType}</strong> (${report.breed || 'Unknown'})</div>
          </div>

          <div class="field-group">
            <div class="label">Report Title:</div>
            <div class="value" style="font-size: 17px; font-weight: bold; color: #E07A5F;">${report.title}</div>
          </div>

          <div class="alert-box">
            <div class="label" style="color: #E07A5F;">Injury Description & Condition:</div>
            <div class="value" style="margin-top: 4px;">${report.description}</div>
          </div>

          <div class="field-group">
            <div class="label">Location & Landmark:</div>
            <div class="value">📍 <strong>${report.locationName}</strong></div>
            ${report.lat && report.lng ? `<div style="font-size: 12px; color: #5C677D;">GPS Coordinates: ${report.lat}, ${report.lng}</div>` : ''}
          </div>

          <hr style="border: 0; border-top: 1px solid #F0F0F0; margin: 20px 0;" />

          <div class="field-group">
            <div class="label">Reporter Details:</div>
            <div class="value">
              👤 <strong>${report.reporterName || 'Anonymous Samaritan'}</strong><br />
              📞 Phone: ${report.contactPhone || 'Not provided'}<br />
              ✉️ Email: ${report.reporterEmail || 'Not provided'}
            </div>
          </div>

          <div class="field-group">
            <div class="label">Timestamp:</div>
            <div class="value" style="font-size: 13px;">${new Date(report.reportedAt).toLocaleString()}</div>
          </div>

          ${report.imageUrl ? `
            <div class="field-group" style="margin-top: 16px;">
              <div class="label">Animal Photo / Evidence:</div>
              <img src="${report.imageUrl}" alt="Injured Animal" class="img-preview" />
            </div>
          ` : ''}

        </div>

        <div class="footer">
          This report was automatically dispatched from the PawsCare Animal Rescue Portal to <strong>${targetEmail}</strong>.
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const info = await mailer.sendMail({
      from: `"PawsCare Rescue Alert" <${process.env.SMTP_FROM || 'alerts@pawsrescue.org'}>`,
      to: targetEmail,
      subject: subject,
      html: htmlContent
    });
    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log(`📧 Rescue report email sent successfully to ${targetEmail}: ${info.messageId}`);
    if (previewUrl) {
      console.log(`🔗 Preview email online: ${previewUrl}`);
    }
    return { success: true, messageId: info.messageId, recipient: targetEmail, previewUrl: previewUrl || null };
  } catch (err) {
    console.warn(`⚠️ Email notice: Report #${report.id} saved. (${err.message})`);
    return { success: false, note: err.message, recipient: targetEmail };
  }
}

/**
 * Send complete formatted Adoption Application confirmation email to ADMIN_EMAIL
 * @param {Object} application
 * @param {Object} pet
 */
export async function sendAdoptionApplicationEmail(application, pet) {
  const mailer = await getTransporter();
  const targetEmail = process.env.ADMIN_EMAIL || adminEmail;
  const petName = application.petName || (pet ? pet.name : 'Rescued Pet');
  const subject = `New Adoption Application — ${petName}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #FAF6F0; margin: 0; padding: 20px; color: #2B2D42; }
        .card { background: #FFFFFF; max-width: 600px; margin: 0 auto; border-radius: 20px; overflow: hidden; box-shadow: 0 6px 24px rgba(0,0,0,0.08); border: 2px solid #B7E4C7; }
        .header { background: linear-gradient(135deg, #D8F3DC 0%, #B7E4C7 100%); padding: 28px 24px; text-align: center; }
        .header h1 { margin: 0; color: #1B4332; font-size: 24px; }
        .content { padding: 28px 24px; }
        .badge { display: inline-block; background: #D8F3DC; color: #1B4332; font-weight: bold; padding: 4px 14px; border-radius: 20px; font-size: 12px; }
        .intro-box { background: #FAF6F0; border-left: 4px solid #52B788; padding: 16px; border-radius: 12px; margin: 16px 0 24px 0; }
        .field-group { margin-bottom: 16px; }
        .label { font-size: 12px; font-weight: bold; color: #8D99AE; text-transform: uppercase; margin-bottom: 4px; }
        .value { font-size: 15px; color: #2B2D42; }
        .footer { background: #FAF6F0; padding: 18px; text-align: center; font-size: 13px; color: #5C677D; border-top: 1px solid #E8E8E8; }
        .pet-preview { width: 100%; max-height: 240px; object-fit: cover; border-radius: 14px; margin-top: 10px; }
      </style>
    </head>
    <body>
      <div class="card">
        
        <div class="header">
          <div style="font-size: 32px; margin-bottom: 6px;">🐾</div>
          <h1>New Adoption Application</h1>
          <p style="margin: 4px 0 0 0; color: #2D6A4F; font-size: 14px; font-weight: 600;">PawsCare Animal Adoption Program</p>
        </div>

        <div class="content">
          
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <span class="badge">Target Pet: ${petName}</span>
            <span style="font-size: 12px; color: #8D99AE;">Application ID: <strong>#${application.id}</strong></span>
          </div>

          <div class="intro-box">
            <h3 style="margin: 0 0 8px 0; color: #1B4332; font-size: 17px;">Thank you for connecting with PawsCare! 🐾</h3>
            <p style="margin: 0 0 10px 0; font-size: 14px; color: #2B2D42; line-height: 1.5;">
              We have successfully received your adoption request for <strong>${petName}</strong>.
            </p>
            <p style="margin: 0 0 10px 0; font-size: 14px; color: #2B2D42; line-height: 1.5;">
              Thank you for your interest in giving a rescued animal a loving home. We really appreciate you taking the time to apply.
            </p>
            <p style="margin: 0 0 10px 0; font-size: 14px; color: #1B4332; font-weight: bold; line-height: 1.5;">
              Our team will review your request and get back to you within 1–2 days with the next steps/final update.
            </p>
            <p style="margin: 0 0 12px 0; font-size: 14px; color: #2B2D42;">
              We look forward to connecting with you soon.
            </p>
            <div style="font-size: 14px; color: #1B4332; font-weight: bold;">
              With love,<br />PawsCare Team 🐾
            </div>
          </div>

          <h3 style="font-size: 16px; margin: 20px 0 12px 0; color: #2B2D42; border-bottom: 2px solid #FAF6F0; padding-bottom: 6px;">
            📋 Submitted Application Details
          </h3>

          <div class="field-group">
            <div class="label">Applicant Full Name:</div>
            <div class="value"><strong>${application.applicantName}</strong></div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div class="field-group">
              <div class="label">Applicant Email:</div>
              <div class="value">✉️ <a href="mailto:${application.email}" style="color: #2D6A4F; text-decoration: none; font-weight: 600;">${application.email}</a></div>
            </div>

            <div class="field-group">
              <div class="label">Contact Phone:</div>
              <div class="value">📞 <strong>${application.phone}</strong></div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div class="field-group">
              <div class="label">Housing Type:</div>
              <div class="value">🏡 ${application.housingType || 'Not specified'}</div>
            </div>

            <div class="field-group">
              <div class="label">Current Pets at Home:</div>
              <div class="value">🐾 ${application.hasOtherPets || 'None'}</div>
            </div>
          </div>

          ${application.message ? `
            <div class="field-group" style="background: #FAF6F0; padding: 12px 16px; border-radius: 12px;">
              <div class="label">Applicant Living Situation & Experience:</div>
              <div class="value" style="margin-top: 4px; font-style: italic;">"${application.message}"</div>
            </div>
          ` : ''}

          <div class="field-group">
            <div class="label">Submission Timestamp:</div>
            <div class="value" style="font-size: 13px; color: #5C677D;">
              🗓️ ${new Date(application.submittedAt).toLocaleString()}
            </div>
          </div>

          ${pet && pet.imageUrl ? `
            <div class="field-group" style="margin-top: 18px;">
              <div class="label">Pet Profile — ${pet.name} (${pet.breed}):</div>
              <img src="${pet.imageUrl}" alt="${pet.name}" class="pet-preview" />
            </div>
          ` : ''}

        </div>

        <div class="footer">
          This adoption application notification was automatically dispatched from the PawsCare Animal Rescue Portal to <strong>${targetEmail}</strong>.
        </div>

      </div>
    </body>
    </html>
  `;

  try {
    const info = await mailer.sendMail({
      from: `"PawsCare Adoption Program" <${process.env.SMTP_FROM || 'adoptions@pawsrescue.org'}>`,
      to: targetEmail,
      subject: subject,
      html: htmlContent
    });
    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log(`📧 Adoption application email for ${petName} sent successfully to ${targetEmail}: ${info.messageId}`);
    if (previewUrl) {
      console.log(`🔗 Preview Adoption Email online: ${previewUrl}`);
    }
    return { success: true, messageId: info.messageId, recipient: targetEmail, previewUrl: previewUrl || null };
  } catch (err) {
    console.warn(`⚠️ Email notice: Adoption application #${application.id} saved. (${err.message})`);
    return { success: false, note: err.message, recipient: targetEmail };
  }
}
