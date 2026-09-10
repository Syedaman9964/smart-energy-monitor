# 🚀 WattVision End-to-End Installation & Deployment Guide

## 1. Quick Start Guide

### Step 1: Clone or Navigate to Project Folder
```bash
cd smart-energy-monitor
```

### Step 2: Install Dependencies
```bash
# Install frontend packages
npm install

# Install backend packages
cd backend
npm install
cd ..
```

### Step 3: Start Backend API & WebSocket Server
```bash
cd backend
npm run dev
```
Backend will be live at:
- REST API: `http://localhost:5000/api/health`
- WebSocket Feed: `ws://localhost:5000/ws`

### Step 4: Start Frontend Web Dashboard (In a separate terminal)
```bash
npm run dev
```
Open browser at `http://localhost:3000` (or the port shown by Vite).

---

## 2. Flashing the ESP32 Microcontroller

### Using PlatformIO (VS Code)
1. Open the `esp32/` folder in VS Code with PlatformIO extension installed.
2. In `include/config.h`, set your local Wi-Fi SSID, Password, and your computer's LAN IP address for `API_HOST`.
3. Connect your ESP32 via USB.
4. Click **PlatformIO: Upload** and open **Serial Monitor** at **115200 baud**.

### Using Arduino IDE
1. Open `firmware/esp32/energy_monitor.ino` in Arduino IDE.
2. Select Board: **ESP32 Dev Module**.
3. Select Port: `COMx` (Windows) or `/dev/ttyUSB0` (Linux/Mac).
4. Click **Upload**.
