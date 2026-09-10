# Data Flow Specification: From Sensor to Screen

This document details the exact stage-by-stage journey of all 6 electrical parameters (**Voltage, Current, Power, Energy, Frequency, Power Factor**) from the physical AC wire to the React dashboard display.

---

## 🌊 Complete Data Pipeline Overview

```text
[ AC Current & Voltage ]
         │
         ▼  (Analog Waveform Sampling)
[ PZEM-004T Metering IC ]
         │
         ▼  (Calculates RMS V, I, P, E, F, PF + CRC16 Frame)
[ TTL UART Serial @ 9600 Baud ]
         │
         ▼  (Modbus-RTU Bytes Received via Serial2)
[ ESP32 Firmware Parser ]
         │
         ▼  (JSON Serialization: { voltage, current, power... })
[ Wi-Fi TCP/IP Network Transport ]
         │
         ▼  (HTTP POST / WebSocket Stream)
[ Backend Gateway / REST API ]
         │
         ▼  (Broadcast via WebSocket / REST Response)
[ React EnergyService & Context API ]
         │
         ▼  (Formatting, Tiered Tariff Math, Carbon Offsets)
[ User Interface & Live SVG Glow Charts ]
```

---

## 🔍 Detailed Parameter Lifecycle

### 1. Voltage (V)
1. **Acquisition**: Measured across the Live (L) and Neutral (N) AC screw terminals through high-impedance voltage divider networks into the metering IC.
2. **Resolution**: 0.1 V (Operating range: 80.0 V - 260.0 V AC).
3. **PZEM Frame**: 2 bytes holding unsigned integer (value × 10). Example: `0x08FC` = 2300 = `230.0 V`.
4. **Dashboard Use**: Displayed in Voltage Metric Card, grid sag/surge alert monitors, and grid stability area charts.

### 2. Current (A)
1. **Acquisition**: Sensed via the 100A split-core CT clamp via mutual magnetic induction around the Phase/Live wire.
2. **Resolution**: 0.001 A (1 mA resolution, range 0.000 A - 100.000 A).
3. **PZEM Frame**: 4 bytes holding unsigned 32-bit integer (value × 1000).
4. **Dashboard Use**: Displayed in Current Metric Card and appliance disaggregation breakdown.

### 3. Active Real Power (W)
1. **Acquisition**: Computed by instantaneous time-multiplication of voltage and current waveforms:
   $$\ P(t) = \frac{1}{T} \int_{0}^{T} v(t) \cdot i(t) \, dt = V_{RMS} \cdot I_{RMS} \cdot \cos\varphi \$$
2. **Resolution**: 0.1 W (Range: 0.0 W - 23,000.0 W).
3. **Dashboard Use**: Powers the real-time glowing area chart, instantaneous load gauge, and peak demand limiter.

### 4. Cumulative Energy (kWh)
1. **Acquisition**: Time integration of active power accumulated in PZEM non-volatile EEPROM registers:
   $$\ E = \int P \, dt \$$
2. **Resolution**: 1 Wh (0.001 kWh), capacity up to 9999.99 kWh before rollover.
3. **Dashboard Use**: Feeds the Indian DISCOM multi-slab tariff calculator, weekly energy logs, and carbon offset equations.

### 5. Grid Frequency (Hz)
1. **Acquisition**: Measured by internal zero-crossing comparator timing circuit of the AC voltage wave.
2. **Resolution**: 0.1 Hz (Range: 45.0 Hz - 65.0 Hz). Indian Grid nominal standard: 50.0 Hz.
3. **Dashboard Use**: Displayed in Frequency Card and grid health diagnostic tiles.

### 6. Power Factor (cos φ)
1. **Acquisition**: Ratio of Real Power (W) to Apparent Power (VA):
   $$\ PF = \frac{P}{V_{RMS} \cdot I_{RMS}} \$$
2. **Resolution**: 0.01 (Range: 0.00 to 1.00).
3. **Dashboard Use**: Efficiency grading widget ($A^+$ to $C$), reactive power penalty estimation, and capacitor health indicator.
