# Comprehensive Viva Voce Examination Guide (40+ Q&A)

This document contains 40+ structured Viva Voce examination questions and answers designed for engineering college project evaluations and faculty reviews.

---

### Section 1: Embedded Hardware & Microcontrollers (ESP32)

#### Q1. Why did you choose the ESP32 microcontroller over Arduino Uno or NodeMCU ESP8266?
**Answer:** The ESP32 provides significant hardware advantages:
1. **Dual-Core Processor (Xtensa LX6 @ 240MHz)** allowing sensor acquisition on Core 0 and Wi-Fi/HTTP stack management on Core 1 without timing jitter.
2. **Three Hardware UART Ports (Serial0, Serial1, Serial2)** — allows clean hardware UART communication with the PZEM-004T on Serial2 without blocking the USB debug serial.
3. Built-in 2.4 GHz Wi-Fi (802.11 b/g/n) and Bluetooth with 520 KB SRAM.

#### Q2. What is the role of the PZEM-004T v3.0 module?
**Answer:** The PZEM-004T v3.0 is a dedicated AC electrical parameters multi-function sensor module. It directly measures:
- AC Voltage (80–260V)
- AC Current (0–100A via split-core CT)
- Active Real Power (0–23kW)
- Energy (0–9999.99 kWh)
- Grid Frequency (45–65Hz)
- Power Factor (0.00–1.00)

#### Q3. Why not use an ACS712 current sensor and a simple voltage divider?
**Answer:** ACS712 only measures instantaneous current via Hall effect. Calculating true real power with an ACS712 requires sampling voltage and current waveforms simultaneously at high ADC frequencies (at least 2–5 kHz) and performing discrete RMS and phase calculations in software. This consumes excessive CPU cycles and suffers from ADC non-linearity on the ESP32. The PZEM-004T offloads all calculations to a dedicated high-precision energy metering ASIC with built-in optical isolation.

#### Q4. What is the purpose of the PC817 optocouplers on the PZEM-004T board?
**Answer:** They provide **galvanic isolation** (up to 3.75 kV) between the high-voltage 230V AC mains side and the low-voltage 5V/3.3V TTL UART logic side, preventing catastrophic damage to the microcontroller and safeguarding human operators from electric shocks.

#### Q5. What is a Split-Core Current Transformer (CT)?
**Answer:** A split-core CT is a non-invasive current sensor that clamps around a single AC conductor. It operates on the principle of electromagnetic induction (Ampere's and Faraday's laws), inducing a proportional low-level secondary AC current in its internal coils without requiring the high-voltage live wire to be stripped or cut.

---

### Section 2: Communication Protocols & IoT

#### Q6. What communication protocol is used between ESP32 and PZEM-004T?
**Answer:** **Modbus-RTU** over asynchronous TTL serial UART at 9600 baud rate (8 data bits, no parity, 1 stop bit: 8N1).

#### Q7. What is Cyclic Redundancy Check (CRC16) and why is it essential here?
**Answer:** CRC16 is an error-detecting checksum polynomial appended to the end of every Modbus transmission frame. In electrical metering environments, heavy inductive loads (such as motors or air compressors) generate substantial electromagnetic interference (EMI) that can corrupt serial data bits. Verifying the 16-bit CRC ensures erroneous electrical values are discarded before being stored or displayed.

#### Q8. Explain the difference between REST API, WebSockets, and MQTT in this architecture.
**Answer:**
- **REST API (HTTP/HTTPS)**: Request-response stateless protocol ideal for configuration updates (e.g. updating tariff slabs) and initial dashboard state fetching.
- **WebSockets**: Persistent, full-duplex TCP connection providing sub-second low-latency streaming of live voltage and power fluctuations without HTTP header overhead.
- **MQTT**: Lightweight publish-subscribe protocol ideal for bandwidth-constrained IoT networks with broker-based message queuing.

#### Q9. How does the system handle temporary Wi-Fi disconnects?
**Answer:** The ESP32 firmware incorporates a non-blocking reconnection state machine (`wifi_manager.h`). The local 16x2 LCD display continues to refresh live metrics independently, and readings can be buffered in ESP32 non-volatile Flash (NVS) memory until connectivity is restored.

