import dotenv from 'dotenv';
dotenv.config();
console.log("OPENAI_API_KEY =", process.env.OPENAI_API_KEY);
console.log("MONGODB_URI =", process.env.MONGODB_URI);

// --- DEBUGGING STEP ---
// This line will run when the server starts.
console.log("Checking for API Key...");
console.log(`Is the OpenAI Key loaded? ${process.env.OPENAI_API_KEY ? 'Yes, it is!' : 'No, it is MISSING.'}`);
// --------------------

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import analyzeRoutes from './routes/analyzeRoutes.js';


const app = express();

app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

import path from 'path';
import { fileURLToPath } from 'url';

// These 2 lines are needed because you're using ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve the 'reports' folder
app.use('/reports', express.static(path.join(__dirname, 'reports')));

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Routes
app.use('/api', analyzeRoutes); // Changed to /api for clarity

// Root route
app.get('/', (req, res) => {
  res.send('SEO AI Backend is running');
});

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log('Connected to MongoDB Atlas');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
});

