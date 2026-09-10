# REST & WebSocket API Specification

This document provides the complete API schema and payload contracts for communication between the **ESP32 Edge Device**, the **Backend Gateway Server**, and the **React Dashboard Client**.

---

## 🌐 1. Live Telemetry Snapshot

### `GET /api/telemetry/live`
Retrieves the most recent instantaneous electrical telemetry snapshot.

**Response Headers:** `Content-Type: application/json`  
**Status Code:** `200 OK`

```json
{
  "deviceId": "ESP32-WROOM-01",
  "voltage": 230.4,
  "current": 5.82,
  "power": 1341.0,
  "energy": 148.42,
  "frequency": 50.01,
  "powerFactor": 0.96,
  "apparentPower": 1396.88,
  "reactivePower": 390.45,
  "wifiRssi": -62,
  "uptimeSeconds": 25920,
  "timestamp": "2026-08-17T22:30:00.000Z"
}
```

---

## ⚡ 2. Telemetry Ingestion (ESP32 Post)

### `POST /api/telemetry/live`
Endpoint invoked by the ESP32 firmware in `wifi_manager.h` to post batch sensor readings.

**Request Headers:** `Content-Type: application/json`  
**Request Payload:**
```json
{
  "deviceId": "ESP32-WROOM-01",
  "voltage": 230.4,
  "current": 5.82,
  "power": 1341.0,
  "energy": 148.42,
  "frequency": 50.01,
  "powerFactor": 0.96,
  "wifiRssi": -62,
  "uptimeSeconds": 25920
}
```

**Response:**
```json
{
  "success": true,
  "receivedAt": "2026-08-17T22:30:00.120Z",
  "status": "STORED"
}
```

---

## 💰 3. Tariff Configuration

### `POST /api/tariff/config`
Updates active electricity billing rates and slab rules.

**Request Payload:**
```json
{
  "currency": "₹",
  "baseRatePerKwh": 8.00,
  "peakRatePerKwh": 12.00,
  "offPeakRatePerKwh": 5.00,
  "fixedMonthlyCharge": 150.00,
  "taxRatePercent": 18.0,
  "peakHoursStart": "18:00",
  "peakHoursEnd": "22:00"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Tariff settings updated and persisted successfully"
}
```

---

## 🔌 4. Real-Time WebSocket Stream

### `ws://<host>:81/ws/telemetry`
High-frequency bidirectional streaming socket for live sub-second graph updates.

**Incoming Stream Payload:**
```json
{
  "type": "METRIC_UPDATE",
  "data": {
    "voltage": 231.2,
    "current": 5.75,
    "power": 1329.4,
    "energy": 148.43,
    "frequency": 50.00,
    "powerFactor": 0.96,
    "timestamp": 1786986600000
  }
}
```
