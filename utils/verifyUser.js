import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {
  // Try to retrieve the token from the cookies
  let token = req.cookies.access_token;

  // If the token is not in cookies, check the Authorization header
  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;

    // Check if the Authorization header contains a Bearer token
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1]; // Extract the token
    }
  }

  // If no token was found in both cookies and headers, return an error
  if (!token) {
    return next(errorHandler(401, 'Unauthorized: No token provided'));
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return next(errorHandler(401, 'Unauthorized: Token has expired'));
      } else if (err.name === 'JsonWebTokenError') {
        return next(errorHandler(401, 'Unauthorized: Invalid token'));
      } else {
        return next(errorHandler(401, 'Unauthorized: Token verification failed'));
      }
    }

    // Attach the decoded user information to the request object
    req.user = user;
    next(); // Proceed to the next middleware
  });
};

