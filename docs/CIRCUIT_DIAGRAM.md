# Circuit Schematics & Wiring Diagram

This document contains the complete circuit wiring diagrams and pin connections for the **WattVision ESP32 + PZEM-004T + LCD** test bench.

---

## 📐 Circuit Schematic (ASCII Diagram)

```text
                  +-------------------------+
                  |  230V AC Single-Phase   |
                  |  Live (L)   Neutral (N) |
                  +----+-------------+------+
                       |             |
         +-------------+             |
         | (Phase Wire)              |
         |                           |
         |    [=== CT CLAMP ===]     |
         |           |   |           |
         |           |   | (CT Leads)|
         |           v   v           |
   +-----+-----------+---+-----------+-----+
   | L   N          CT1 CT2                |
   |                                       |
   |         PZEM-004T v3.0 AC SENSOR      |
   |                                       |
   | 5V(VCC)   RX      TX      GND         |
   +----+-------+-------+-------+----------+
        |       |       |       |
        |       |       |       |
        |  +----+-------+----+  |
        |  |    |       |    |  |
        |  |    |       |    |  |
   +----+--+----+-------+----+--+----------+
   |  5V  GND  GPIO17  GPIO16              |
   |           (TX2)   (RX2)               |
   |                                       |
   |          ESP32-WROOM-32 MCU           |
   |                                       |
   |  3.3V  GND  GPIO21  GPIO22            |
   +----+----+----+----+----+----+---------+
        |    |    |    |
        |    |    |    |
        |    |  (SDA) (SCL)
        |    |    |    |
   +----+----+----+----+-------------------+
   | VCC   GND   SDA  SCL                  |
   |                                       |
   |   16x2 Character LCD Display (I2C)    |
   |   (with PCF8574 I2C Backpack @ 0x27)  |
   +---------------------------------------+
```

---

## ⚡ Power Supply Rail Details

- **Hi-Link HLK-PM01 AC-DC Converter**:
  - Input: 100V – 240V AC 50/60Hz
  - Output: 5.0V DC regulated @ 600mA (3W)
  - Powers ESP32 `VIN`, PZEM `VCC`, and I2C LCD `VCC` simultaneously with shared common Ground (`GND`).
