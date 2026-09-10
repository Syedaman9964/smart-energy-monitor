# ⚡ WattVision - Backend Gateway & API Service

Node.js + Express + WebSocket backend telemetry server for the WattVision Smart Energy Monitor.

---

## 🚀 Key Features

1. **High-Frequency Ingestion**: Receives 6-parameter telemetry packets (`Voltage`, `Current`, `Power`, `Energy`, `Frequency`, `Power Factor`) from physical ESP32 microcontrollers over HTTP POST.
2. **WebSocket Real-Time Broadcast**: Streams sub-second electrical updates to connected web dashboard clients over `ws://localhost:5000/ws`.
3. **Indian DISCOM Billing Engine**: Multi-tier slab calculations for **BESCOM**, **TANGEDCO**, **MSEDCL**, **BSES**, and **UPPCL**, with fixed demand charges, Fuel Adjustment Charges (FAC), and statutory electricity duty.
4. **Grid Safety & Anomaly Detection**: Real-time evaluation against overvoltage (>255V), undervoltage (<195V), overcurrent (>25A), and inductive power factor degradation (<0.80).
5. **Automatic Fallback Simulator**: Seamlessly generates realistic AC grid waveforms when physical hardware is offline.

---

## 🛠️ Setup & Running

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Start production server
npm start
```

Default Endpoints:
- **Health Check**: `GET http://localhost:5000/api/health`
- **Live Telemetry**: `GET http://localhost:5000/api/telemetry/live`
- **Billing Summary**: `GET http://localhost:5000/api/billing/summary`
- **DISCOM Tariffs**: `GET http://localhost:5000/api/tariff/presets`
- **WebSocket Feed**: `ws://localhost:5000/ws`
