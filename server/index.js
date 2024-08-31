import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import multer from 'multer';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import Router from './routes/route.js';
import Connection from './database/db.js';
import defaultData from './defaultData.js';

// Initialize dotenv to load environment variables
dotenv.config();

// Get current directory and filename (__dirname in ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create Express app
const app = express();

// Middleware
const corsOptions = {
  origin: 'https://krishi-samadhan-final2-unkt.vercel.app', // Corrected URL
  credentials: true,
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser()); // Added cookie-parser

// Serve static files from the 'frontend/build' directory for production
app.use(express.static(join(__dirname, 'frontend', 'build')));

// Connect to MongoDB
const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.DB_PASSWORD;
Connection(USERNAME, PASSWORD);

// Define API routes
app.use('/api', Router); // Prefixed API routes with '/api'

// Endpoint to serve the React app's index.html
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'frontend', 'build', 'index.html'));
});

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Example endpoint for file uploads
app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ file: req.file });
});

// Basic error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Initialize default data
defaultData();

// Export the Express app
export default app;
