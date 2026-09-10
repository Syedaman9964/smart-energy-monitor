# Hardware Setup & Wiring Guide

This guide describes how to safely wire and assemble the physical **ESP32 + PZEM-004T + LCD** energy monitoring hardware test bench.

---

## ⚠️ High Voltage Safety Warning

> [!CAUTION]
> This project interfaces with **230V AC Mains electricity**, which is potentially lethal.
> Always ensure the AC mains breaker/switch is **OFF** and isolated before touching terminal blocks or stripping wires.
> Use an insulated plastic project enclosure box and incorporate a 1A to 2A fast-blow inline fuse on the voltage measurement lines.

---

## 🧰 Component Pinout & Interconnection Table

| Component | Pin | Connects To | Wire Color (Standard) |
|---|---|---|---|
| **PZEM-004T (TTL)** | VCC (5V) | ESP32 `VIN` (5V Rail) | Red |
| **PZEM-004T (TTL)** | GND | ESP32 `GND` | Black |
| **PZEM-004T (TTL)** | TX | ESP32 `GPIO 16` (RX2) | Yellow / Blue |
| **PZEM-004T (TTL)** | RX | ESP32 `GPIO 17` (TX2) | Green / White |
| **16x2 LCD (I2C)** | VCC | ESP32 `VIN` (5V Rail) | Red |
| **16x2 LCD (I2C)** | GND | ESP32 `GND` | Black |
| **16x2 LCD (I2C)** | SDA | ESP32 `GPIO 21` | Blue |
| **16x2 LCD (I2C)** | SCL | ESP32 `GPIO 22` | Yellow |
| **PZEM AC Input** | L (Line) | AC Mains 230V Phase (Live) | Red / Brown |
| **PZEM AC Input** | N (Neutral) | AC Mains Neutral | Black / Blue |
| **PZEM CT Port** | CT1 / CT2 | 100A Split-Core CT Clamp | Black Leads |

---

## 🔌 Correct CT Clamp Placement

1. **Clamp ONLY ONE Conductor**: The current transformer clamp must be clamped around the **Phase/Live wire ONLY**.
2. **Do NOT clamp both Live and Neutral together**: Clamping both wires cancels out opposing magnetic fields resulting in a reading of **0.00 A**.
3. **Current Direction**: Ensure the arrow marked on the CT clamp points towards the load appliance.

---

## 💡 Troubleshooting Hardware Bring-up

- **PZEM Red Power LED ON, but ESP32 reads NaN**: Check that the high-voltage AC terminals are connected to 230V. The PZEM measurement ASIC and optocouplers on the primary side are powered directly from the AC voltage terminals.
- **I2C LCD shows solid blocks**: Adjust the blue contrast potentiometer on the back of the PCF8574 I2C backpack with a small screwdriver until characters are crisp and legible.
- **Inverted Serial Pins**: If readings fail, swap GPIO 16 and 17 (PZEM TX goes to ESP32 RX; PZEM RX goes to ESP32 TX).
