import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { readDb, writeDb } from '../database/db.js';
import {
  sendVerificationOtpEmail,
  sendWelcomeEmail,
  sendLoginNotificationEmail
} from '../services/emailService.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'pawscare_production_super_secret_jwt_key_2026';

// In-memory store for pending OTP registrations
// Structure: email -> { fullName, hashedPassword, otp, expiresAt, attempts, lastSentAt }
const pendingRegistrations = new Map();

/**
 * Validate password strength:
 * - Min 8 characters
 * - 1 uppercase letter
 * - 1 lowercase letter
 * - 1 number
 * - 1 special character
 */
function validatePassword(password) {
  if (!password || password.length < 8) return false;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  return hasUpper && hasLower && hasNumber && hasSpecial;
}

// 1. POST /api/auth/signup-request — Validate details, generate OTP, send email
router.post('/signup-request', async (req, res) => {
  const { fullName, email, password, confirmPassword } = req.body;

  if (!fullName || !fullName.trim()) {
    return res.status(400).json({ success: false, message: 'Please enter your full name.' });
  }

  if (!email || !email.trim()) {
    return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Validate password
  if (!validatePassword(password)) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.'
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ success: false, message: 'Passwords do not match.' });
  }

  const db = readDb();
  if (!db.users) db.users = [];

  // Check duplicate email
  const existingUser = db.users.find(u => u.email.toLowerCase() === normalizedEmail);
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: 'An account with this email already exists. Please sign in instead.'
    });
  }

  // Generate real 6-digit numeric OTP
  const otp = crypto.randomInt(100000, 1000000).toString();
  const hashedPassword = await bcrypt.hash(password, 10);

  // Store in pending registrations with 10-minute expiry
  pendingRegistrations.set(normalizedEmail, {
    fullName: fullName.trim(),
    hashedPassword,
    otp,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    attempts: 0,
    lastSentAt: Date.now()
  });

  try {
    // Send real OTP email
    await sendVerificationOtpEmail(normalizedEmail, fullName.trim(), otp);

    return res.status(200).json({
      success: true,
      message: `A 6-digit verification code has been sent to ${normalizedEmail}.`,
      email: normalizedEmail
    });
  } catch (err) {
    console.warn(`⚠️ Email dispatch skipped (${err.message}). Using local development mode.`);
    console.log(`\n==================================================`);
    console.log(`🔑 DEV MODE OTP for [${normalizedEmail}]: ${otp}`);
    console.log(`==================================================\n`);

    return res.status(200).json({
      success: true,
      message: `Verification code generated! (Dev mode: ${otp})`,
      email: normalizedEmail,
      devOtp: otp
    });
  }
});

// 2. POST /api/auth/verify-otp — Verify OTP, save user to database, send Welcome Email, issue JWT
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Please provide email and verification code.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const pending = pendingRegistrations.get(normalizedEmail);

  if (!pending) {
    return res.status(400).json({
      success: false,
      message: 'No pending registration found for this email. Please fill the signup form again.'
    });
  }

  // Check expiration
  if (Date.now() > pending.expiresAt) {
    pendingRegistrations.delete(normalizedEmail);
    return res.status(400).json({
      success: false,
      message: 'Verification code has expired. Please request a new code.'
    });
  }

  // Check attempts
  if (pending.attempts >= 5) {
    pendingRegistrations.delete(normalizedEmail);
    return res.status(429).json({
      success: false,
      message: 'Too many incorrect attempts. Please start registration again.'
    });
  }

  // Verify OTP
  if (pending.otp !== otp.trim()) {
    pending.attempts += 1;
    return res.status(400).json({
      success: false,
      message: `Invalid verification code. ${5 - pending.attempts} attempts remaining.`
    });
  }

  // OTP is valid! Create real persistent user account
  const db = readDb();
  if (!db.users) db.users = [];

  const newUser = {
    id: `user-${Date.now()}`,
    fullName: pending.fullName,
    email: normalizedEmail,
    password: pending.hashedPassword,
    role: 'member',
    isVerified: true,
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  writeDb(db);
  pendingRegistrations.delete(normalizedEmail);

  // Generate JWT token
  const token = jwt.sign(
    { id: newUser.id, email: newUser.email, fullName: newUser.fullName },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  // Send Welcome Email asynchronously
  try {
    await sendWelcomeEmail(newUser.email, newUser.fullName);
  } catch (err) {
    console.warn('Welcome email warning:', err.message);
  }

  const safeUser = {
    id: newUser.id,
    fullName: newUser.fullName,
    email: newUser.email,
    role: newUser.role
  };

  return res.status(201).json({
    success: true,
    message: 'Account verified and created successfully!',
    token,
    user: safeUser
  });
});

