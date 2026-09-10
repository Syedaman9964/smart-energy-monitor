/**
 * ============================================================================
 * WATT VISION - ELECTRICAL & ENERGY CALCULATIONS UTILITY
 * ============================================================================
 * Standard electrical engineering formulas and utility billing algorithms.
 * Used across the dashboard for active power, apparent power, reactive power,
 * power factor grading, carbon emissions, and tariff estimations.
 */

/**
 * Calculates Apparent Power (S) in Volt-Amperes (VA).
 * Formula: S = Voltage (V) * Current (A)
 * 
 * @param {number} voltage - RMS voltage in Volts (V)
 * @param {number} current - RMS current in Amperes (A)
 * @returns {number} Apparent power in VA
 */
export function calculateApparentPower(voltage, current) {
  if (!voltage || !current) return 0;
  return Number((voltage * current).toFixed(2));
}

/**
 * Calculates Reactive Power (Q) in Volt-Amperes Reactive (VAR).
 * Formula: Q = sqrt(S^2 - P^2)
 * 
 * @param {number} apparentPowerVA - Apparent power in VA
 * @param {number} activePowerW - Real / Active power in Watts (W)
 * @returns {number} Reactive power in VAR
 */
export function calculateReactivePower(apparentPowerVA, activePowerW) {
  if (apparentPowerVA <= activePowerW) return 0;
  return Number(Math.sqrt(Math.pow(apparentPowerVA, 2) - Math.pow(activePowerW, 2)).toFixed(2));
}

/**
 * Evaluates the Power Factor efficiency status and health.
 * cos φ closer to 1.0 indicates high efficiency; lower than 0.85 incurs penalties.
 * 
 * @param {number} pf - Power factor value between 0.00 and 1.00
 * @returns {{ grade: string, status: string, color: string, description: string }}
 */
export function evaluatePowerFactor(pf) {
  if (pf >= 0.95) {
    return {
      grade: 'A+',
      status: 'Optimal Efficiency',
      color: '#10b981',
      description: 'Near-unity power factor. Minimal reactive losses on grid.'
    };
  }
  if (pf >= 0.90) {
    return {
      grade: 'A',
      status: 'Good Efficiency',
      color: '#34d399',
      description: 'Standard residential inductive load performance.'
    };
  }
  if (pf >= 0.80) {
    return {
      grade: 'B',
      status: 'Moderate Inductive Lag',
      color: '#f59e0b',
      description: 'Inductive motors active. Power factor correction recommended for commercial setups.'
    };
  }
  return {
    grade: 'C (Poor)',
    status: 'Poor (High Reactive Penalty)',
    color: '#ef4444',
    description: 'High inductive lag or capacitive distortion. Check capacitors and chokes.'
  };
}

/**
 * Computes India Grid CO2 Carbon Emissions from energy consumed (kWh).
 * Based on Central Electricity Authority (CEA) India baseline grid emission factor:
 * Standard factor ~ 0.82 kg CO2 / kWh (Thermal-dominated grid mix).
 * 
 * @param {number} energyKwh - Energy consumed in kWh
 * @param {number} [emissionFactor=0.82] - Emission factor in kg CO2/kWh
 * @returns {{ kgCO2: number, treesRequired: number }}
 */
export function calculateCarbonFootprint(energyKwh, emissionFactor = 0.82) {
  const kgCO2 = Number((energyKwh * emissionFactor).toFixed(2));
  // 1 mature tree absorbs ~21.77 kg CO2 per year
  const treesRequired = Number((kgCO2 / 21.77).toFixed(1));
  return { kgCO2, treesRequired };
}

/**
 * Calculates estimated electricity bill using multi-slab tiered DISCOM structure.
 * 
 * Slabs (Indian DISCOM Reference - e.g., BESCOM / TANGEDCO model):
 *   - Slab 1: 0 - 50 units   -> ₹4.15 / unit
 *   - Slab 2: 51 - 100 units  -> ₹5.60 / unit
 *   - Slab 3: 101 - 200 units -> ₹7.15 / unit
 *   - Slab 4: > 200 units     -> ₹8.20 / unit
 * 
 * @param {number} totalUnitsKwh - Total cumulative units in kWh
 * @param {number} fixedCharge - Fixed monthly meter rent (₹)
 * @param {number} gstPercent - Electricity duty/GST percentage (e.g., 18%)
 * @returns {{ energyCost: number, fixedCharge: number, dutyTax: number, totalBill: number }}
 */
export function calculateTieredBill(totalUnitsKwh, fixedCharge = 150, gstPercent = 18) {
  let remaining = Math.max(0, totalUnitsKwh);
  let energyCost = 0;

  // Slab 1
  const slab1 = Math.min(remaining, 50);
  energyCost += slab1 * 4.15;
  remaining -= slab1;

  // Slab 2
  if (remaining > 0) {
    const slab2 = Math.min(remaining, 50);
    energyCost += slab2 * 5.60;
    remaining -= slab2;
  }

  // Slab 3
  if (remaining > 0) {
    const slab3 = Math.min(remaining, 100);
    energyCost += slab3 * 7.15;
    remaining -= slab3;
  }

  // Slab 4
  if (remaining > 0) {
    energyCost += remaining * 8.20;
  }

  const dutyTax = Number(((energyCost + fixedCharge) * (gstPercent / 100)).toFixed(2));
  const totalBill = Number((energyCost + fixedCharge + dutyTax).toFixed(2));

  return {
    energyCost: Number(energyCost.toFixed(2)),
    fixedCharge,
    dutyTax,
    totalBill
  };
}
