import jwt from 'jsonwebtoken';

// Creating a token
export const createSecretToken = (userId) => {
    return new Promise((resolve, reject) => {
        jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' }, (err, token) => {
            if (err) {
                console.error('Error creating token:', err);
                console.log('token generation failed');
                return reject(err);
            }
            console.log('token generation completed');
            resolve(token);
        });
    });
};

export const authenticateToken = (req, res, next) => {
    const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1];

    if (!token) {
        console.log('No token found');
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
            console.error('Token verification failed:', err);
            return res.status(403).json({ message: 'Invalid token.' });
        }

        req.user = user; // Attach user information to the request
        next(); // Pass control to the next handler
    });
};