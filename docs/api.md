# 🌐 WattVision REST & WebSocket API Specification

## 1. Base URL & Protocol
- **REST Base URL**: `http://localhost:5000/api`
- **WebSocket URL**: `ws://localhost:5000/ws`

---

## 2. Telemetry Endpoints

### `GET /api/telemetry/live`
Returns the latest electrical metrics snapshot.

**Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "deviceId": "ESP32-WROOM-01",
    "voltage": 231.4,
    "current": 7.92,
    "power": 1780.5,
    "powerKw": 1.781,
    "energy": 142.85,
    "energyToday": 11.45,
    "frequency": 50.02,
    "powerFactor": 0.96,
    "apparentPower": 1832.7,
    "reactivePower": 433.8,
    "rssi": -62,
    "uptimeSeconds": 86400,
    "timestamp": "2026-08-17T22:30:00.000Z"
  }
}
```

### `POST /api/telemetry/live`
Ingests telemetry batch from ESP32 edge microcontroller.

**Request Body:**
```json
{
  "deviceId": "ESP32-WROOM-01",
  "voltage": 230.8,
  "current": 6.54,
  "power": 1450.0,
  "energy": 142.88,
  "frequency": 50.01,
  "powerFactor": 0.96,
  "wifiRssi": -64,
  "uptimeSeconds": 86450,
  "isSimulated": false
}
```

---

## 3. Billing & Tariff Endpoints

### `GET /api/billing/summary`
Returns Month-to-Date (MTD) bill and daily/monthly cost projections.

### `POST /api/billing/calculate`
Calculates custom multi-slab electricity bill for any Indian state DISCOM.

**Request Body:**
```json
{
  "totalKwh": 250,
  "tariffId": "bescom_karnataka",
  "sanctionedLoadKw": 4.0,
  "powerFactor": 0.94,
  "solarExportKwh": 30.0
}
```

**Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "discomName": "BESCOM (Karnataka Electricity Board)",
    "grossUnitsKwh": 250,
    "solarExportKwh": 30,
    "netBillableUnitsKwh": 220,
    "sanctionedLoadKw": 4,
    "baseEnergyCharge": 1368.5,
    "fixedCharges": 440,
    "facAmount": 77,
    "pfPenalty": 0,
    "pfRebate": 0,
    "electricityDuty": 169.7,
    "finalBill": 2055.2,
    "effectiveCostPerUnit": 9.34,
    "slabBreakdown": [
      { "slabIndex": 1, "label": "0 - 50 units (Lifeline)", "unitsConsumed": 50, "ratePerUnit": 4.15, "totalCost": 207.5 },
      { "slabIndex": 2, "label": "51 - 100 units", "unitsConsumed": 50, "ratePerUnit": 5.6, "totalCost": 280 },
      { "slabIndex": 3, "label": "101 - 200 units", "unitsConsumed": 100, "ratePerUnit": 7.15, "totalCost": 715 },
      { "slabIndex": 4, "label": "Above 200 units", "unitsConsumed": 20, "ratePerUnit": 8.2, "totalCost": 164 }
    ]
  }
}
```

---

## 4. WebSocket Protocol (`ws://localhost:5000/ws`)

### 1. Connection Established
Upon connection, the server sends a full snapshot payload:
```json
{
  "type": "SNAPSHOT",
  "data": { "voltage": 230.5, "current": 7.12, "power": 1600.0, ... }
}
```

### 2. Live Broadcast Packet (Every 2 seconds)
```json
{
  "type": "TELEMETRY_UPDATE",
  "data": {
    "voltage": 231.2,
    "current": 7.85,
    "power": 1750.4,
    "energy": 142.92,
    "frequency": 50.01,
    "powerFactor": 0.96,
    "timestamp": "2026-08-17T22:30:02.000Z"
  }
}
```
