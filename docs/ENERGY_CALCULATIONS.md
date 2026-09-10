# Electrical Equations & Energy Math

This reference document outlines all mathematical calculations implemented in `src/utils/calculations.js` and the backend analytics layer.

---

## 1. Power Triangle Calculations

### A. Apparent Power ($S$)
Apparent power represents total vector power supplied by the grid:
$$S = V_{\text{RMS}} \times I_{\text{RMS}} \quad [\text{Unit: Volt-Amperes (VA)}]$$

### B. Active / Real Power ($P$)
Active power is the usable power converted into physical work:
$$P = V_{\text{RMS}} \times I_{\text{RMS}} \times \cos\varphi \quad [\text{Unit: Watts (W)}]$$

### C. Reactive Power ($Q$)
Reactive power oscillates between magnetic fields in inductive loads (motors, chokes):
$$Q = \sqrt{S^2 - P^2} = V_{\text{RMS}} \times I_{\text{RMS}} \times \sin\varphi \quad [\text{Unit: VAR}]$$

### D. Power Factor ($\text{PF} = \cos\varphi$)
$$\text{PF} = \frac{P}{S} = \frac{\text{Active Power (W)}}{\text{Apparent Power (VA)}}$$

---

## 2. Tiered DISCOM Billing Formula

$$\text{Total Bill} = (\text{Energy Charges} + \text{Fixed Demand Rent}) \times \left(1 + \frac{\text{GST \%}}{100}\right)$$

Where Energy Charges are calculated across tiered usage slabs:
$$\text{Energy Charges} = \sum_{i=1}^{n} (\text{Units in Slab}_i \times \text{Rate}_i)$$

---

## 3. Carbon Emissions & Tree Offset Equivalence

$$\text{CO}_2 \text{ Emitted (kg)} = \text{Energy Consumed (kWh)} \times 0.82\text{ kg CO}_2/\text{kWh}$$

$$\text{Trees Required for Annual Offset} = \frac{\text{CO}_2 \text{ Emitted (kg)}}{21.77\text{ kg CO}_2/\text{tree/year}}$$
