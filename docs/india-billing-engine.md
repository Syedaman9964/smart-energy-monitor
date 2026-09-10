# 💰 Indian DISCOM Energy Billing Engine Specification

## 1. Mathematical Formulation

The total monthly electricity bill ($B_{\text{total}}$) under the Indian tariff methodology is formulated as:

$$B_{\text{total}} = \left( E_{\text{slab}} + F_{\text{demand}} + A_{\text{FAC}} + P_{\text{PF}} - R_{\text{PF}} \right) \times \left(1 + \frac{D_{\text{tax}}}{100}\right)$$

Where:
- $E_{\text{slab}}$: Progressive multi-slab energy consumption charges (₹).
- $F_{\text{demand}}$: Fixed demand charge based on sanctioned load ($L_{\text{kW}} \times \text{Rate}_{\text{kW}}$).
- $A_{\text{FAC}}$: Fuel Adjustment Charge ($\text{Net kWh} \times \text{FAC}_{\text{rate}}$).
- $P_{\text{PF}}$: Power Factor Surcharge penalty for lagging power factor below 0.85.
- $R_{\text{PF}}$: Power Factor Rebate incentive for unity power factor ($\ge 0.95$).
- $D_{\text{tax}}$: State Electricity Duty & GST (5% to 18%).

---

## 2. Multi-Slab DISCOM Tariffs Modeled

### A. BESCOM (Karnataka) - LT-2(a)
- **0 - 50 units**: ₹4.15 / unit
- **51 - 100 units**: ₹5.60 / unit
- **101 - 200 units**: ₹7.15 / unit
- **> 200 units**: ₹8.20 / unit
- **Fixed Demand**: ₹110 / kW / month
- **Electricity Duty**: 9%

### B. TANGEDCO (Tamil Nadu) - Tariff 1A
- **0 - 100 units**: ₹0.00 / unit (Govt subsidy)
- **101 - 200 units**: ₹2.25 / unit
- **201 - 400 units**: ₹4.50 / unit
- **401 - 500 units**: ₹6.00 / unit
- **> 500 units**: ₹8.00 / unit
- **Fixed Demand**: ₹50 / kW / month
- **Electricity Duty**: 5%

### C. MSEDCL (Maharashtra) - LT-I Residential
- **0 - 100 units**: ₹3.36 / unit
- **101 - 300 units**: ₹7.34 / unit
- **301 - 500 units**: ₹10.37 / unit
- **> 500 units**: ₹11.86 / unit
- **Fixed Demand**: ₹128 / kW / month
- **FAC**: ₹0.65 / unit
- **Electricity Duty**: 16%
