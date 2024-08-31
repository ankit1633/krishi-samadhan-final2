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
app.use(cors({
  origin: '*', // Allow all origins (adjust as needed)
  methods: ["POST", "GET"],
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files from the 'frontend/build' directory for production
app.use(express.static(join(__dirname, 'frontend', 'build')));

// Connect to MongoDB
const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.DB_PASSWORD;
Connection(USERNAME, PASSWORD);

// Define API routes
app.use('/', Router); // Assuming API routes should be prefixed with '/api'

// Endpoint to serve the React app's index.html
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'frontend', 'build', 'index.html'));
});

// Basic error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Initialize default data
defaultData();

// Export the app for testing or potential future use
export default app;
