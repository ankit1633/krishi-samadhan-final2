import express from 'express';
import { userSignup, userLogIn, expertLogIn,userLogout, addQuestion,distributorSignup,distributorLogIn,getWeather, getQuestion,addWarehouse,getWarehouse, addAnswer, getAnswer , addProblem , getProblem, addProblemAnswer,getSolution} from '../controller/user-controller.js';
import { authenticateToken } from '../util/SecretToken.js';
import cookieParser from 'cookie-parser';
const router = express.Router();
import multer from 'multer';
const app = express();
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

export { upload };

router.post('/signup', userSignup);
router.post('/login', userLogIn);
router.post('/logout', userLogout);
router.post('/expertLogin', expertLogIn);
router.post('/distributor-signup', distributorSignup);
router.post('/distributor-login', distributorLogIn);

// Protected Routes
router.post('/add-question', authenticateToken, addQuestion); // Endpoint for adding a question
router.get('/questions', authenticateToken, getQuestion); // Endpoint for getting questions
router.post('/add-warehouse', authenticateToken, addWarehouse);
router.get('/get-warehouse', authenticateToken, getWarehouse);
router.post('/answer', authenticateToken, addAnswer); // Endpoint for adding an answer
router.get('/answers', getAnswer); // Endpoint for getting answers
router.post('/problems', authenticateToken, upload.single('img'), addProblem); // Add authentication and file upload
router.get('/problems', authenticateToken, getProblem);
router.post('/answer-problem', authenticateToken, addProblemAnswer);
router.get('/solutions', authenticateToken,getSolution);
router.get('/weather',  getWeather);

export default router;
