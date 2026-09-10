# 🏛️ WattVision System Architecture Specification

## 1. System Overview

WattVision is a full-stack IoT Smart Energy Management Platform engineered for residential, commercial, and laboratory electrical monitoring under Indian grid standards (230V AC ±10%, 50Hz ±1%).

```text
+-----------------------------------------------------------------------------------+
|                        1. PHYSICAL AC ELECTRICAL LOAD                             |
|                                                                                   |
|           230V AC Single Phase Line (Domestic / Lab Bench / Appliances)           |
+-----------------------------------------------------------------------------------+
                                         │
                    ┌────────────────────┴────────────────────┐
                    │                                         │
        (Direct Voltage Terminals)                (Non-invasive 100A CT Clamp)
                    │                                         │
                    ▼                                         ▼
+-----------------------------------------------------------------------------------+
|                   2. SENSING & ISOLATION LAYER (PZEM-004T v3.0)                   |
|                                                                                   |
|    - High-precision SD3004 Energy Metering ASIC                                   |
|    - Dual PC817 Optocouplers for Galvanic High-Voltage Isolation                  |
|    - Computes RMS V, RMS I, Active Power P, Energy kWh, Frequency Hz, Power Factor|
+-----------------------------------------------------------------------------------+
                                         │
                             (TTL UART 9600 Baud @ Modbus-RTU)
                             (GPIO 16 RX2 / GPIO 17 TX2)
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|                    3. EDGE PROCESSING LAYER (ESP32-WROOM-32)                      |
|                                                                                   |
|    - Dual Xtensa 32-bit LX6 Cores @ 240 MHz                                       |
|    - Core 0: Modbus RTU Interrogation, 16-bit CRC Checksum Verification           |
|    - Core 1: 16x2 I2C LCD Local Display, Wi-Fi 802.11 b/g/n, HTTP/MQTT Transport  |
+-----------------------------------------------------------------------------------+
                                         │
                             (Wi-Fi 2.4 GHz TCP/IP Network)
                             (HTTP POST / JSON / WebSocket)
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|                   4. BACKEND GATEWAY & WEBSOCKET ENGINE (NODE.JS)                 |
|                                                                                   |
|    - Express REST API (/api/telemetry, /api/billing, /api/tariff, /api/alerts)    |
|    - WebSocket Server (/ws) for sub-second telemetry broadcasting                 |
|    - Indian DISCOM Multi-Slab Calculation Engine (BESCOM, TANGEDCO, MSEDCL, etc.) |
|    - Grid Safety & Anomaly Engine (Overvoltage, Overcurrent, PF Degradation)      |
+-----------------------------------------------------------------------------------+
                                         │
                               (HTTP REST & WebSockets)
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|                   5. FRONTEND ANALYTICS DASHBOARD (REACT 19 + VITE)               |
|                                                                                   |
|    - Glassmorphism UI & Dark Theme Control Room Palette                           |
|    - Real-Time SVG Glow Area Chart (Recharts)                                     |
|    - Indian DISCOM Multi-Slab Tariff Forecaster & Carbon Footprint Explorer (₹)   |
|    - Appliance Disaggregation & Engineering Documentation                         |
+-----------------------------------------------------------------------------------+
```

---

## 2. Hardware Architecture

```text
+-------------------------------------------------------------------+
|                        ESP32-WROOM-32 MCU                         |
|                                                                   |
|   [GPIO 16 (RX2)] <------- TTL UART TX (5V/3.3V) <---+ PZEM-004T  |
|   [GPIO 17 (TX2)] -------> TTL UART RX (5V/3.3V) --->+ v3.0 AC    |
|                                                      | Meter IC   |
|   [GPIO 21 (SDA)] <=======> I2C Data <---------------+            |
|   [GPIO 22 (SCL)] <=======> I2C Clock <--------------+ 16x2 LCD   |
|                                                      | Display    |
|   [5V / VIN]      <------- Regulated 5V DC <---------+ HLK-PM01 / |
|   [GND]           <------- Common Ground <-----------+ USB Supply |
+-------------------------------------------------------------------+
```

---

## 3. Data Flow Specification

1. **Sampling**: PZEM-004T measures continuous voltage/current waveforms via shunt resistor and current transformer.
2. **ASIC Processing**: Internal 24-bit ADCs compute true RMS and integrate active power.
3. **Modbus Frame Query**: ESP32 issues `0x04` Read Input Registers command every 2 seconds.
4. **CRC Check**: ESP32 validates 16-bit Modbus CRC; rejects corrupt frames.
5. **Edge Batching**: ESP32 serializes valid metrics into JSON and transmits HTTP POST payload to `/api/telemetry/live`.
6. **Backend Processing**: Node.js verifies safety thresholds, computes reactive power $Q$, calculates progressive Indian DISCOM slab billing, and stores time-series history.
7. **Client Broadcast**: WebSocket server streams JSON packets to all connected React frontend dashboards.
