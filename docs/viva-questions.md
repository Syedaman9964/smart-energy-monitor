# 🎓 College Viva Voce Defense Guide & Engineering Q&A

## Top 20 Most Frequent External Examiner Questions

### 1. What is the difference between Active Power ($P$), Reactive Power ($Q$), and Apparent Power ($S$)?
- **Active Power ($P$ in Watts)**: Real electrical power converted into useful work (heat, light, mechanical motion). $P = V_{\text{RMS}} \times I_{\text{RMS}} \times \cos\varphi$.
- **Reactive Power ($Q$ in VAR)**: Power oscillating between source and reactive magnetic/electric fields (motor inductors, chokes). $Q = V_{\text{RMS}} \times I_{\text{RMS}} \times \sin\varphi$.
- **Apparent Power ($S$ in VA)**: Total vector sum of active and reactive power supplied by grid. $S = V_{\text{RMS}} \times I_{\text{RMS}} = \sqrt{P^2 + Q^2}$.

### 2. Why did you choose PZEM-004T instead of ACS712 current sensor?
- **ACS712**: An analog Hall-effect current sensor only. To compute real AC power, the microcontroller must continuously sample both voltage and current at high sampling rates (e.g. 5 kHz) and integrate $v(t) \times i(t)$ in software, causing heavy CPU overhead and zero optical safety isolation.
- **PZEM-004T**: Integrates a dedicated 24-bit metering ASIC (SD3004) that directly computes RMS Voltage, RMS Current, Active Power, Cumulative Energy, Line Frequency, and Power Factor with dual optical isolators (PC817) for 3.75 kV galvanic isolation.

### 3. How does the Non-Invasive CT Clamp work?
The 100A split-core Current Transformer operates on Faraday's Law of Electromagnetic Induction. The alternating AC current flowing through the single live conductor induces an alternating magnetic flux in the ferrite core, generating a proportional secondary current through a precision internal burden resistor.

### 4. What is the Indian Grid Baseline Carbon Emission Factor?
Approximately **$0.82\text{ kg CO}_2/\text{kWh}$**, as published by the Central Electricity Authority (CEA), Ministry of Power, Government of India.

### 5. Why is Power Factor ($\cos\varphi$) penalization applied by Indian DISCOMs?
When $\cos\varphi < 0.85$, inductive loads draw excess reactive current for the same useful active power. This extra current increases line losses ($I^2 R$) in utility transformers and distribution feeders without performing billable work. DISCOMs therefore impose low power factor surcharges.

### 6. How does the Indian Multi-Slab Tariff System work?
Consumption is divided into progressive tiers (e.g. 0-50, 51-100, 101-200, >200 units). As consumption enters higher slabs, the incremental unit rate increases. The final bill is:
$$\text{Total Bill} = (\text{Energy Charges} + \text{Fixed Demand Charges} + \text{FAC}) \times (1 + \text{Electricity Duty})$$

### 7. How does the system handle Wi-Fi disconnection?
The firmware features non-blocking auto-reconnection using `millis()` state machine. During Wi-Fi outage, the ESP32 continues reading PZEM sensor registers and updates the local 16x2 I2C LCD without freezing the MCU. When connection restores, it seamlessly resumes cloud batch dispatching.
