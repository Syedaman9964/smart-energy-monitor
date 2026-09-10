/**
 * ============================================================================
 * WATTVISION BACKEND GATEWAY & WEBSOCKET SERVER
 * ============================================================================
 * Central REST API & WebSocket Telemetry Gateway:
 *   - Serves HTTP REST endpoints for auth, telemetry, billing, tariffs, alerts, appliances.
 *   - Enforces authentication and RBAC middleware across sensitive endpoints.
 *   - Receives high-frequency telemetry from ESP32 microcontrollers via POST.
 *   - Broadcasts real-time JSON packets to authenticated web dashboards via WebSockets.
 *   - Runs an automatic live simulator if no physical ESP32 is currently sending.
 */

import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

import config from './config/index.js';
import db from './models/db.js';
import userModel from './models/userModel.js';
import telemetryProcessor from './services/telemetryProcessor.js';

import authRoutes from './routes/authRoutes.js';
import telemetryRoutes from './routes/telemetryRoutes.js';
import billingRoutes from './routes/billingRoutes.js';
import tariffRoutes from './routes/tariffRoutes.js';
import deviceRoutes from './routes/deviceRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import predictionRoutes from './routes/predictionRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();
const server = http.createServer(app);

// 1. Security Headers (Helmet)
app.use(helmet({
  contentSecurityPolicy: false, // Allows flexible inline dashboard widgets in dev
  crossOriginEmbedderPolicy: false
}));

// 2. Cookie Parser
app.use(cookieParser(config.cookieSecret));

// 3. CORS with explicit credentials support
const allowedOrigins = Array.isArray(config.corsOrigin) ? config.corsOrigin : [config.corsOrigin];
app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (ESP32, curl, mobile apps)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // Development fallback
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    return callback(new Error(`CORS origin '${origin}' not allowed by WattVision policy.`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-device-key']
}));

// 4. Body Parser with safety limit
app.use(express.json({ limit: '100kb' }));

// 5. Request logger (omits high-frequency telemetry polls for clean logs)
app.use((req, res, next) => {
  if (req.path !== '/api/telemetry/live' && req.method !== 'GET') {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  }
  next();
});

// 6. Public Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'WattVision Intelligent Energy Monitoring & Prediction Gateway',
    version: '2.1.0',
    timestamp: new Date().toISOString(),
    connectedWsClients: wss.clients.size,
    authenticatedWsClients: Array.from(wss.clients).filter(c => c.isAuthenticated).length,
    uptimeSeconds: Math.floor(process.uptime())
  });
});

