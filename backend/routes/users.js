import express from 'express';
import { readDb, writeDb } from '../database/db.js';

const router = express.Router();

// GET user profile by UID
router.get('/profile/:uid', (req, res) => {
  const db = readDb();
  const user = (db.users || []).find(u => u.uid === req.params.uid);
  if (!user) {
    return res.status(404).json({ error: 'User profile not found' });
  }
  res.json(user);
});

// POST save / update user profile after Firebase Signup or Google Login (No phone number)
router.post('/profile', (req, res) => {
  const db = readDb();
  const { uid, email, fullName, authProvider, photoURL, emailVerified } = req.body;

  if (!uid || !email) {
    return res.status(400).json({ error: 'UID and email are required' });
  }

  if (!db.users) {
    db.users = [];
  }

  const existingIndex = db.users.findIndex(u => u.uid === uid || u.email.toLowerCase() === email.toLowerCase());

  const userProfile = {
    uid,
    email: email.toLowerCase(),
    fullName: fullName || email.split('@')[0],
    photoURL: photoURL || '',
    authProvider: authProvider || 'password',
    emailVerified: emailVerified !== undefined ? emailVerified : (authProvider === 'google'),
    updatedAt: new Date().toISOString()
  };

  if (existingIndex >= 0) {
    db.users[existingIndex] = { ...db.users[existingIndex], ...userProfile };
  } else {
    userProfile.createdAt = new Date().toISOString();
    db.users.push(userProfile);
  }

  writeDb(db);
  res.status(200).json({ message: 'User profile stored successfully', profile: userProfile });
});

export default router;
