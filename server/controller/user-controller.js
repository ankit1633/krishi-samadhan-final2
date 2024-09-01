import User from '../model/user-schema.js';
import Expert from '../model/expert-schema.js';
import Question from '../model/question-schema.js';
import Warehouse from '../model/warehouse-schema.js';
import Problem from '../model/problem-schema.js';
import Distributor from '../model/distributor-schema.js';
import { createSecretToken } from '../util/SecretToken.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cloudinary from '../util/Cloudinary.js';
import dotenv from 'dotenv';
import axios from 'axios';
import { ObjectId } from 'mongodb';
import cookieParser from 'cookie-parser';
import path from 'path';
import dataUriToBuffer from 'data-uri-to-buffer';
dotenv.config();

const apiKey = process.env.WEATHER_API_KEY;

export const userSignup = async (req, res) => {
    try {
        const { firstname, lastname, email, password, username, phone } = req.body;

        // Check for existing user by username
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: "Username already exists" });
        }

        // Check for existing user by email
        const existingEmailUser = await User.findOne({ email });
        if (existingEmailUser) {
            return res.status(409).json({ message: "Email already in use" });
        }

        // Create new user
        const user = new User({ 
            firstname, 
            lastname, 
            email, 
            password,  // Password will be hashed by schema's pre-save hook
            username, 
            phone 
        });
        await user.save();

        // Create a token for the new user
        const token = await createSecretToken(user._id);

        // Set cookie with token
        res.cookie("token", token, {
            httpOnly: true, // Adjust based on your security needs
            secure: process.env.NODE_ENV === 'production', // Ensure cookies are sent over HTTPS in production
            sameSite: 'Strict', // Adjust based on your requirements
        });

        res.status(201).json({ message: "User signed up successfully", success: true, user });
    } catch (error) {
        console.error('Error details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const userLogIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            console.log('Missing fields:', { email, password });
            return res.status(400).json({ message: 'All fields are required' });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            console.log('User not found with email:', email);
            return res.status(401).json({ message: 'Incorrect email or password' });
        }

        const auth = await bcrypt.compare(password, user.password);
        if (!auth) {
            console.log('Password does not match for user:', email);
            return res.status(401).json({ message: 'Incorrect email or password' });
        }

        // Await the Promise returned by createSecretToken
        const token = await createSecretToken(user._id);

        if (!token) {
            console.error('Token creation failed');
            return res.status(500).json({ message: 'Token creation failed' });
        }

        // Set the cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Ensure cookies are sent over HTTPS in production
            sameSite: 'Strict', // Adjust based on your requirements
        });

        res.status(200).json({ message: 'User logged in successfully', success: true });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: error.message });
    }
};

export const userLogout = (req, res) => {
    try {
        // Clear the token cookie
        res.cookie('token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Ensure cookies are sent over HTTPS in production
            sameSite: 'Strict', // Adjust based on your requirements
            expires: new Date(0) // Set the cookie expiration date to the past to delete it
        });

        // Send a success response
        res.status(200).json({ message: 'User logged out successfully', success: true });
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({ message: 'Error during logout' });
    }
};

export const distributorSignup = async (request, response) => {
    try {
        const exist = await Distributor.findOne({ username: request.body.username });
        if (exist) {
            return response.status(409).json({ message: `Username already exists` });
        }

        const distributor = new Distributor(request.body); // Schema handles hashing
        await distributor.save();

        const token = await createSecretToken(distributor._id); // Changed user._id to distributor._id

        // Set cookie with token
        response.cookie("token", token, {
            withCredentials: true,
            httpOnly: false, // Adjust based on your security needs
        });

        response.status(201).json({ message: 'Distributor signed up successfully', distributor });

    } catch (error) {
        response.status(500).json({ message: error.message });
    }
};