// 7. API Routes
app.use('/api/auth', authRoutes);
app.use('/api/telemetry', telemetryRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/tariff', tariffRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/device', deviceRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/prediction', predictionRoutes);

// 8. Error handling
app.use(errorHandler);

// ============================================================================
// WEBSOCKET SERVER INITIALIZATION & AUTHENTICATION
// ============================================================================
const wss = new WebSocketServer({ server, path: '/ws' });

/**
 * Extracts and verifies JWT token from HTTP cookie or query parameter
 */
function verifyTokenString(tokenStr) {
  if (!tokenStr) return null;
  try {
    const decoded = jwt.verify(tokenStr, config.jwtSecret);
    const session = userModel.validateSession(decoded.sessionId);
    if (!session) return null;
    const user = userModel.findById(decoded.userId);
    return user ? userModel.getPublicUser(user) : null;
  } catch (e) {
    return null;
  }
}

function extractTokenFromRequest(req) {
  // 1. From Cookie header
  if (req.headers.cookie) {
    const match = req.headers.cookie.match(/wattvision_token=([^;]+)/);
    if (match && match[1]) {
      const decodedCookie = decodeURIComponent(match[1]);
      const valid = verifyTokenString(decodedCookie);
      if (valid) return valid;
    }
  }

  // 2. From URL query param (?token=... or ?ticket=...)
  try {
    const fullUrl = new URL(req.url, 'http://localhost');
    const tokenQuery = fullUrl.searchParams.get('token') || fullUrl.searchParams.get('ticket');
    if (tokenQuery) {
      const valid = verifyTokenString(tokenQuery);
      if (valid) return valid;
    }
  } catch (e) {}

  return null;
}

wss.on('connection', (ws, req) => {
  const clientIp = req.socket.remoteAddress;
  ws.isAuthenticated = false;
  ws.user = null;

  // Attempt immediate authentication via cookie or query token
  const verifiedUser = extractTokenFromRequest(req);

  if (verifiedUser) {
    ws.isAuthenticated = true;
    ws.user = verifiedUser;
    console.log(`[WebSocket] Authenticated client connected: ${verifiedUser.email} from ${clientIp}`);

    // Send immediate snapshot to authorized client
    ws.send(JSON.stringify({
      type: 'SNAPSHOT',
      data: db.getLatestTelemetry(),
      timestamp: new Date().toISOString()
    }));
  } else {
    // Unauthenticated at connect: grant grace period for client to submit { type: 'AUTH', token }
    console.log(`[WebSocket] Pending authentication from ${clientIp}...`);

    const authTimeout = setTimeout(() => {
      if (!ws.isAuthenticated && ws.readyState === WebSocket.OPEN) {
        console.log(`[WebSocket] Terminating unauthenticated client: ${clientIp}`);
        ws.send(JSON.stringify({
          type: 'AUTH_FAILED',
          error: 'WebSocket authentication timeout. Connection closed.'
        }));
        ws.close(4401, 'Unauthorized');
      }
    }, 4000);

    ws.authTimeout = authTimeout;
  }

  ws.on('message', (message) => {
    try {
      const parsed = JSON.parse(message.toString());

      // Handle Authentication Message
      if (parsed.type === 'AUTH') {
        const candidateUser = verifyTokenString(parsed.token);
        if (candidateUser) {
          if (ws.authTimeout) clearTimeout(ws.authTimeout);
          ws.isAuthenticated = true;
          ws.user = candidateUser;

          console.log(`[WebSocket] Authenticated via message: ${candidateUser.email}`);
          ws.send(JSON.stringify({
            type: 'AUTH_SUCCESS',
            user: candidateUser,
            timestamp: new Date().toISOString()
          }));

          // Send snapshot immediately
          ws.send(JSON.stringify({
            type: 'SNAPSHOT',
            data: db.getLatestTelemetry(),
            timestamp: new Date().toISOString()
          }));
        } else {
          ws.send(JSON.stringify({ type: 'AUTH_FAILED', error: 'Invalid session token' }));
          ws.close(4401, 'Authentication failed');
        }
        return;
      }

      // Handle Ping/Pong
      if (parsed.type === 'PING') {
        ws.send(JSON.stringify({ type: 'PONG', timestamp: Date.now() }));
      }
    } catch (e) {
      // Ignore malformed text
    }
  });

  ws.on('close', () => {
    if (ws.authTimeout) clearTimeout(ws.authTimeout);
  });
});

/**
 * Broadcasts telemetry packet ONLY to authenticated web clients
 */
export function broadcastTelemetry(payload) {
  const message = JSON.stringify({
    type: 'TELEMETRY_UPDATE',
    data: payload,
    timestamp: new Date().toISOString()
  });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && client.isAuthenticated) {
      client.send(message);
    }
  });
}

// ============================================================================
// AUTOMATIC SIMULATION ENGINE (When physical hardware is offline)
// ============================================================================
let lastHardwarePostTime = 0;

// Periodically check and generate realistic grid telemetry if no hardware packet arrived in last 5s
setInterval(() => {
  const now = Date.now();
  if (now - lastHardwarePostTime > 4500) {
    // Generate realistic simulated packet
    const current = db.getLatestTelemetry();
    const voltage = Number((229.5 + (Math.random() - 0.5) * 3.5).toFixed(1));
    const delta = (Math.random() - 0.48) * 80;
    const power = Number(Math.max(450, Math.min(3800, current.power + delta)).toFixed(1));
    const powerFactor = Number((0.95 + (Math.random() - 0.5) * 0.03).toFixed(2));
    const currentA = Number((power / (voltage * powerFactor)).toFixed(2));
    const frequency = Number((50.01 + (Math.random() - 0.5) * 0.08).toFixed(2));
    const energy = Number((current.energy + (power * 2) / (3600 * 1000)).toFixed(4));
    const energyToday = Number((current.energyToday + (power * 2) / (3600 * 1000)).toFixed(4));

    const simulated = telemetryProcessor.processPacket({
      deviceId: 'ESP32-SIMULATED-01',
      voltage,
      current: currentA,
      power,
      energy,
      energyToday,
      frequency,
      powerFactor,
      rssi: -58,
      uptimeSeconds: Math.floor(process.uptime())
    });

    broadcastTelemetry(simulated);
  }
}, 2000);

// Hook into telemetry route to update lastHardwarePostTime
app.post('/api/telemetry/live', (req, res, next) => {
  lastHardwarePostTime = Date.now();
  db.updateDeviceHealth({ isSimulated: false, pzemHardwareStatus: 'ONLINE_ACTIVE' });
  next();
});

// Start Server
const PORT = config.port;
server.listen(PORT, () => {
  console.log(`\n=============================================================`);
  console.log(`  ⚡ WATTVISION BACKEND GATEWAY RUNNING ON PORT ${PORT}`);
  console.log(`  🔗 REST API URL:  http://localhost:${PORT}/api/health`);
  console.log(`  📡 WEBSOCKET:     ws://localhost:${PORT}/ws`);
  console.log(`  🛡️  SECURITY:      JWT + HttpOnly Cookie + RBAC Activated`);
  console.log(`=============================================================\n`);
});

export default app;
