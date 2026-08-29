import express from 'express';
import { readDb, writeDb } from '../database/db.js';
import { sendRescueReportEmail } from '../services/emailService.js';

const router = express.Router();

// GET all rescue cases
router.get('/', (req, res) => {
  const db = readDb();
  res.json(db.rescues || []);
});

// POST report a new injured animal (Connected to Firebase User + Email Dispatch)
router.post('/report', async (req, res) => {
  const db = readDb();
  const {
    animalType,
    breed,
    title,
    description,
    locationName,
    lat,
    lng,
    severity,
    reporterName,
    reporterEmail,
    contactPhone,
    imageUrl,
    userId,
    userEmail
  } = req.body;

  if (!animalType || !title || !locationName) {
    return res.status(400).json({ error: 'Missing required rescue details: animalType, title, locationName are required.' });
  }

  const now = new Date().toISOString();
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const newRescue = {
    id: `res-${Date.now()}`,
    animalType,
    breed: breed || 'Unknown Breed',
    title,
    description: description || 'No extra details provided.',
    locationName,
    lat: parseFloat(lat) || 40.758,
    lng: parseFloat(lng) || -73.9855,
    severity: severity || 'Medium',
    status: 'Reported',
    reportedAt: now,
    reporterName: reporterName || 'Anonymous Good Samaritan',
    reporterEmail: reporterEmail || userEmail || 'Not provided',
    contactPhone: contactPhone || 'Not provided',
    userId: userId || 'anonymous',
    userEmail: userEmail || reporterEmail || 'anonymous@pawsrescue.org',
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80',
    timeline: [
      { status: 'Reported', time: timeStr, note: `Injured ${animalType} reported by ${reporterName || userEmail || 'user'}` }
    ]
  };

  db.rescues.unshift(newRescue);
  writeDb(db);

  // Trigger server-side email dispatch to ADMIN_EMAIL
  const emailResult = await sendRescueReportEmail(newRescue);

  res.status(201).json({
    message: 'Rescue report submitted successfully! Stored in database, visible on website, and emailed to admin.',
    rescue: newRescue,
    emailStatus: emailResult
  });
});

// PUT update status of rescue case (e.g. Dispatched -> Under Vet Care -> Recovered)
router.put('/:id/status', (req, res) => {
  const db = readDb();
  const { id } = req.params;
  const { status, note } = req.body;

  const caseItem = db.rescues.find(r => r.id === id);
  if (!caseItem) {
    return res.status(404).json({ error: 'Rescue case not found' });
  }

  caseItem.status = status;
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  caseItem.timeline.push({
    status,
    time: timeStr,
    note: note || `Status updated to ${status}`
  });

  writeDb(db);
  res.json({ message: 'Status updated successfully', rescue: caseItem });
});

export default router;
