# WattVision ESP32 Firmware Guide

This directory contains the production-ready C++ / Arduino firmware for the **ESP32-WROOM-32** microcontroller interfacing with the **PZEM-004T v3.0** AC Energy Meter and **16x2 I2C LCD Display**.

---

## 🛠️ Required Hardware Components

| Component | Quantity | Purpose |
|---|---|---|
| **ESP32 DevKit v1 / NodeMCU-32S** | 1 | Main dual-core microcontroller with 2.4 GHz Wi-Fi |
| **PZEM-004T v3.0 AC Energy Meter** | 1 | High-precision AC metering module (80-260V AC, 0-100A) |
| **Split-Core 100A Current Transformer (CT)** | 1 | Non-invasive current sensing clamped over AC Live phase wire |
| **16x2 Character LCD + PCF8574 I2C Backpack** | 1 | Local display for live readings and IP address |
| **Hi-Link HLK-PM01 (5V 3W Step-down)** | 1 | Internal power module stepping down 230V AC to 5V DC |
| **Jumper Wires & Enclosure Box** | - | Safe housing with fuse protection |

---

## 🔌 Hardware Circuit Pinout

```text
ESP32 Pin               Connected Module Pin
--------------------------------------------------
GPIO 16 (RX2) --------> PZEM-004T TX (TTL)
GPIO 17 (TX2) --------> PZEM-004T RX (TTL)
GPIO 21 (SDA) --------> 16x2 LCD SDA (I2C)
GPIO 22 (SCL) --------> 16x2 LCD SCL (I2C)
5V (VIN)      --------> PZEM VCC (5V) & LCD VCC (5V)
GND           --------> PZEM GND & LCD GND (Common)

PZEM High-Voltage Side:
AC L & N In   --------> 230V AC Mains Phase & Neutral
CT Port (x2)  --------> 100A Split-Core CT Clamp Wire Leads
```

---

## 📦 Required Arduino Libraries

Install these via the **Arduino IDE Library Manager** or `platformio.ini`:
1. `PZEM004Tv30` by *Jakub Mandula*
2. `LiquidCrystal_I2C` by *Frank de Brabander*
3. `ArduinoJson` by *Benoît Blanchon* (v6 or v7)
4. `WiFi` & `HTTPClient` (built-in with ESP32 Arduino Core)

---

## 🚀 How to Flash & Deploy

1. Open `energy_monitor.ino` in Arduino IDE.
2. Open `config.h` and configure:
   ```c
   #define WIFI_SSID     "Your_WiFi_Name"
   #define WIFI_PASSWORD "Your_WiFi_Password"
   #define API_HOST      "http://<your-backend-ip>:5000"
   ```
3. Select Board: **ESP32 Dev Module**.
4. Set Flash Frequency: **80MHz**, Upload Speed: **921600**.
5. Hold the `BOOT` button on ESP32 while uploading.
6. Open Serial Monitor at **115200 baud** to view real-time telemetry logs.
