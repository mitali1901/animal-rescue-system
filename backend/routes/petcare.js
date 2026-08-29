import express from 'express';
import { readDb, writeDb } from '../database/db.js';

const router = express.Router();

// GET all pet care guides / symptom remedies
router.get('/guides', (req, res) => {
  const db = readDb();
  const { query, category } = req.query;
  let guides = db.petCareGuides || [];

  if (query) {
    const q = query.toLowerCase();
    guides = guides.filter(g =>
      g.title.toLowerCase().includes(q) ||
      g.symptoms.some(s => s.toLowerCase().includes(q)) ||
      g.targetAnimal.toLowerCase().includes(q)
    );
  }

  if (category && category !== 'All') {
    guides = guides.filter(g => g.category.toLowerCase() === category.toLowerCase());
  }

  res.json(guides);
});

// GET all saved consultation requests
router.get('/consultations', (req, res) => {
  const db = readDb();
  res.json(db.consultationRequests || []);
});

// POST request virtual consultation or home cure visit for pet owner
router.post('/consult', (req, res) => {
  const db = readDb();
  const { petOwnerName, petName, animalType, symptomDescription, preferredTime, phone } = req.body;

  if (!petOwnerName || !petName || !phone || !symptomDescription) {
    return res.status(400).json({ error: 'Please complete all required fields for consultation.' });
  }

  const consultRequest = {
    id: `consult-${Date.now()}`,
    petOwnerName,
    petName,
    animalType: animalType || 'Dog',
    symptomDescription,
    preferredTime: preferredTime || 'As soon as possible',
    phone,
    createdAt: new Date().toISOString(),
    status: 'Assigned to Vet'
  };

  db.consultationRequests.unshift(consultRequest);
  writeDb(db);

  res.status(201).json({
    message: `Consultation request logged for ${petName}! Saved to database.`,
    consultation: consultRequest
  });
});

export default router;
