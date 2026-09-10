# 📟 WattVision - ESP32 Firmware Engineering Specification

## 1. Microcontroller Architecture
- **MCU**: Espressif ESP32-WROOM-32 (Xtensa Dual-Core 32-bit LX6 @ 240 MHz).
- **Core 0 Allocation**: Modbus-RTU UART querying, CRC16 calculation, sensor watchdog timer.
- **Core 1 Allocation**: FreeRTOS main task, 16x2 LCD refresh (1s), Wi-Fi stack & HTTP/MQTT transmission.
- **RAM / Heap**: 520 KB SRAM (typically >190 KB free heap during operation).
- **Non-blocking Timers**: Utilizes `millis()` delta scheduling instead of blocking `delay()`.

---

## 2. Hardware UART Interfacing
ESP32 features 3 hardware UART controllers:
- `UART0` (GPIO 1 TX / GPIO 3 RX): Reserved for USB debugging & flashing.
- `UART1` (GPIO 9 / 10): Connected to integrated flash memory.
- `UART2` (GPIO 16 RX / GPIO 17 TX): Dedicated to PZEM-004T v3.0 @ 9600 baud, 8 data bits, 1 stop bit, no parity (8N1).

---

## 3. Communication State Machine

```text
[ Boot Initialization ]
        │
        ▼
[ Init Serial2 & I2C LCD ]
        │
        ▼
[ Connect Wi-Fi Station Mode ] ── (Timeout > 20s) ──> [ Standalone Mode ]
        │                                                     │
        ▼                                                     ▼
[ Main Loop Non-Blocking ] <──────────────────────────────────┘
        │
        ├── (Every 2s)  ──> [ Query PZEM Modbus Regs ]
        │                          │
        │                          ├── Valid Checksum ──> [ HTTP POST /api/telemetry/live ]
        │                          └── CRC Error/NaN   ──> [ Activate Benchtop Fallback ]
        │
        ├── (Every 1s)  ──> [ Refresh 16x2 LCD Display (Page Cycle) ]
        │
        └── (Every 10s) ──> [ Wi-Fi Auto-Reconnection Maintenance ]
```