// 3. POST /api/auth/resend-otp — Resend OTP with 60s cooldown
router.post('/resend-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Please provide email.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const pending = pendingRegistrations.get(normalizedEmail);

  if (!pending) {
    return res.status(400).json({ success: false, message: 'No active registration found. Please sign up first.' });
  }

  // Check 60-second cooldown
  const now = Date.now();
  if (now - pending.lastSentAt < 60 * 1000) {
    const waitSec = Math.ceil((60 * 1000 - (now - pending.lastSentAt)) / 1000);
    return res.status(429).json({
      success: false,
      message: `Please wait ${waitSec} seconds before requesting a new code.`
    });
  }

  const newOtp = crypto.randomInt(100000, 1000000).toString();
  pending.otp = newOtp;
  pending.expiresAt = now + 10 * 60 * 1000;
  pending.lastSentAt = now;
  pending.attempts = 0;

  try {
    await sendVerificationOtpEmail(normalizedEmail, pending.fullName, newOtp);
    return res.status(200).json({
      success: true,
      message: `A fresh 6-digit code has been sent to ${normalizedEmail}.`
    });
  } catch (err) {
    console.warn(`⚠️ Email dispatch skipped (${err.message}). Using local development mode.`);
    console.log(`\n==================================================`);
    console.log(`🔑 DEV MODE RESEND OTP for [${normalizedEmail}]: ${newOtp}`);
    console.log(`==================================================\n`);

    return res.status(200).json({
      success: true,
      message: `Fresh verification code generated! (Dev mode: ${newOtp})`,
      devOtp: newOtp
    });
  }
});

// 4. POST /api/auth/login — Authenticate existing user, dispatch Login Notification Email, return JWT
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide both email and password.'
    });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const db = readDb();
  const users = db.users || [];

  const user = users.find(u => u.email.toLowerCase() === normalizedEmail);

  // 1. If user does NOT exist in database:
  if (!user) {
    return res.status(404).json({
      success: false,
      errorCode: 'ACCOUNT_NOT_FOUND',
      message: 'Account not found. Please create an account first.'
    });
  }

  // 2. Compare hashed password:
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      errorCode: 'INVALID_CREDENTIALS',
      message: 'Incorrect email or password. Please try again.'
    });
  }

  // 3. Generate JWT Token:
  const token = jwt.sign(
    { id: user.id, email: user.email, fullName: user.fullName },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  const loginTime = new Date().toLocaleString();

  // 4. Send Login Notification Email asynchronously
  try {
    await sendLoginNotificationEmail(user.email, user.fullName, loginTime);
  } catch (err) {
    console.warn('Login notification email warning:', err.message);
  }

  const safeUser = {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role || 'member'
  };

  return res.status(200).json({
    success: true,
    message: 'Login successful!',
    token,
    user: safeUser
  });
});

// 5. GET /api/auth/me — Validate session token
router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No authentication token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const db = readDb();
    const user = (db.users || []).find(u => u.id === decoded.id || u.email === decoded.email);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User account not found.' });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role || 'member'
      }
    });
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired session token.' });
  }
});

export default router;
