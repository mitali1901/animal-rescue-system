import express from 'express';
import cors from 'cors';
import { initDb } from './database/db.js';
import rescueRoutes from './routes/rescue.js';
import adoptionRoutes from './routes/adoption.js';
import petcareRoutes from './routes/petcare.js';
import helperRoutes from './routes/helpers.js';
import usersRoutes from './routes/users.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database JSON store
initDb();

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/rescue', rescueRoutes);
app.use('/api/adoption', adoptionRoutes);
app.use('/api/petcare', petcareRoutes);
app.use('/api/helpers', helperRoutes);
app.use('/api/users', usersRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Animal Rescue System Backend API is running smoothly' });
});

app.listen(PORT, () => {
  console.log(`🌸 Animal Rescue Backend Server running on http://localhost:${PORT}`);
});
