import express from 'express';
import multer from 'multer';
import {
    userSignup,
    userLogIn,
    expertLogIn,
    userLogout,
    addQuestion,
    distributorSignup,
    distributorLogIn,
    getWeather,
    getQuestion,
    addWarehouse,
    getWarehouse,
    addAnswer,
    getAnswer,
    addProblem,
    getProblem,
    addProblemAnswer,
    getSolution
} from '../controller/user-controller.js';
import { authenticateToken } from '../util/SecretToken.js';
import cookieParser from 'cookie-parser';

const router = express.Router();
const app = express();

app.use(cookieParser());

// Multer setup for handling file buffer
const storage = multer.memoryStorage(); // Store file in memory
const upload = multer({ storage: storage });

// Routes
router.post('/signup', authenticateToken, userSignup);
router.post('/login', authenticateToken,  userLogIn);
router.post('/logout',  authenticateToken,  userLogout);
router.post('/expertLogin', authenticateToken,  expertLogIn);
router.post('/distributor-signup', authenticateToken,  distributorSignup);
router.post('/distributor-login', authenticateToken,  distributorLogIn);

// Protected Routes
router.post('/add-question', authenticateToken, addQuestion);
router.get('/questions', authenticateToken, getQuestion);
router.post('/add-warehouse', authenticateToken, addWarehouse);
router.get('/get-warehouse', authenticateToken, getWarehouse);
router.post('/answer', authenticateToken, addAnswer);
router.get('/answers', getAnswer);

// Use multer's memory storage to handle file uploads as streams
router.post('/problems', authenticateToken, upload.single('img'), addProblem);

router.get('/problems', authenticateToken, getProblem);
router.post('/answer-problem', authenticateToken, addProblemAnswer);
router.get('/solutions', authenticateToken, getSolution);
router.get('/weather', getWeather);

export default router;
