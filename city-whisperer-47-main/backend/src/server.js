import http from 'http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { Server as SocketIOServer } from 'socket.io';
import rateLimit from 'express-rate-limit';

import { connectDb } from './setup/db.js';
import { configureCloudinary } from './setup/cloudinary.js';
import { seedAdminIfMissing } from './setup/seed.js';
import { setupSockets } from './socket.js';
import authRoutes from './routes/auth.routes.js';
import issueRoutes from './routes/issue.routes.js';
import feedbackRoutes from './routes/feedback.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import adminRoutes from './routes/admin.routes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:8081',
  'http://localhost:8082',
  ...(process.env.CLIENT_ORIGIN ? [process.env.CLIENT_ORIGIN] : [])
];

const io = new SocketIOServer(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }
});

app.set('io', io);

// Middleware
app.use(helmet());
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 });
app.use('/api/', limiter);

// Routes
app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/feedbacks', feedbackRoutes);
app.use('/api/analytics', analyticsRoutes);

setupSockets(io);
io.on('connection', (socket) => {
  console.log('🔌 Socket connected:', socket.id);
});

// --- 🛡️ Robust initialization with error handling ---
try {
  await connectDb();
} catch (err) {
  console.error('❌ Failed to connect to MongoDB:', err?.message || err);
  process.exit(1);
}
try {
  configureCloudinary();
  console.log('✅ Cloudinary configured');
} catch (err) {
  console.warn('⚠️ Cloudinary not configured or failed to initialize. Continuing without uploads.');
}

// --- 🔧 Stable dynamic port logic ---
const startServer = (port) => {
  const onError = (err) => {
    if (err && err.code === 'EADDRINUSE') {
      const fallback = port === 4000 ? 5000 : port + 1;
      console.warn(`⚠️  Port ${port} in use. Trying :${fallback}...`);
      server.off('error', onError);
      startServer(fallback);
    } else {
      console.error('❌ Server error:', err);
      process.exit(1);
    }
  };
  server.once('error', onError);
  server.listen(port, () => {
    console.log(`✅ SmartCityFix backend running on :${port}`);
    server.off('error', onError);
  });
};

await seedAdminIfMissing();
startServer(Number(process.env.PORT) || 4000);

// --- 🧯 Global guards ---
process.on('unhandledRejection', (reason) => console.error('Unhandled Rejection:', reason));
process.on('uncaughtException', (err) => console.error('Uncaught Exception:', err));
io.engine.on('connection_error', (err) => console.error('Socket.IO connection error:', err?.message || err));
