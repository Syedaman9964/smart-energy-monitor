# 📟 WattVision - ESP32 Firmware Source & Hardware Integration

This directory contains the production-grade C++ firmware for the **ESP32-WROOM-32** microcontroller interfacing with the **PZEM-004T v3.0** electrical energy meter sensor and **16x2 I2C Character LCD**.

---

## ⚡ Hardware Pinout Connections

| Sensor / Module | ESP32 Pin | Function / Description |
|---|---|---|
| **PZEM-004T TX** | **GPIO 16 (RX2)** | Hardware UART 2 Receive (TTL 5V/3.3V) |
| **PZEM-004T RX** | **GPIO 17 (TX2)** | Hardware UART 2 Transmit (TTL 5V/3.3V) |
| **16x2 LCD SDA** | **GPIO 21** | I2C Data Line (PCF8574 Backpack) |
| **16x2 LCD SCL** | **GPIO 22** | I2C Clock Line (PCF8574 Backpack) |
| **VCC (5V)** | **5V / VIN** | Regulated 5V DC Supply Rail |
| **GND** | **GND** | Common Ground Plane |

---

## 🔌 Hardware Setup & Safety Instructions

> ⚠️ **HIGH VOLTAGE CAUTION**: The PZEM-004T high-voltage terminals connect directly to 230V AC Mains. Always utilize the split-core Current Transformer (CT clamp) around a **single** live phase conductor. Never loop both Live and Neutral through the CT clamp.

1. **CT Clamp Installation**: Pass only the **Live (Phase)** AC wire through the 100A Current Transformer clamp.
2. **AC Voltage Sampling**: Connect 230V AC Neutral to PZEM terminal $N$ and Live to terminal $L$.
3. **Optocoupler Isolation**: The low-voltage 5V TTL UART side is galvanically isolated from the 230V AC side via onboard PC817 optocouplers.

---

## 🧪 Simulation Fallback Mode

The firmware contains dual-mode logic:
- **REAL HARDWARE MODE**: When PZEM-004T is connected to AC mains, true RMS Modbus registers are sampled.
- **SIMULATED FALLBACK MODE**: If AC mains is unplugged or the PZEM is not detected, the firmware outputs realistic simulated telemetry tagged with `isSimulated: true` so the device can be demonstrated anywhere (e.g. college lab bench with USB power only).

---

## 🚀 Flashing & Compiling Instructions

### Method 1: Using PlatformIO (Recommended)
```bash
# 1. Open esp32/ folder in VS Code with PlatformIO extension
# 2. Build firmware
pio run

# 3. Upload to connected ESP32
pio run --target upload

# 4. Open Serial Monitor (115200 baud)
pio device monitor
```

### Method 2: Using Arduino IDE
1. Install **ESP32 Board Package** in Boards Manager (`esp32 by Espressif Systems`).
2. Install Required Libraries via Library Manager:
   - `PZEM-004T-v30` by Mandar
   - `ArduinoJson` (v6.x) by Benoit Blanchon
   - `LiquidCrystal_I2C` by Frank de Brabander
   - `PubSubClient` by Nick O'Leary
3. Open `firmware/esp32/energy_monitor.ino`.
4. Select Board: **ESP32 Dev Module**, Port: **COMx**.
5. Click **Upload**.
