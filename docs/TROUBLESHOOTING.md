# Troubleshooting & Common Issues Guide

Solutions to common hardware, firmware, network, and frontend problems encountered during development and testing.

---

## 🔌 1. Hardware & Serial Diagnostics

| Symptom | Probable Cause | Corrective Action |
|---|---|---|
| **PZEM returns `NaN` for all parameters** | AC mains high-voltage line not powered | Ensure 230V AC mains is connected to PZEM L and N screw terminals. The metering IC is powered from the AC line. |
| **Current reads `0.00 A` despite active load** | Both Live & Neutral clamped together in CT | Separate wires. Clamp **ONLY the single Live (Phase)** conductor inside the CT clamp. |
| **I2C LCD shows dark rectangular blocks** | Contrast potentiometer out of calibration | Turn the blue potentiometer on the back of the PCF8574 I2C adapter with a screwdriver until text appears sharp. |
| **ESP32 loops in boot crash / brownout** | Insufficient 5V USB current delivery | Use a dedicated 5V 2A external DC power adapter or powered USB hub. |

---

## 🌐 2. Network & Wi-Fi Diagnostics

| Symptom | Probable Cause | Corrective Action |
|---|---|---|
| **ESP32 fails to connect to Wi-Fi** | Trying to connect to 5GHz Wi-Fi band | ESP32-WROOM only supports **2.4 GHz** Wi-Fi networks. Ensure 2.4 GHz is enabled on your router. |
| **Dashboard does not receive live stream** | Local firewall blocking HTTP/WS port | Verify that your backend port (e.g. 5000 or 81) is allowed in Windows/Linux Firewall. |

---

## 💻 3. Frontend & Build Diagnostics

| Symptom | Probable Cause | Corrective Action |
|---|---|---|
| **`npm run dev` port 3000 in use** | Another dev server instance is active | Vite will automatically increment and bind to port `3001` or `3002`. |
| **Recharts warning in browser console** | Container width not yet calculated | ResponsiveContainer handles layout automatically; harmless during initial mount. |