export const distributorLogIn = async (request, response) => {
    try {
        const { email, password } = request.body;

        if (!email || !password) {
            return response.status(400).json({ message: 'Email and password are required' });
        }

        const distributor = await Distributor.findOne({ email: email.toLowerCase() });
        if (!distributor) {
            return response.status(401).json({ message: 'Invalid login credentials' });
        }

        const isMatch = await bcrypt.compare(password, distributor.password);
        if (isMatch) {
            // Generate a token
            const token = await createSecretToken(distributor._id);
            // Set the token in the cookie
            response.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Ensure cookies are sent over HTTPS in production
                sameSite: 'Strict',
            });

            return response.status(200).json({ message: `${distributor.username} login successful`, token });
        } else {
            return response.status(401).json({ message: 'Invalid login credentials' });
        }

    } catch (error) {
        response.status(500).json({ message: error.message });
    }
};

export const expertLogIn = async (request, response) => {
    try {
        const { username, password } = request.body;

        if (!username || !password) {
            return response.status(400).json({ message: 'Username and password are required' });
        }

        // Find the expert by username
        const expert = await Expert.findOne({ username });
        
        if (!expert) {
            return response.status(401).json({ message: 'Invalid login credentials' });
        }

        // Check if the password matches (assuming plain text password check; ideally, use bcrypt)
        const isMatch = password === expert.password; // Plain text comparison
        if (isMatch) {
            // Generate a token
            const token = await createSecretToken(expert._id);
            response.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Ensure cookies are sent over HTTPS in production
                sameSite: 'Strict',
            });

            // Send the token in the response
            return response.status(200).json({ message: `${username} login successful`, token });
        } else {
            return response.status(401).json({ message: 'Invalid login credentials' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        response.status(500).json({ message: error.message });
    }
};

export const addQuestion = async (request, response) => {
    const generateUniqueId = () => {
        return new ObjectId().toHexString();
    }
    try {
        const { name, email, question } = request.body;
        const existQuestion = await Question.findOne({ question });
        if (existQuestion) {
            return response.status(409).json({ message: `Question already exists` });
        }
        
        // Ensure unique id value
        const id = generateUniqueId(); // You need to implement this function to generate unique ids
        
        const newQuestion = new Question({ id, name, email, question });
        await newQuestion.save();
        response.status(200).json({ message: "Question added successfully" });
    } catch (error) {
        if (error.code === 11000) {
            // Handle duplicate key error
            return response.status(500).json({ message: "Error adding question: Duplicate key error" });
        } else {
            console.error("Error occurred while adding question:", error);
            response.status(500).json({ message: "Error adding question" });
        }
    }
};

export const getQuestion = async (request, response) => {
    try {
        const questions = await Question.find({ answer: { $eq: '' } });
        return response.status(200).json({
            data: questions
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
};

export const addWarehouse = async (request, response) => {
    const generateUniqueId = () => {
        return new ObjectId().toHexString();
    }
    try {
        const { name, email, address, contact, capacity, price } = request.body;
        const existWarehouse = await Warehouse.findOne({ address });
        if (existWarehouse) {
            return response.status(409).json({ message: `Warehouse already exists` });
        }
        
        // Ensure unique id value
        const id = generateUniqueId(); // You need to implement this function to generate unique ids
        
        const newWarehouse = new Warehouse({ id, name, email, address, contact, capacity, price });
        await newWarehouse.save();
        response.status(200).json({ message: "Warehouse added successfully" });
    } catch (error) {
        if (error.code === 11000) {
            // Handle duplicate key error
            return response.status(500).json({ message: "Error adding warehouse: Duplicate key error" });
        } else {
            console.error("Error occurred while adding warehouse:", error);
            response.status(500).json({ message: "Error adding warehouse" });
        }
    }
};

export const getWarehouse = async (request, response) => {
    try {
        const warehouses = await Warehouse.find({});
        return response.status(200).json({
            data: warehouses
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
};
//testing
export const addAnswer = async (request, response) => {
    try {
        // Extract answer data from the request body
        const { body, question } = request.body;

        // Find the question to which the answer will be added
        const existingQuestion = await Question.findOne({ question: question });

        // If the question exists, update it with the answer
        if (existingQuestion) {
            existingQuestion.answer = body; // Add the answer to the question
            await existingQuestion.save(); // Save the updated question
            return response.status(200).json({ message: 'Answer added successfully' });
        } else {
            // If the question does not exist, return an error
            return response.status(404).json({ message: 'Question not found' });
        }
    } catch (error) {
        console.error("Error occurred while adding answer:", error);
        response.status(500).json({ message: "Error adding answer" });
    }
};

export const getAnswer = async (request, response) => {
    try {
        const answers = await Question.find({});
        return response.status(200).json({
            data: answers
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
};

export const addProblem = async (req, res) => {
    const generateUniqueId = () => {
        return new ObjectId().toHexString();
    };

    try {
        const { name, email, problem } = req.body;
        let imgUrl = '';

        if (req.file) {
            // Ensure req.file exists and is a file object with buffer
            const createImage = async (img) => {
                try {
                    // Convert buffer to data URI format
                    const extension = path.extname(img.originalname).toString().slice(1); // Remove the dot
                    const base64Image = `data:image/${extension};base64,${img.buffer.toString('base64')}`;

                    // Upload image to Cloudinary
                    const result = await cloudinary.v2.uploader.upload(base64Image, { resource_type: 'image' });
                    imgUrl = result.secure_url; // Get the URL of the uploaded image
                } catch (uploadError) {
                    console.error('Error uploading image to Cloudinary:', uploadError);
                    throw new Error('Error uploading image');
                }
            };

            await createImage(req.file); // Call the createImage function
        }

        if (!problem || !problem.trim()) {
            return res.status(400).json({ message: 'Problem description is required' });
        }

        const id = generateUniqueId();
        const newProblem = new Problem({ id, name, email, problem, img: imgUrl });
        await newProblem.save();
        res.status(200).json({ message: 'Problem added successfully' });
    } catch (error) {
        console.error('Error occurred while adding problem:', error);
        res.status(500).json({ message: 'Error adding problem' });
    }
};

export const getProblem = async (req, res) => {
    try {
        // Fetch problems where answer is either an empty string or not set
        const problems = await Problem.find({ answer: { $eq: '' } });
        
        return res.status(200).json({
            data: problems
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
};

export const addProblemAnswer = async (request, response) => {
    try {
        const { body, problem } = request.body;
        const existingProblem = await Problem.findOne({ problem: problem });

        if (existingProblem) {
            existingProblem.answer = body;
            await existingProblem.save();
            return response.status(200).json({ message: 'Answer added successfully' });
        } else {
            return response.status(404).json({ message: 'Problem not found' });
        }
    } catch (error) {
        console.error("Error occurred while adding answer:", error);
        response.status(500).json({ message: "Error adding answer" });
    }
};

export const getSolution = async (req, res) => {
    try {
        const email = req.query.email; // Extract email from query params
        if (!email) {
            return res.status(400).json({ message: 'Email query parameter is required' });
        }

        const problems = await Problem.find({ email });
        if (problems.length === 0) {
            return res.status(404).json({ message: 'No solutions found for this email' });
        }

        res.status(200).json({ data: problems });
    } catch (error) {
        console.error('Error fetching problems:', error.message);
        res.status(500).json({ message: error.message });
    }
};

export const getWeather = async (req, res) => {
    try {
        const { lat, lon } = req.query;
        
        if (!lat || !lon) {
            return res.status(400).json({ message: 'Latitude and longitude are required' });
        }

        const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
            params: {
                lat,
                lon,
                appid: apiKey,
                units: 'metric',
            }
        });

        if (response.status === 200) {
            const data = response.data;
            return res.status(200).json({
                id: data.id,
                name: data.name,
                description: data.weather[0].description,
                temperature: data.main.temp,
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                rainChance: data.rain ? (data.rain['1h'] || 0) : 0,
            });
        } else {
            return res.status(response.status).json({ message: 'Error loading weather data' });
        }
    } catch (error) {
        console.error("Error fetching weather data:", error.message);
        return res.status(500).json({ message: error.message });
    }
};

// Vercel requires proper configuration for file uploads and environment variables. Make sure to configure Vercel settings accordingly.