---

### Section 3: Electrical Engineering & Energy Math

#### Q10. What is Active Power (Real Power)?
**Answer:** Active Power ($P$, measured in Watts or kW) is the true power converted into useful physical work (heat, light, mechanical motion). Equation: $P = V_{RMS} \cdot I_{RMS} \cdot \cos\varphi$.

#### Q11. What is Apparent Power and Reactive Power?
**Answer:**
- **Apparent Power ($S$, in VA)**: The total vector power supplied by the grid: $S = V_{RMS} \cdot I_{RMS}$.
- **Reactive Power ($Q$, in VAR)**: Power oscillating back and forth between the source and reactive inductive/capacitive magnetic fields without doing useful work: $Q = \sqrt{S^2 - P^2}$.

#### Q12. What is Power Factor ($\cos\varphi$) and why is unity power factor desirable?
**Answer:** Power Factor is the ratio of Real Power to Apparent Power ($\text{PF} = P / S$). A low power factor (e.g., 0.70 lag) means appliances draw significantly more current from the grid to do the same amount of work, causing higher transmission line losses ($I^2 R$) and utility penalty surcharges. Unity power factor ($\text{PF} = 1.00$) indicates 100% efficient utilization.

#### Q13. How is electrical energy (kWh) calculated from power?
**Answer:** Energy ($E$, in kWh) is the mathematical time integral of Active Power ($P$ in kW) over time ($t$ in hours): $E = \int P(t) \, dt$. One unit of electricity equals 1 Kilowatt-hour ($1\text{ kWh} = 1000\text{ Watts} \times 1\text{ hour} = 3.6\text{ Megajoules}$).

#### Q14. What is the India Grid Baseline Carbon Emission Factor?
**Answer:** According to the Central Electricity Authority (CEA) of India CO2 Baseline Database (Version 19/20), the Indian national grid emission factor is approximately **0.82 kg CO₂ per kWh** due to the high proportion of coal-fired thermal generation in the national energy mix.

---

### Section 4: Frontend Web Architecture (React & Vite)

#### Q15. Why use React 19 + Vite instead of plain HTML/CSS or Create React App?
**Answer:**
1. **Vite**: Provides lightning-fast Hot Module Replacement (HMR) using native ES modules and Rollup for optimal production bundling.
2. **React 19**: Provides declarative component-based UI, efficient Virtual DOM reconciliation, and modern hooks (`useMemo`, `useCallback`, `useContext`) for high-frequency chart rendering without browser lag.

#### Q16. How is state managed across the 13 dashboard pages?
**Answer:** Via the **React Context API** (`EnergyContext.jsx` and `ToastContext.jsx`). This centralizes live telemetry data, user preferences, hardware diagnostic status, and toast notifications into a single global state provider without prop-drilling.

#### Q17. Why is CSS Glassmorphism and CSS Custom Properties (Variables) used?
**Answer:** CSS Variables (`variables.css`) enable a maintainable design system with centralized color tokens for metrics (Sky Blue for Voltage, Purple for Current, Amber for Power, Emerald for Energy). Glassmorphism (`backdrop-filter: blur()`) gives a modern dark-mode control room aesthetic.

#### Q18. How does the live power chart achieve smooth streaming animation?
**Answer:** It uses **Recharts** AreaChart with an SVG `<defs>` linearGradient. Data points are managed in a fixed-length FIFO circular array (maintaining the latest 30-60 points) so memory consumption remains strictly constant over indefinitely long sessions.

---

### Section 5: Security, Database & Future Scope

#### Q19. How do you protect IoT devices against unauthorized network access?
**Answer:**
1. Secure Wi-Fi with WPA2/WPA3 Enterprise authentication.
2. TLS/HTTPS encrypted transport for all REST/WebSocket endpoints.
3. API Token or JWT header validation on telemetry ingestion endpoints.
4. Firmware Over-the-Air (OTA) updates signed with cryptographic keys.

