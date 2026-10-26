import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb, readDb } from './database/db.js';
import { connectMongoDB, syncDataToMongo, getMongoStatus } from './database/mongodb.js';
import rescueRoutes from './routes/rescue.js';
import adoptionRoutes from './routes/adoption.js';
import adoptRoutes from './routes/adopt.js';
import petcareRoutes from './routes/petcare.js';
import helperRoutes from './routes/helpers.js';
import usersRoutes from './routes/users.js';
import chatbotRoutes from './routes/chatbot.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Initialize Database JSON store & Connect to MongoDB
initDb();
connectMongoDB().then(connected => {
  if (connected) {
    const data = readDb();
    syncDataToMongo(data);
  }
});

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/adopt', adoptRoutes);
app.use('/api/adoption', adoptionRoutes);
app.use('/api/rescue', rescueRoutes);
app.use('/api/petcare', petcareRoutes);
app.use('/api/helpers', helperRoutes);
app.use('/api/users', usersRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Animal Rescue System Backend API is running smoothly' });
});

// Database status endpoint
app.get('/api/db-status', (req, res) => {
  res.json({
    status: 'ok',
    mongo: getMongoStatus()
  });
});

app.listen(PORT, () => {
  console.log(`🌸 Animal Rescue Backend Server running on http://localhost:${PORT}`);
});
