import express from 'express';
import { readDb, writeDb } from '../database/db.js';

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

// POST submit adoption application
router.post('/apply', (req, res) => {
  const db = readDb();
  const { petId, applicantName, email, phone, housingType, hasOtherPets, message } = req.body;

  if (!petId || !applicantName || !email || !phone) {
    return res.status(400).json({ error: 'Please provide name, email, phone, and target pet.' });
  }

  const pet = db.adoptions.find(p => p.id === petId);

  const application = {
    id: `app-${Date.now()}`,
    petId,
    petName: pet ? pet.name : 'Unknown Pet',
    applicantName,
    email,
    phone,
    housingType: housingType || 'Apartment',
    hasOtherPets: hasOtherPets || 'No',
    message: message || '',
    submittedAt: new Date().toISOString(),
    status: 'Pending Review'
  };

  db.adoptionApplications.unshift(application);
  writeDb(db);

  res.status(201).json({
    message: `Adoption application for ${application.petName} submitted successfully! Saved to database.`,
    application
  });
});

export default router;
