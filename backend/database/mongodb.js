import mongoose from 'mongoose';
import {
  User,
  Rescue,
  AdoptionPet,
  AdoptionApplication,
  ConsultationRequest,
  PetCareGuide,
  Helper
} from './models.js';

let isMongoConnected = false;
let mongoConnectionError = null;

/**
 * Sanitizes MongoDB URIs by removing accidental angle brackets <...>
 * and safely URL-encoding username & password characters (like '@')
 */
export function cleanMongoUri(uri) {
  if (!uri) return '';
  let cleaned = uri.trim();

  // Pattern: mongodb(+srv)://[<user>|user]:[<pass>|pass]@[host][/db][?query]
  const regex = /^(mongodb(?:\+srv)?:\/\/)(?:<([^>]+)>|([^:]+)):(?:<([^>]+)>|([^@]+))@([^/?]+)(\/[^?]*)?(\?.*)?$/;
  const match = cleaned.match(regex);

  if (match) {
    const protocol = match[1];
    const user = match[2] || match[3] || '';
    const pass = match[4] || match[5] || '';
    const host = match[6];
    let db = match[7] || '';
    let query = match[8] || '';

    // If db path is empty or just '/', default to /animal-rescue
    if (!db || db === '/') {
      db = '/animal-rescue';
    }

    if (!query) {
      query = '?retryWrites=true&w=majority';
    }

    return `${protocol}${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${host}${db}${query}`;
  }

  return cleaned;
}

/**
 * Connect to MongoDB Atlas or local MongoDB instance
 */
export async function connectMongoDB() {
  const rawUri = process.env.MONGODB_URI;

  if (!rawUri) {
    console.log('ℹ️  No MONGODB_URI found in .env — using local JSON database.');
    return false;
  }

  const cleanedUri = cleanMongoUri(rawUri);

  try {
    console.log('🍃 Connecting to MongoDB Atlas...');
    await mongoose.connect(cleanedUri, {
      serverSelectionTimeoutMS: 8000
    });

    isMongoConnected = true;
    mongoConnectionError = null;
    const dbName = mongoose.connection.name;
    console.log(`✅ MongoDB Connected Successfully! [Database: ${dbName}]`);
    return true;
  } catch (err) {
    isMongoConnected = false;
    mongoConnectionError = err.message;

    console.warn(`\n⚠️  MongoDB Connection Warning: ${err.message}`);
    if (err.message.includes('bad auth') || err.message.includes('Authentication failed')) {
      console.warn('👉 Tip: Check your MongoDB Atlas Database User password in backend/.env.');
      console.warn('   Ensure the user exists under Atlas -> "Database Access", and the password is correct.\n');
    } else if (err.message.includes('whitelist') || err.message.includes('timed out')) {
      console.warn('👉 Tip: Ensure your current IP is whitelisted under Atlas -> "Network Access" (or allow 0.0.0.0/0).\n');
    }
    console.log('📦 Falling back gracefully to local JSON database store.');
    return false;
  }
}

/**
 * Sync in-memory JSON data to MongoDB collections
 */
export async function syncDataToMongo(data) {
  if (!isMongoConnected) return;

  try {
    if (data.users && data.users.length > 0) {
      for (const u of data.users) {
        await User.findOneAndUpdate({ email: u.email.toLowerCase() }, u, { upsert: true });
      }
    }

    if (data.rescues && data.rescues.length > 0) {
      for (const r of data.rescues) {
        await Rescue.findOneAndUpdate({ id: r.id }, r, { upsert: true });
      }
    }

    if (data.adoptions && data.adoptions.length > 0) {
      for (const a of data.adoptions) {
        await AdoptionPet.findOneAndUpdate({ id: a.id }, a, { upsert: true });
      }
    }

    if (data.adoptionApplications && data.adoptionApplications.length > 0) {
      for (const app of data.adoptionApplications) {
        await AdoptionApplication.findOneAndUpdate({ id: app.id }, app, { upsert: true });
      }
    }

    if (data.consultationRequests && data.consultationRequests.length > 0) {
      for (const c of data.consultationRequests) {
        await ConsultationRequest.findOneAndUpdate({ id: c.id }, c, { upsert: true });
      }
    }

    if (data.petCareGuides && data.petCareGuides.length > 0) {
      for (const g of data.petCareGuides) {
        await PetCareGuide.findOneAndUpdate({ id: g.id }, g, { upsert: true });
      }
    }

    if (data.helpers && data.helpers.length > 0) {
      for (const h of data.helpers) {
        await Helper.findOneAndUpdate({ id: h.id }, h, { upsert: true });
      }
    }
  } catch (syncErr) {
    console.warn('⚠️  MongoDB background sync warning:', syncErr.message);
  }
}

/**
 * Load initial data from MongoDB if available
 */
export async function loadDataFromMongo() {
  if (!isMongoConnected) return null;

  try {
    const [
      users,
      rescues,
      adoptions,
      adoptionApplications,
      consultationRequests,
      petCareGuides,
      helpers
    ] = await Promise.all([
      User.find({}).lean(),
      Rescue.find({}).lean(),
      AdoptionPet.find({}).lean(),
      AdoptionApplication.find({}).lean(),
      ConsultationRequest.find({}).lean(),
      PetCareGuide.find({}).lean(),
      Helper.find({}).lean()
    ]);

    // If MongoDB has records, return them formatted
    if (users.length > 0 || rescues.length > 0 || adoptions.length > 0) {
      return {
        rescues: rescues.map(r => ({ ...r, _id: undefined, __v: undefined })),
        adoptions: adoptions.map(a => ({ ...a, _id: undefined, __v: undefined })),
        petCareGuides: petCareGuides.map(g => ({ ...g, _id: undefined, __v: undefined })),
        helpers: helpers.map(h => ({ ...h, _id: undefined, __v: undefined })),
        adoptionApplications: adoptionApplications.map(app => ({ ...app, _id: undefined, __v: undefined })),
        consultationRequests: consultationRequests.map(c => ({ ...c, _id: undefined, __v: undefined })),
        users: users.map(u => ({ ...u, _id: undefined, __v: undefined }))
      };
    }
    return null;
  } catch (err) {
    console.warn('⚠️ Could not load data from MongoDB:', err.message);
    return null;
  }
}

export function getMongoStatus() {
  return {
    connected: isMongoConnected,
    database: isMongoConnected ? mongoose.connection.name : null,
    error: mongoConnectionError
  };
}
