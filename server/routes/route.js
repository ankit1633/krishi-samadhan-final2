import express from 'express';
import multer from 'multer';
import cookieParser from 'cookie-parser';
import cloudinary from '../util/Cloudinary.js';
import streamifier from 'streamifier';
import { authenticateToken } from '../util/SecretToken.js';
import { userSignup, userLogIn, expertLogIn, userLogout, addQuestion, distributorSignup, distributorLogIn, getWeather, getQuestion, addWarehouse, getWarehouse, addAnswer, getAnswer, addProblem, getProblem, addProblemAnswer, getSolution } from '../controller/user-controller.js';



// Create a new express Router
const router = express.Router();

// Use cookie-parser middleware
router.use(cookieParser());

// Multer configuration for file uploads (in-memory storage for serverless)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware to handle file uploads
const uploadMiddleware = upload.single('img');

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
router.post('/problems', authenticateToken, uploadMiddleware, async (req, res) => {
  try {
    const { name, email, problem } = req.body;
    let imgUrl = '';

    if (req.file) {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'demo' },
        (error, result) => {
          if (error) return res.status(500).json({ message: 'Image upload failed', error });
          imgUrl = result.secure_url;
          // Save the problem with image URL
          const newProblem = new Problem({ name, email, problem, img: imgUrl });
          newProblem.save()
            .then(() => res.status(200).json({ message: 'Problem added successfully' }))
            .catch(saveError => res.status(500).json({ message: 'Error adding problem', error: saveError }));
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    } else {
      // Save the problem without an image
      const newProblem = new Problem({ name, email, problem, img: imgUrl });
      newProblem.save()
        .then(() => res.status(200).json({ message: 'Problem added successfully' }))
        .catch(saveError => res.status(500).json({ message: 'Error adding problem', error: saveError }));
    }
  } catch (error) {
    console.error('Error occurred while adding problem:', error);
    res.status(500).json({ message: 'Error adding problem' });
  }
});

router.get('/problems', authenticateToken, getProblem);
router.post('/answer-problem', authenticateToken, addProblemAnswer);
router.get('/solutions', authenticateToken, getSolution);
router.get('/weather', getWeather);

export default router;
