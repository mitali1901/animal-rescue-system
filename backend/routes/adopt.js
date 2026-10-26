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

  // Lookup target pet from database to get breed and age
  const pet = (db.adoptions || []).find(
    p => p.id === petId || (petName && p.name.toLowerCase() === petName.toLowerCase())
  );

  const finalPetName = petName || (pet ? pet.name : 'Rescued Pet');
  const petBreed = pet ? pet.breed : 'Adoptable Pet';
  const petAge = pet ? pet.age : 'Rescued Animal';

  const application = {
    id: `adopt-${Date.now()}`,
    petId: pet ? pet.id : (petId || 'pet-generic'),
    petName: finalPetName,
    petBreed,
    petAge,
    applicantName: applicantName.trim(),
    email: email.trim(),
    phone: phone.trim(),
    housingType: housingType || 'Apartment with Yard',
    hasOtherPets: hasOtherPets || 'No',
    message: message ? message.trim() : '',
    submittedAt: new Date().toISOString(),
    status: 'Pending Review'
  };

  // 1. Permanently store application in database
  db.adoptionApplications.unshift(application);
  writeDb(db);

  // 2. Dispatch real email to ADMIN_EMAIL using Nodemailer
  try {
    const emailResult = await sendAdoptionRequestEmail(application);

    return res.status(200).json({
      success: true,
      message: `Adoption application for ${finalPetName} submitted and email delivered successfully!`,
      application,
      emailResult
    });
  } catch (err) {
    console.warn('⚠️ Adoption email delivery skipped or failed:', err.message);

    return res.status(200).json({
      success: true,
      message: `Adoption application for ${finalPetName} submitted successfully! (Saved to database)`,
      application,
      emailNotice: err.message
    });
  }
});

export default router;