#### Q20. What database is recommended for long-term electrical data logging?
**Answer:** A time-series database such as **TimescaleDB** (PostgreSQL extension) or **InfluxDB**, because they provide automatic time-based partitioning, high-speed write throughput for sensor streams, and continuous aggregate queries (e.g. calculating hourly/daily averages).

#### Q21–Q40. Quick-Fire Core Concepts:
- **Q21: What is Modbus Function Code 0x04?** Read Input Registers (used to read live measurement data from PZEM-004T).
- **Q22: What is the normal AC grid frequency in India?** 50.0 Hz $\pm 0.5\text{ Hz}$ (49.50 Hz to 50.50 Hz).
- **Q23: What is Voltage Sag and Surge?** A voltage sag is a momentary drop in voltage below 215V; a surge is an overvoltage rise above 245V.
- **Q24: What is Non-Intrusive Load Monitoring (NILM)?** Analyzing aggregate power signatures to identify which specific appliances are operating without placing a meter on every individual plug.
- **Q25: What is Time-of-Day (ToD) tariff?** Charging higher rates per unit during peak hours (6 PM–10 PM) and discounted rates during off-peak hours (11 PM–6 AM).
- **Q26: What is the default I2C clock speed on ESP32?** 100 kHz (Standard Mode) or 400 kHz (Fast Mode).
- **Q27: Can ESP32 operate on 5V logic?** No, ESP32 GPIOs are 3.3V logic level. Connecting 5V directly to input GPIOs without level shifting or optocouplers can damage the chip.
- **Q28: Why does the PZEM-004T TTL side work with 3.3V ESP32 GPIO?** The PZEM-004T v3.0 TTL optocoupler pins can be driven safely at 3.3V or 5V VCC with proper pull-up levels.
- **Q29: How does the system calculate today's estimated electricity cost?** By multiplying cumulative daily units (kWh) by the base slab rate plus statutory 18% electricity duty and apportioned fixed monthly demand charges.
- **Q30: What is FreeRTOS `yield()` in Arduino loop?** Relinquishes CPU time to the underlying FreeRTOS kernel so background tasks (TCP/IP stack, Wi-Fi drivers) can execute without triggering the watchdog timer.
- **Q31: What is the purpose of the `exportService.js` file?** Enables one-click client-side export of historical telemetry logs and reports to CSV and JSON formats.
- **Q32: What is the difference between active energy (kWh) and reactive energy (kVARh)?** Active energy is billed by utility companies for useful work; reactive energy represents circulating inductive/capacitive magnetic energy.
- **Q33: How does the system handle high-frequency sensor noise?** By applying exponential moving average (EMA) smoothing filters in software before chart rendering.
- **Q34: What is the role of `ToastContext.jsx`?** Provides transient non-intrusive alert popups for events like tariff updates, connection status changes, and report downloads.
- **Q35: What is the role of `AnimatedNumber.jsx`?** Animates smooth numeric transitions using `requestAnimationFrame` when live electrical values update.
- **Q36: What is the memory footprint of the React production bundle?** ~180 KB compressed with Gzip, ensuring instant load times even on low-speed mobile connections.
- **Q37: Can this setup be used with three-phase 415V AC systems?** Yes, by deploying three PZEM-004T modules (one per phase: R, Y, B) connected to separate UART ports or configured on distinct Modbus slave IDs (1, 2, 3) over a shared RS-485 bus.
- **Q38: What is an Inline Fast-Blow Fuse?** A safety component that melts instantaneously during a short-circuit fault to isolate the equipment from the electrical grid.
- **Q39: What are the main future improvements for this project?**
  1. Edge AI / Machine Learning for automatic Appliance Fingerprinting (NILM).
  2. Integration with solar inverter net-metering (bi-directional power flow).
  3. Mobile push notifications via Firebase Cloud Messaging (FCM).
  4. Automated demand response with smart relay cutoffs during peak tariff hours.
- **Q40: How does this project contribute to sustainability?** By providing actionable, real-time energy visibility and carbon emission metrics, encouraging consumers to reduce wasteful phantom loads and optimize peak-hour consumption.
