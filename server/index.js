import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import multer from 'multer';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import Router from './routes/route.js'
import Connection from './database/db.js';
import defaultData from './defaultData.js';
import cloudinary from 'cloudinary';
// Initialize dotenv to load environment variables
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Get current directory and filename (__dirname in ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create Express app
const app = express();

// Middleware
app.use(cors(
  {
    methods: ["POST","GET"],
    credentials: true
  }
));
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
app.use('/', Router); // Assuming API routes should be prefixed with '/api'

// Endpoint to serve the React app's index.html
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'frontend', 'build', 'index.html'));
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Example endpoint for file uploads
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Upload file to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.v2.uploader.upload_stream(
        { resource_type: 'auto' },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(req.file.buffer);
    });

    res.json({ file: result });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Error uploading file' });
  }
});
// Basic error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


defaultData();

// Export the app for testing or potential future use
export default (req, res) => {
  // Ensure app is prepared for each request
  app(req, res);
};

