/**
 * ============================================================================
 * WATTVISION BACKEND GATEWAY & WEBSOCKET SERVER
 * ============================================================================
 * Central REST API & WebSocket Telemetry Gateway:
 *   - Serves HTTP REST endpoints for telemetry, billing, tariffs, alerts, appliances.
 *   - Receives high-frequency telemetry from ESP32 microcontrollers via POST.
 *   - Broadcasts real-time JSON packets to connected web dashboards via WebSockets.
 *   - Runs an automatic live simulator if no physical ESP32 is currently sending.
 */

import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import cors from 'cors';
import config from './config/index.js';
import db from './models/db.js';
import telemetryProcessor from './services/telemetryProcessor.js';

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

// Middleware
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  if (req.path !== '/api/telemetry/live' && req.method !== 'GET') {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  }
  next();
});

// Root API Health Status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'Intelligent Energy Monitoring and Prediction Backend Gateway',
    version: '2.1.0',
    timestamp: new Date().toISOString(),
    connectedWsClients: wss.clients.size,
    uptimeSeconds: Math.floor(process.uptime())
  });
});

// API Routes
app.use('/api/telemetry', telemetryRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/tariff', tariffRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/device', deviceRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/prediction', predictionRoutes);

// Error handling
app.use(errorHandler);

// ============================================================================
// WEBSOCKET SERVER INITIALIZATION
// ============================================================================
const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', (ws, req) => {
  const clientIp = req.socket.remoteAddress;
  console.log(`[WebSocket] Client connected: ${clientIp} (Total: ${wss.clients.size})`);

  // Send initial snapshot immediately upon connect
  ws.send(JSON.stringify({
    type: 'SNAPSHOT',
    data: db.getLatestTelemetry(),
    timestamp: new Date().toISOString()
  }));

  ws.on('message', (message) => {
    try {
      const parsed = JSON.parse(message.toString());
      if (parsed.type === 'PING') {
        ws.send(JSON.stringify({ type: 'PONG', timestamp: Date.now() }));
      }
    } catch (e) {
      // Ignore malformed text
    }
  });

  ws.on('close', () => {
    console.log(`[WebSocket] Client disconnected (Remaining: ${wss.clients.size})`);
  });
});

/**
 * Broadcasts telemetry packet to all connected web clients
 */
export function broadcastTelemetry(payload) {
  const message = JSON.stringify({
    type: 'TELEMETRY_UPDATE',
    data: payload,
    timestamp: new Date().toISOString()
  });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
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
  console.log(`=============================================================\n`);
});
