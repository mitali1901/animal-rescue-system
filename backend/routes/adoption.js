import express from 'express';
import { readDb, writeDb } from '../database/db.js';
import { sendAdoptionApplicationEmail } from '../services/emailService.js';

const router = express.Router();

// GET all pets for adoption
router.get('/', (req, res) => {
  const db = readDb();
  const { species, urgency } = req.query;
  let pets = db.adoptions || [];

  if (species && species !== 'All') {
    pets = pets.filter(p => p.species.toLowerCase() === species.toLowerCase());
  }

  if (urgency === 'urgent') {
    pets = pets.filter(p => p.urgency === 'Urgent Foster');
  }

  res.json(pets);
});

// GET all saved adoption applications
router.get('/applications', (req, res) => {
  const db = readDb();
  res.json(db.adoptionApplications || []);
});

// POST submit adoption application & trigger email confirmation
router.post('/apply', async (req, res) => {
  const db = readDb();
  const { petId, applicantName, email, phone, housingType, hasOtherPets, message } = req.body;

  if (!petId || !applicantName || !email || !phone) {
    return res.status(400).json({ error: 'Please provide your full name, email, phone, and target pet.' });
  }

  if (!db.adoptionApplications) {
    db.adoptionApplications = [];
  }

  const pet = (db.adoptions || []).find(p => p.id === petId);

  const application = {
    id: `app-${Date.now()}`,
    petId,
    petName: pet ? pet.name : 'Unknown Pet',
    petSpecies: pet ? pet.species : 'Pet',
    applicantName,
    email,
    phone,
    housingType: housingType || 'Apartment with Yard',
    hasOtherPets: hasOtherPets || 'None',
    message: message || '',
    submittedAt: new Date().toISOString(),
    status: 'Pending Review'
  };

  // 1. Permanently store application in database
  db.adoptionApplications.unshift(application);
  writeDb(db);

  // 2. Dispatch Adoption Application Email to ADMIN_EMAIL
  let emailStatus = { success: false };
  try {
    emailStatus = await sendAdoptionApplicationEmail(application, pet);
  } catch (err) {
    console.warn(`Email dispatch warning for application #${application.id}:`, err.message);
    emailStatus = { success: false, note: err.message };
  }

  res.status(201).json({
    message: `Adoption application for ${application.petName} submitted successfully! Saved to database and emailed to admin.`,
    application,
    emailStatus
  });
});

export default router;
