import express from 'express';
import {
    userSignup, userLogIn, expertLogIn, userLogout, addQuestion,
    distributorSignup, distributorLogIn, getWeather, getQuestion, 
    addWarehouse, getWarehouse, addAnswer, getAnswer, addProblem, 
    getProblem, addProblemAnswer, getSolution
} from '../controller/user-controller.js';
import { authenticateToken } from '../util/SecretToken.js';
import cookieParser from 'cookie-parser';
import multer from 'multer';

const router = express.Router();
const app = express();
app.use(cookieParser());

const storage = multer.memoryStorage(); // Use memoryStorage for serverless environments
const upload = multer({ storage: storage });

export { upload };

// Public Routes
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
router.post('/problems', upload.single('img'), addProblem); // Handle file upload
router.get('/problems', authenticateToken, getProblem);
router.post('/answer-problem', authenticateToken, addProblemAnswer);
router.get('/solutions', authenticateToken, getSolution);
router.get('/weather', getWeather);

export default router;
