# 🔌 PZEM-004T v3.0 Sensor Integration & Modbus Specification

## 1. Technical Specifications

| Parameter | Operational Range | Resolution | Measurement Accuracy |
|---|---|---|---|
| **AC RMS Voltage** | 80V – 260V AC | 0.1V | Class 0.5 (±0.5%) |
| **AC RMS Current** | 0.00A – 100.00A | 0.001A / 0.01A | Class 0.5 (±0.5%) |
| **Active Power** | 0.0W – 23,000W | 0.1W | Class 0.5 (±0.5%) |
| **Energy Accumulation**| 0.00 – 9999.99 kWh | 1 Wh / 0.01 kWh| Class 0.5 (±0.5%) |
| **Grid Frequency** | 45.0 Hz – 65.0 Hz | 0.1 Hz | ±0.5% |
| **Power Factor** | 0.00 – 1.00 $\cos\varphi$| 0.01 | ±1.0% |

---

## 2. Modbus-RTU Register Map

| Register Address | Function | Units | Data Format |
|---|---|---|---|
| `0x0000` | Voltage | 0.1 V | 16-bit Integer |
| `0x0001` - `0x0002` | Current | 0.001 A | 32-bit Integer (Low + High) |
| `0x0003` - `0x0004` | Active Power | 0.1 W | 32-bit Integer (Low + High) |
| `0x0005` - `0x0006` | Cumulative Energy | 1 Wh | 32-bit Integer (Low + High) |
| `0x0007` | Grid Frequency | 0.1 Hz | 16-bit Integer |
| `0x0008` | Power Factor | 0.01 | 16-bit Integer |
| `0x0009` | Alarm Status | 0xFFFF | 16-bit Bitmap |

---

## 3. High-Voltage Safety & Galvanic Isolation
- **Galvanic Isolation**: Two onboard **PC817 Optocouplers** provide **3.75 kV RMS** electrical isolation between the high-voltage mains AC side and the low-voltage 5V TTL UART interface.
- **Split-Core CT Clamp**: Eliminates the need to cut the live mains wire. The non-invasive ferromagnetic core senses the alternating electromagnetic field induced by the phase current.
