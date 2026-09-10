# ⚡ WattVision - Smart Energy Monitoring & IoT Analytics Platform

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.0-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.2-purple.svg)](https://vitejs.dev/)
[![ESP32](https://img.shields.io/badge/ESP32-Xtensa%20LX6-red.svg)](https://espressif.com/)
[![PZEM-004T](https://img.shields.io/badge/Sensor-PZEM--004T%20v3.0-orange.svg)](https://innovatorsguru.com/pzem-004t-v3/)
[![License](https://img.shields.io/badge/License-MIT-brightgreen.svg)](LICENSE)

An intelligent, edge-connected IoT Energy Management and Monitoring System featuring an **ESP32 Dual-Core Microcontroller**, **PZEM-004T AC Multi-Function Energy Meter Sensor**, **Node.js Express + WebSocket Telemetry Gateway**, and a **React 19 + Vite** real-time analytics control-room dashboard.

---

## 🎯 Project Overview & Problem Statement

Conventional electromechanical and static electronic energy meters are passive devices that only record cumulative energy (kWh) at the end of a monthly billing cycle. Consumers and facility managers have zero visibility into:
1. **Instantaneous power spikes** and continuous phantom standby power drains.
2. **Power factor ($\cos\varphi$) penalties** and reactive inductive losses caused by inductive motor loads (AC compressors, pumps).
3. **Grid instability** (voltage surges $>255\text{V}$, brownouts $<195\text{V}$, and frequency drift).
4. **Predictive electricity costs** under progressive multi-slab Indian DISCOM tariff structures.

**WattVision** solves this challenge by capturing 6 real-time electrical parameters (**Voltage, Current, Active Power, Energy, Frequency, and Power Factor**) with hardware optocoupler isolation, broadcasting live telemetry over Wi-Fi, and visualizing analytics through a web dashboard.

---

## 🌟 Key Features

- **⚡ Real-Time Electrical Telemetry**: Continuous monitoring of RMS Voltage (V), Current (A), Active Power (W), Cumulative Energy (kWh), Grid Frequency (Hz), and Power Factor ($\cos\varphi$).
- **📊 Live Power Consumption Glow Chart**: Streaming area chart with glowing SVG gradients, sub-second refresh, and multi-range analysis (Live, 24h, 7d, 30d, 12m).
- **💰 Indian DISCOM Multi-Slab Tariff Engine**: Accurate electricity billing forecasting in Indian Rupees (₹) with slab tiers (**BESCOM Karnataka**, **TANGEDCO Tamil Nadu**, **MSEDCL Maharashtra**, **BSES Delhi**, **UPPCL Uttar Pradesh**), fixed demand charges, Fuel Adjustment Charges (FAC), and statutory electricity duty.
- **🌱 Carbon Emission Analytics**: Real-time greenhouse gas calculation based on the Central Electricity Authority (CEA) India baseline grid emission factor ($0.82\text{ kg CO}_2/\text{kWh}$).
- **🔌 Appliance Disaggregation**: Real-time breakdown of domestic electrical loads (Inverter AC, Storage Geyser, Refrigerator, Washing Machine, Induction Cooktop, BLDC Fans).
- **📟 Dual Display Redundancy**: Local 16x2 I2C Character LCD on the hardware device + responsive cloud React web dashboard.
- **🚨 Grid Safety & Anomaly Engine**: Automatic real-time detection of overvoltage, overcurrent, and power factor degradation with automated alerts.
- **📚 Engineering Documentation & Viva Voce Guide**: In-app technical documentation viewer and 40+ Viva Voce question defense guide for college external examiners.

---

## 🏛️ System Architecture

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
|    - Dedicated SD3004 / V9881D Energy Metering ASIC                               |
|    - Dual Optical Isolators (PC817) for High-Voltage Galvanic Safety Isolation    |
|    - Measures: Voltage, Current, Active Power, Energy, Frequency, Power Factor    |
+-----------------------------------------------------------------------------------+
                                         │
                                (TTL UART @ 9600 Baud)
                                (GPIO 16 RX2 / GPIO 17 TX2)
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|                   3. EDGE PROCESSING LAYER (ESP32-WROOM-32)                       |
|                                                                                   |
|    - Core 0: Modbus-RTU UART Querying & 16-bit CRC Verification                   |
|    - Core 1: 16x2 I2C Character LCD Display (1s) & Wi-Fi Network Transport        |
|    - Dual-Mode: Real PZEM Hardware Sensing + Automatic Benchtop Simulation Mode   |
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
|                   5. FRONTEND WEB DASHBOARD (REACT 19 + VITE)                     |
|                                                                                   |
|    - Glassmorphism Design System & Dark Theme Control Room Palette                |
|    - Real-Time SVG Glow Area Chart (Recharts)                                     |
|    - Multi-Tier Indian DISCOM Tariff & Carbon Offsets Calculator (INR ₹)          |
+-----------------------------------------------------------------------------------+
```

---

## 📁 Complete Project File Tree

```text
smart-energy-monitor/
├── .env.example                     # Environment configuration template
├── README.md                        # Master project documentation
├── package.json                     # Frontend & root npm run scripts
├── vite.config.js                   # Vite configuration
├── index.html                       # HTML application entry point
│
├── frontend (Root / src)/
│   ├── src/
│   │   ├── components/              # Modular UI components
│   │   │   ├── Dashboard/           # Overview widgets & real-time cards
│   │   │   ├── Charts/              # Recharts SVG streaming visualizations
│   │   │   ├── EnergyCards/         # Metric cards (V, I, P, kWh, Hz, PF)
│   │   │   ├── Sidebar/             # Navigation sidebar
│   │   │   ├── Header/              # TopBar with clock & status
│   │   │   ├── Alerts/              # Real-time alert feed components
│   │   │   └── Common/              # AnimatedNumber, Modal, Search, Badges
│   │   ├── data/                    # Appliance profiles & Indian DISCOM tariffs
│   │   ├── services/                # Telemetry service & REST/WebSocket ApiService
│   │   ├── utils/                   # Electrical formulas, INR currency & IST formatters
│   │   ├── pages/                   # 13 Dedicated feature views
│   │   ├── styles/                  # Modular CSS design system tokens
│   │   ├── App.jsx                  # Main application router
│   │   └── main.jsx                 # Vite application entry point
│   └── public/                      # Static assets & icons
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── index.js             # Environment & threshold configurations
│   │   ├── models/
│   │   │   └── db.js                # Database storage engine & state store
│   │   ├── services/
│   │   │   ├── billingEngine.js     # Indian DISCOM multi-slab calculation engine
│   │   │   └── telemetryProcessor.js# Telemetry packet validation & anomaly detection
│   │   ├── controllers/
│   │   │   ├── telemetryController.js # Live/historical telemetry handlers
│   │   │   ├── billingController.js   # MTD bill & forecasting handlers
│   │   │   ├── tariffController.js    # DISCOM tariff preset management
│   │   │   └── alertController.js     # Alert acknowledgment handlers
│   │   ├── routes/
│   │   │   ├── telemetryRoutes.js   # /api/telemetry routes
│   │   │   ├── billingRoutes.js     # /api/billing routes
│   │   │   ├── tariffRoutes.js      # /api/tariff routes
│   │   │   ├── alertRoutes.js       # /api/alerts routes
│   │   │   ├── deviceRoutes.js      # /api/device routes
│   │   │   └── analyticsRoutes.js   # /api/analytics routes
│   │   ├── middleware/
│   │   │   └── errorHandler.js      # Global error middleware
│   │   └── server.js                # Express & WebSocket gateway server
│   ├── package.json                 # Backend dependencies (express, ws, cors)
│   ├── .env.example                 # Backend environment template
│   └── README.md                    # Backend documentation
│
├── esp32/
│   ├── platformio.ini               # PlatformIO build configuration
│   ├── src/
│   │   └── main.cpp                 # Main C++ execution loop & RTOS scheduling
│   ├── include/
│   │   ├── config.h                 # Pinout definitions, Wi-Fi credentials, API endpoints
│   │   ├── pzem_handler.h           # PZEM Modbus UART driver + Simulation Fallback
│   │   ├── lcd_handler.h            # 16x2 I2C character LCD display driver
│   │   ├── wifi_manager.h           # Wi-Fi auto-reconnect & HTTP POST client
│   │   └── mqtt_client_handler.h    # MQTT PubSubClient integration
│   └── README.md                    # ESP32 flashing & circuit wiring guide
│
└── docs/
    ├── architecture.md              # System, hardware & software architecture
    ├── api.md                       # REST & WebSocket API specification
    ├── esp32.md                     # ESP32 firmware engineering specification
    ├── pzem-integration.md          # PZEM-004T Modbus registers & CT safety
    ├── india-billing-engine.md      # Indian DISCOM slab tariff mathematics
    ├── setup.md                     # Installation & running instructions
    └── viva-questions.md            # 40+ Viva Voce external defense Q&A
```

---

## ⚡ Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend Web App** | React 19, Vite, Recharts, Framer Motion, Lucide Icons, Vanilla CSS Glassmorphism |
| **Backend Gateway** | Node.js, Express, WebSocket (`ws`), CORS, Dotenv |
| **Storage / State** | In-Memory Data Store with JSON File Persistence / REST API Cache |
| **Edge Microcontroller**| ESP32-WROOM-32 (Xtensa Dual-Core 32-bit LX6 @ 240 MHz, FreeRTOS) |
| **Energy Meter Sensor** | PZEM-004T v3.0 (TTL Modbus-RTU, SD3004 ASIC, 100A CT Clamp, PC817 Isolation) |
| **Local Display** | 16x2 Character LCD via PCF8574 I2C Backpack |
| **Protocols** | HTTP REST, WebSockets, Modbus-RTU (UART), MQTT (optional) |

---

## 🚀 Exact Commands to Run the Project

### 1. Run the Backend API & WebSocket Server
```bash
# In first terminal:
cd smart-energy-monitor/backend
npm install
npm run dev
```
> Server will start at `http://localhost:5000` with WebSocket feed at `ws://localhost:5000/ws`.

### 2. Run the Frontend Dashboard
```bash
# In second terminal:
cd smart-energy-monitor
npm install
npm run dev
```
> Open your browser at **`http://localhost:3000`** (or the port displayed in terminal).

### 3. Flash the ESP32 Hardware (Optional / When Hardware Available)
```bash
# Using PlatformIO:
cd smart-energy-monitor/esp32
pio run --target upload
pio device monitor
```
*(Or open `firmware/esp32/energy_monitor.ino` in Arduino IDE and upload to ESP32).*

---

## 🔌 Hardware Status: Implemented vs Hardware Integration Ready

| Subsystem Component | Implementation Status | Description |
|---|---|---|
| **Frontend Dashboard** | ✅ **Implemented & Working** | Full 13-page React 19 dashboard with Recharts live glowing chart, alerts, appliances, tariffs, carbon calculator. |
| **Backend REST & WebSocket** | ✅ **Implemented & Working** | Express API & WebSocket streaming gateway with anomaly detection. |
| **India Billing Engine** | ✅ **Implemented & Working** | Complete multi-slab engine modeling BESCOM, TANGEDCO, MSEDCL, BSES, and UPPCL with fixed charges, FAC, PF surcharge, and GST. |
| **ESP32 Firmware** | ✅ **Implemented & Ready** | Complete C++ firmware with UART Modbus reading, Wi-Fi auto-reconnect, HTTP dispatch, and LCD cycling. |
| **PZEM-004T Driver** | ✅ **Implemented & Dual-Mode** | Direct Modbus RTU register reading for physical sensor + graceful benchtop simulation fallback when offline. |
| **Physical CT Clamp & Mains** | ⚡ **Hardware Integration Ready** | Firmware and pinouts pre-configured for instant plug-and-play wiring to live 230V AC mains. |

---

## 🎓 Viva Voce Defense Quick Reference

1. **Why PZEM-004T over ACS712?**
   PZEM-004T integrates a dedicated 24-bit energy metering ASIC with dual optical isolators for 3.75 kV safety isolation, directly outputting True RMS Voltage, RMS Current, Active Power, Energy, Frequency, and Power Factor over TTL UART.
2. **What is the CEA India Grid Emission Factor?**
   $0.82\text{ kg CO}_2/\text{kWh}$ according to the Central Electricity Authority of India.
3. **How does the Indian Multi-Slab Tariff Work?**
   Energy is charged progressively across slabs (e.g. 0-50 units @ ₹4.15, 51-100 units @ ₹5.60, etc.) with fixed demand charges, Fuel Surcharges (FAC), and statutory electricity duty.
