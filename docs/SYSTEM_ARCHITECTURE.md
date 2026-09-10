# System Architecture & Technical Design

The **WattVision Smart Energy Monitor** is built on a multi-tier Internet-of-Things (IoT) architecture designed for reliability, high-resolution telemetry, electrical safety, and responsive real-time analytics.

---

## 🏛️ End-to-End System Block Diagram

```text
+-----------------------------------------------------------------------------------+
|                        1. ELECTRICAL LOAD & GRID INTERFACE                        |
|                                                                                   |
|    230V AC Single-Phase 50Hz Mains Supply Line (Domestic / Commercial Load)       |
+-----------------------------------------------------------------------------------+
                                         │
                    ┌────────────────────┴────────────────────┐
                    │                                         │
      (High-Voltage Terminal Leads)             (Non-invasive 100A CT Clamp)
                    │                                         │
                    ▼                                         ▼
+-----------------------------------------------------------------------------------+
|                     2. SENSING & METERING LAYER (PZEM-004T)                       |
|                                                                                   |
|    - Dedicated SD3004 Energy Metering ASIC                                        |
|    - Dual Optical Isolators (PC817) for High-Voltage Galvanic Safety Isolation    |
|    - Modbus-RTU Protocol Engine over 9600 Baud TTL Serial                         |
|    - Measurements: Voltage (V), Current (A), Active Power (W), Cumulative kWh,    |
|      Grid Frequency (Hz), and Power Factor (cos φ)                                |
+-----------------------------------------------------------------------------------+
                                         │
                                (TTL UART @ 9600 Baud)
                                (GPIO 16 RX2 / GPIO 17 TX2)
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|                   3. EDGE PROCESSING LAYER (ESP32-WROOM-32)                       |
|                                                                                   |
|    - Core 0: High-Priority Hardware UART Querying & 16-bit CRC Verification       |
|    - Core 1: 16x2 I2C Character LCD Display Refresh (1s) & Network Transport      |
|    - Wi-Fi 802.11 b/g/n Station Mode with Auto-Reconnection State Machine         |
|    - JSON Serialization & HTTP REST / WebSocket Dispatch                          |
+-----------------------------------------------------------------------------------+
                                         │
                         (Wi-Fi 2.4 GHz TCP/IP Network)
                         (HTTP POST / JSON / WebSocket)
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|                   4. BACKEND GATEWAY & TIME-SERIES STORAGE                        |
|                                                                                   |
|    - Node.js Express / Python FastAPI Microservice Gateway                        |
|    - TimescaleDB / InfluxDB for Timestamped Historical Electrical Metrics         |
|    - Real-Time WebSocket Pub/Sub Server                                           |
+-----------------------------------------------------------------------------------+
                                         │
                               (JSON Stream / HTTPS)
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|                   5. FRONTEND ANALYTICS & DASHBOARD (REACT 19)                    |
|                                                                                   |
|    - Dynamic Glassmorphism UI Architecture & Dark Theme Design Tokens             |
|    - Real-Time SVG Power Glow Area Chart with Recharts                            |
|    - Multi-Tier Indian DISCOM Tariff & Billing Forecast Calculator (INR ₹)        |
|    - CEA Grid Factor Carbon Footprint Tracker (0.82 kg CO2 / kWh)                 |
|    - Appliance-level Energy Disaggregation & Peak Load Anomaly Detection          |
+-----------------------------------------------------------------------------------+
```

---

## 🔬 Component-Level Architecture

### 1. Sensing Layer (PZEM-004T v3.0)
- **Metering Chip**: The module uses the dedicated V9881D / SD3004 high-accuracy energy metering processor with built-in Sigma-Delta ADCs.
- **Optocoupler Isolation**: The high-voltage AC mains section (terminal screw blocks) is completely separated from the low-voltage TTL serial pins (VCC, RX, TX, GND) via PC817 optical couplers. This guarantees complete electrical isolation and prevents lethal 230V surges from reaching the ESP32.
- **Current Sensing**: Employs a toroidal split-core Current Transformer (CT) that measures magnetic flux produced by AC current passing through the Live wire without cutting the conductor.

### 2. Edge Processing Layer (ESP32-WROOM-32)
- **Dual-Core Architecture**: Utilizes FreeRTOS task scheduling where sensor polling occurs deterministically on Core 0 while network connectivity and HTTP/WebSocket transmission occur asynchronously on Core 1.
- **Data Integrity**: Every Modbus-RTU frame returned by the sensor is validated against a 16-bit Cyclic Redundancy Check (CRC16). Corrupted packets caused by electrical electromagnetic interference (EMI) from heavy inductive loads are automatically discarded.

### 3. Application Presentation Layer (React 19 + Vite)
- **Reactive State Management**: Uses React Context (`EnergyContext.jsx` & `ToastContext.jsx`) for atomic state updates across 13 specialized views.
- **Optimized Rendering**: Real-time 1-second streaming charts utilize memoized SVG canvas layers with zero layout shifts and low CPU overhead.
