import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'; // Corrected the cors import to use ES modules
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js';
import commentRoutes from './routes/comment.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('MongoDb is connected');
  })
  .catch((err) => {
    console.log(err);
  });

const __dirname = path.resolve();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ // Ensure the cors middleware is correctly applied
  origin: "*", // For development. Change this in production to specific origins
}));

// Routes
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);

// Serve static files (if needed)
// app.use(express.static(path.join(__dirname, '/client/dist')));

// Root Route
app.get("/", (req, res) => {
  res.send("Welcome to Donocare Services");
});

// Catch-all route (if using frontend routing, uncomment for production)
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
// });

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
