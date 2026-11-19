import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { initSocket } from './sockets/socketHandler.js';
import authRoutes from './routes/authRoutes.js';
import analysisRoutes from './routes/analysisRoutes.js';
import savedReportsRoutes from './routes/savedReportsRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// CORS configuration
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

initSocket(io);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'TruthLens AI News Intelligence API',
    timestamp: new Date().toISOString(),
    uptime: Math.round(process.uptime()),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/saved-reports', savedReportsRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: 'An unexpected internal error occurred.',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

const PORT = process.env.PORT || 5001;

// Start server (binds to 0.0.0.0 for cloud hosts like Render)
server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`  TruthLens AI Intelligence Server running on port ${PORT}`);
  console.log(`  WebSocket Engine: Active`);
  console.log(`======================================================\n`);
});

// Connect to MongoDB asynchronously
connectDB();
