import express from 'express';
import multer from 'multer';
import cookieParser from 'cookie-parser';
import { userSignup, userLogIn, expertLogIn, userLogout, addQuestion, distributorSignup, distributorLogIn, getWeather, getQuestion, addWarehouse, getWarehouse, addAnswer, getAnswer, addProblem, getProblem, addProblemAnswer, getSolution } from '../controller/user-controller.js';
import { authenticateToken } from '../util/SecretToken.js';

// Create a new express Router
const router = express.Router();

// Use cookie-parser middleware
router.use(cookieParser());

// Multer configuration for file uploads (in-memory storage for serverless)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Routes for user actions
router.post('/signup', userSignup);
router.post('/login', userLogIn);
router.post('/logout', userLogout);
router.post('/expertLogin', expertLogIn);
router.post('/distributor-signup', distributorSignup);
router.post('/distributor-login', distributorLogIn);

// Protected Routes
router.post('/add-question', authenticateToken, addQuestion);
router.get('/questions', authenticateToken, getQuestion);
router.post('/add-warehouse', authenticateToken, addWarehouse);
router.get('/get-warehouse', authenticateToken, getWarehouse);
router.post('/answer', authenticateToken, addAnswer);
router.get('/answers', getAnswer);

// Problem routes with file upload
router.post('/problems', authenticateToken, upload.single('img'), addProblem); // Handle file uploads
router.get('/problems', authenticateToken, getProblem);
router.post('/answer-problem', authenticateToken, addProblemAnswer);
router.get('/solutions', authenticateToken, getSolution);
router.get('/weather', getWeather);

export default router;
