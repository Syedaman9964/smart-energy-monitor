# WattVision - Complete Project Documentation & Report

**Project Title**: IoT-Based Real-Time Smart Energy Monitoring & Analytics Platform  
**Target Domain**: Internet of Things (IoT), Embedded Systems, Smart Grid, Energy Analytics  
**Academic Level**: Engineering Final Year / Portfolio Project  

---

## 🎯 Executive Summary
Electrical power is the backbone of modern residential and industrial infrastructure. However, conventional billing meters only provide static cumulative consumption at the end of monthly billing cycles. Consumers lack real-time visibility into instantaneous wattage, power factor penalties, voltage sags/surges, or appliance-level power hogs.

**WattVision** is an end-to-end IoT platform featuring an **ESP32 microcontroller** paired with an optically-isolated **PZEM-004T AC sensor module**. It continuously captures 6 key electrical parameters (Voltage, Current, Power, Cumulative kWh, Frequency, Power Factor) and broadcasts this telemetry over Wi-Fi to a real-time responsive React web dashboard.

---

## ⚙️ Key Technical Features

1. **Precision AC Metering**: Measures 80–260V AC, 0–100A with 0.5% accuracy class.
2. **True Galvanic Safety Isolation**: High-voltage mains is isolated from the ESP32 logic with optocouplers.
3. **Local & Cloud Redundancy**: Features a local 16x2 I2C LCD character display that operates even if internet connectivity drops.
4. **Interactive Glowing SVG Dashboard**: Real-time 1-second interval live power area charts with time range switches (Live, 1h, 24h, 7d).
5. **Indian DISCOM Multi-Slab Tariff Calculator**: Built-in support for tiered slab billing, peak-hour time-of-day pricing, fixed demand charges, and 18% GST calculation in Indian Rupees (₹).
6. **Carbon Emission Tracking**: Implements the Central Electricity Authority (CEA) India baseline grid emission equation ($0.82\text{ kg CO}_2/\text{kWh}$).
7. **Appliance Disaggregation**: Analyzes signature power consumption patterns for domestic loads (Inverter AC, Geyser, Refrigerator, Induction, Fans).

---

## 📐 Mathematical Equations Used in System

| Electrical Parameter | Equation / Formula | Engineering Units |
|---|---|---|
| **Active / Real Power (P)** | $P = V_{RMS} \cdot I_{RMS} \cdot \cos\varphi$ | Watts (W) |
| **Apparent Power (S)** | $S = V_{RMS} \cdot I_{RMS}$ | Volt-Amperes (VA) |
| **Reactive Power (Q)** | $Q = \sqrt{S^2 - P^2} = V_{RMS} \cdot I_{RMS} \cdot \sin\varphi$ | Volt-Amperes Reactive (VAR) |
| **Power Factor (PF)** | $\text{PF} = \cos\varphi = \frac{P}{S}$ | Dimensionless (0.00 to 1.00) |
| **Cumulative Energy (E)** | $E = \int_{0}^{t} P(t) \, dt$ | Kilowatt-hours (kWh / Units) |
| **Carbon Footprint** | $\text{CO}_2 (\text{kg}) = \text{Energy (kWh)} \times 0.82$ | $\text{kg CO}_2$ |

---

## 💻 Tech Stack Summary

- **Embedded Firmware**: C++ (Arduino Core for ESP32), FreeRTOS dual-core multitasking, Modbus-RTU UART driver.
- **Frontend Architecture**: React 19, Vite 6, Recharts (Area/Bar/Line/Pie SVG components), Lucide React vector icons.
- **Styling Architecture**: Pure CSS custom properties (variables), Glassmorphism backdrop-blur, Dark Theme design tokens.
- **Communication Protocol**: TTL Serial UART (9600 baud), HTTP REST API, WebSockets (802.11 b/g/n Wi-Fi).
