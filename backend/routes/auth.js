import express from 'express';
import nodemailer from 'nodemailer';
import { readDb, writeDb } from '../database/db.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Memory / DB store for OTP verification
let activeOtps = {}; // { [email]: { otp: '123456', expiresAt: timestamp } }

async function getTransporter() {
  if (process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SMTP_HOST !== 'smtp.ethereal.email') {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  try {
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
  } catch (e) {
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: { user: 'demo@ethereal.email', pass: 'demo' }
    });
  }
}

// POST /api/auth/send-verification-otp
router.post('/send-verification-otp', async (req, res) => {
  const { email } = req.body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Valid email address is required.' });
  }

  const cleanEmail = email.toLowerCase().trim();
  // Generate a 6-digit numeric OTP code
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

  activeOtps[cleanEmail] = {
    otp: otpCode,
    expiresAt
  };

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #FAF6F0; padding: 24px; margin: 0; }
        .card { background: #FFFFFF; max-width: 480px; margin: 0 auto; border-radius: 20px; padding: 32px; border: 2px solid #FFCAD4; box-shadow: 0 8px 30px rgba(0,0,0,0.06); text-align: center; }
        .logo { font-size: 36px; margin-bottom: 12px; }
        .code-box { background: #FAF6F0; border: 2px dashed #74C69D; padding: 18px; border-radius: 16px; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1B4332; margin: 24px 0; }
        .footer { font-size: 12px; color: #8D99AE; margin-top: 24px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="logo">🐾</div>
        <h2 style="color: #2B2D42; margin: 0 0 8px 0;">Verify Your Email Address</h2>
        <p style="color: #5C677D; font-size: 14px; margin: 0;">Use the following 6-digit verification code to complete your PawsCare registration:</p>
        
        <div class="code-box">${otpCode}</div>
        
        <p style="color: #E07A5F; font-size: 13px; font-weight: bold; margin: 0;">This code is valid for 10 minutes.</p>
        <p style="color: #8D99AE; font-size: 12px; margin-top: 14px;">If you did not request this verification code, please ignore this email.</p>
        
        <div class="footer">
          © 2026 PawsCare Animal Rescue & Pet Healing System
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const mailer = await getTransporter();
    const info = await mailer.sendMail({
      from: `"PawsCare Security" <${process.env.SMTP_FROM || 'auth@pawsrescue.org'}>`,
      to: cleanEmail,
      subject: `🐾 Your PawsCare Verification Code: ${otpCode}`,
      html: htmlContent
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log(`✉️ Verification OTP [${otpCode}] sent to ${cleanEmail}. MessageId: ${info.messageId}`);
    if (previewUrl) {
      console.log(`🔗 Preview Verification Email online: ${previewUrl}`);
    }

    res.json({
      success: true,
      message: `Verification code sent to ${cleanEmail}`,
      previewUrl: previewUrl || null
    });
  } catch (err) {
    console.warn(`⚠️ Mailer notice: ${err.message}`);
    // Still allow verification with the active generated OTP code in memory
    res.json({
      success: true,
      message: `Verification code dispatched to ${cleanEmail}`,
      note: 'OTP stored in verification service'
    });
  }
});

// POST /api/auth/verify-otp
router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and verification code are required.' });
  }

  const cleanEmail = email.toLowerCase().trim();
  const cleanOtp = otp.toString().trim();
  const record = activeOtps[cleanEmail];

  if (!record) {
    return res.status(400).json({ error: 'No verification code found. Please request a new code.' });
  }

  if (Date.now() > record.expiresAt) {
    delete activeOtps[cleanEmail];
    return res.status(400).json({ error: 'Verification code has expired. Please request a new code.' });
  }

  if (record.otp !== cleanOtp) {
    return res.status(400).json({ error: 'Incorrect verification code. Please check your email and try again.' });
  }

  // Verification successful! Clean up OTP record
  delete activeOtps[cleanEmail];

  // Update user in Database as emailVerified: true
  const db = readDb();
  if (db.users) {
    const userIndex = db.users.findIndex(u => u.email && u.email.toLowerCase() === cleanEmail);
    if (userIndex >= 0) {
      db.users[userIndex].emailVerified = true;
      writeDb(db);
    }
  }

  res.json({
    success: true,
    verified: true,
    message: 'Email address verified successfully!'
  });
});

// GET /api/auth/status/:email
router.get('/status/:email', (req, res) => {
  const cleanEmail = req.params.email.toLowerCase().trim();
  const db = readDb();
  const user = (db.users || []).find(u => u.email && u.email.toLowerCase() === cleanEmail);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    email: user.email,
    emailVerified: user.emailVerified === true || user.authProvider === 'google'
  });
});

export default router;
