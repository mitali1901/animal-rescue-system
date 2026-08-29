import express from 'express';
import { readDb } from '../database/db.js';

const router = express.Router();

// Helper to calculate distance in km using Haversine formula
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// GET all helpers / vets / ambulances near given coordinates
router.get('/', (req, res) => {
  const db = readDb();
  const userLat = parseFloat(req.query.lat);
  const userLng = parseFloat(req.query.lng);
  const typeFilter = req.query.type;

  let helpers = (db.helpers || []).map(h => {
    let dist = h.distanceKm;
    if (!isNaN(userLat) && !isNaN(userLng)) {
      dist = calculateDistanceKm(userLat, userLng, h.lat, h.lng);
    }
    return { ...h, distanceKm: dist };
  });

  if (typeFilter && typeFilter !== 'All') {
    helpers = helpers.filter(h => h.type.toLowerCase() === typeFilter.toLowerCase());
  }

  // Sort by closest distance
  helpers.sort((a, b) => a.distanceKm - b.distanceKm);

  res.json(helpers);
});

export default router;
