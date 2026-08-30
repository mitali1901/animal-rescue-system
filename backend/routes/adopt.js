import express from 'express';
import { readDb, writeDb } from '../database/db.js';
import { sendAdoptionRequestEmail } from '../services/emailService.js';

const router = express.Router();

// POST /api/adopt — Submit Adoption Application & send Nodemailer email notification
router.post('/', async (req, res) => {
  const {
    petName,
    applicantName,
    phone,
    email,
    housingType,
    hasOtherPets,
    message,
    petId
  } = req.body;

  // Validate required fields
  if (!applicantName || !email || !phone) {
    return res.status(400).json({
      success: false,
      message: 'Please provide your full name, email address, and phone number.'
    });
  }

  const db = readDb();
  if (!db.adoptionApplications) {
    db.adoptionApplications = [];
  }

  const finalPetName = petName || (petId && db.adoptions ? (db.adoptions.find(p => p.id === petId)?.name) : 'Rescued Pet');

  const application = {
    id: `adopt-${Date.now()}`,
    petId: petId || 'pet-generic',
    petName: finalPetName,
    applicantName: applicantName.trim(),
    email: email.trim(),
    phone: phone.trim(),
    housingType: housingType || 'Apartment with Yard',
    hasOtherPets: hasOtherPets || 'No',
    message: message ? message.trim() : '',
    submittedAt: new Date().toISOString(),
    status: 'Pending Review'
  };

  try {
    // 1. Send Nodemailer email to ADMIN_EMAIL
    const emailResult = await sendAdoptionRequestEmail(application);

    // 2. Store application in database upon successful email delivery
    db.adoptionApplications.unshift(application);
    writeDb(db);

    return res.status(200).json({
      success: true,
      message: `Adoption request for ${finalPetName} submitted and email delivered successfully!`,
      application,
      emailResult
    });
  } catch (err) {
    console.error('❌ Error sending adoption email:', err.message);

    return res.status(500).json({
      success: false,
      message: `Email could not be delivered: ${err.message}`
    });
  }
});

export default router;
