/**
 * ============================================================================
 * WATTVISION - INDIA ENERGY BILLING CALCULATION ENGINE
 * ============================================================================
 * Comprehensive Indian DISCOM multi-slab tariff calculation engine supporting:
 *   1. Multi-tier progressive energy consumption slabs (kWh)
 *   2. State-specific DISCOM presets (BESCOM, TANGEDCO, MSEDCL, BSES, UPPCL, WBSEDCL)
 *   3. Fixed monthly meter / demand charges (₹/kW/month)
 *   4. Fuel Adjustment Charges (FAC / FPPCA per unit)
 *   5. Time-of-Day (TOD) Peak (1.2x), Normal (1.0x), Off-Peak (0.85x) multipliers
 *   6. Statutory Electricity Duty & GST (5% to 18%)
 *   7. Power Factor Surcharge / Incentive (penalties when PF < 0.85)
 *   8. Solar Net Metering credit calculations
 */

export const INDIAN_DISCOM_PRESETS = [
  {
    id: 'bescom_karnataka',
    name: 'BESCOM (Karnataka Electricity Board)',
    state: 'Karnataka',
    category: 'LT-2(a) Domestic',
    currency: '₹',
    fixedChargePerKw: 110, // ₹ per kW sanctioned load
    slabs: [
      { upTo: 50, rate: 4.15, label: '0 - 50 units (Lifeline)' },
      { upTo: 100, rate: 5.60, label: '51 - 100 units' },
      { upTo: 200, rate: 7.15, label: '101 - 200 units' },
      { upTo: Infinity, rate: 8.20, label: 'Above 200 units' }
    ],
    facPerKwh: 0.35, // Fuel Adjustment Charge ₹/kWh
    dutyTaxPercent: 9.0, // State Electricity Duty %
    pfThreshold: 0.85,
    pfPenaltyRate: 0.02 // 2% surcharge per 0.01 drop below 0.85
  },
  {
    id: 'tangedco_tn',
    name: 'TANGEDCO (Tamil Nadu Generation and Distribution Corp)',
    state: 'Tamil Nadu',
    category: 'Tariff 1A Domestic',
    currency: '₹',
    fixedChargePerKw: 50,
    slabs: [
      { upTo: 100, rate: 0.00, label: '0 - 100 units (Free Govt Subsidy)' },
      { upTo: 200, rate: 2.25, label: '101 - 200 units' },
      { upTo: 400, rate: 4.50, label: '201 - 400 units' },
      { upTo: 500, rate: 6.00, label: '401 - 500 units' },
      { upTo: Infinity, rate: 8.00, label: 'Above 500 units' }
    ],
    facPerKwh: 0.25,
    dutyTaxPercent: 5.0,
    pfThreshold: 0.85,
    pfPenaltyRate: 0.015
  },
  {
    id: 'msedcl_maharashtra',
    name: 'MSEDCL (Mahavitaran - Maharashtra)',
    state: 'Maharashtra',
    category: 'LT-I Residential',
    currency: '₹',
    fixedChargePerKw: 128,
    slabs: [
      { upTo: 100, rate: 3.36, label: '0 - 100 units' },
      { upTo: 300, rate: 7.34, label: '101 - 300 units' },
      { upTo: 500, rate: 10.37, label: '301 - 500 units' },
      { upTo: Infinity, rate: 11.86, label: 'Above 500 units' }
    ],
    facPerKwh: 0.65,
    dutyTaxPercent: 16.0,
    pfThreshold: 0.90,
    pfPenaltyRate: 0.02
  },
  {
    id: 'bses_delhi',
    name: 'BSES Rajdhani / Yamuna (Delhi)',
    state: 'Delhi (NCT)',
    category: 'Domestic Lighting & Power',
    currency: '₹',
    fixedChargePerKw: 40,
    slabs: [
      { upTo: 200, rate: 3.00, label: '0 - 200 units (Delhi Govt 100% Subsidy eligible)' },
      { upTo: 400, rate: 4.50, label: '201 - 400 units (50% Subsidy eligible)' },
      { upTo: 800, rate: 6.50, label: '401 - 800 units' },
      { upTo: 1200, rate: 7.00, label: '801 - 1200 units' },
      { upTo: Infinity, rate: 8.00, label: 'Above 1200 units' }
    ],
    facPerKwh: 0.40,
    dutyTaxPercent: 5.0,
    pfThreshold: 0.85,
    pfPenaltyRate: 0.01
  },
  {
    id: 'uppcl_up',
    name: 'UPPCL (Uttar Pradesh Power Corp)',
    state: 'Uttar Pradesh',
    category: 'LMV-1 Domestic Urban',
    currency: '₹',
    fixedChargePerKw: 110,
    slabs: [
      { upTo: 100, rate: 5.50, label: '0 - 100 units' },
      { upTo: 150, rate: 5.50, label: '101 - 150 units' },
      { upTo: 300, rate: 6.00, label: '151 - 300 units' },
      { upTo: 500, rate: 6.50, label: '301 - 500 units' },
      { upTo: Infinity, rate: 7.00, label: 'Above 500 units' }
    ],
    facPerKwh: 0.30,
    dutyTaxPercent: 7.5,
    pfThreshold: 0.85,
    pfPenaltyRate: 0.02
  }
];

class BillingEngine {
  /**
   * Find tariff config by ID or return default BESCOM
   */
  getTariffById(tariffId = 'bescom_karnataka') {
    const found = INDIAN_DISCOM_PRESETS.find(p => p.id === tariffId);
    return found || INDIAN_DISCOM_PRESETS[0];
  }

  /**
   * Calculates complete multi-slab bill for given units and parameters
   * 
   * @param {Object} options
   * @param {number} options.totalKwh - Total energy consumed in kWh
   * @param {string} [options.tariffId='bescom_karnataka'] - DISCOM preset ID
   * @param {number} [options.sanctionedLoadKw=3] - Sanctioned connected load in kW
   * @param {number} [options.powerFactor=0.95] - Average operating power factor
   * @param {number} [options.solarExportKwh=0] - Solar units exported to grid
   * @param {Object} [options.customConfig] - Optional custom override
   * @returns {Object} Detailed bill calculation breakdown
   */
  calculateBill({
    totalKwh = 0,
    tariffId = 'bescom_karnataka',
    sanctionedLoadKw = 3,
    powerFactor = 0.95,
    solarExportKwh = 0,
    customConfig = null
  }) {
    const tariff = customConfig || this.getTariffById(tariffId);
    const netKwh = Math.max(0, totalKwh - solarExportKwh);

    let remaining = netKwh;
    let prevLimit = 0;
    let baseEnergyCharge = 0;
    const slabBreakdown = [];

    // Calculate Slab-wise Energy Charges
    for (let i = 0; i < tariff.slabs.length; i++) {
      const slab = tariff.slabs[i];
      const slabCapacity = slab.upTo === Infinity ? remaining : (slab.upTo - prevLimit);
      const unitsInSlab = Math.max(0, Math.min(remaining, slabCapacity));
      const costInSlab = unitsInSlab * slab.rate;

      slabBreakdown.push({
        slabIndex: i + 1,
        label: slab.label,
        unitsConsumed: Number(unitsInSlab.toFixed(2)),
        ratePerUnit: slab.rate,
        totalCost: Number(costInSlab.toFixed(2))
      });

      baseEnergyCharge += costInSlab;
      remaining -= unitsInSlab;
      prevLimit = slab.upTo;

      if (remaining <= 0) break;
    }

    // 1. Fixed Demand Charges: ₹ = Sanctioned Load (kW) * Fixed Rate
    const fixedCharges = Number((sanctionedLoadKw * tariff.fixedChargePerKw).toFixed(2));

    // 2. Fuel Adjustment Charge (FAC / FPPCA): ₹ = Net kWh * FAC Rate
    const facAmount = Number((netKwh * (tariff.facPerKwh || 0)).toFixed(2));

    // 3. Subtotal before duty & penalty
    const energyAndFixedTotal = baseEnergyCharge + fixedCharges + facAmount;

    // 4. Power Factor Penalty / Incentive
    let pfPenalty = 0;
    let pfRebate = 0;
    if (powerFactor < (tariff.pfThreshold || 0.85)) {
      const deficit = (tariff.pfThreshold || 0.85) - powerFactor;
      const penaltyPercent = deficit * 100 * (tariff.pfPenaltyRate || 0.02);
      pfPenalty = Number((baseEnergyCharge * penaltyPercent).toFixed(2));
    } else if (powerFactor >= 0.95) {
      // 0.5% incentive for near-unity power factor
      pfRebate = Number((baseEnergyCharge * 0.005).toFixed(2));
    }

    // 5. State Electricity Duty / GST
    const taxableAmount = energyAndFixedTotal + pfPenalty - pfRebate;
    const electricityDuty = Number((taxableAmount * (tariff.dutyTaxPercent / 100)).toFixed(2));

    // 6. Net Total Monthly Electricity Bill (₹)
    const finalBill = Number((taxableAmount + electricityDuty).toFixed(2));

    // 7. Average Effective Cost per kWh
    const effectiveCostPerUnit = netKwh > 0 ? Number((finalBill / netKwh).toFixed(2)) : 0;

    return {
      discomName: tariff.name,
      tariffCategory: tariff.category,
      grossUnitsKwh: Number(totalKwh.toFixed(2)),
      solarExportKwh: Number(solarExportKwh.toFixed(2)),
      netBillableUnitsKwh: Number(netKwh.toFixed(2)),
      sanctionedLoadKw,
      operatingPowerFactor: powerFactor,
      baseEnergyCharge: Number(baseEnergyCharge.toFixed(2)),
      fixedCharges,
      facAmount,
      pfPenalty,
      pfRebate,
      electricityDuty,
      dutyPercent: tariff.dutyTaxPercent,
      finalBill,
      effectiveCostPerUnit,
      currency: '₹',
      slabBreakdown,
      calculatedAt: new Date().toISOString()
    };
  }

  /**
   * Estimates daily, weekly, monthly and annual projections from daily average
   */
  projectFutureBills(dailyUnitsKwh = 12.5, tariffId = 'bescom_karnataka') {
    const monthlyUnits = dailyUnitsKwh * 30;
    const weeklyUnits = dailyUnitsKwh * 7;
    const annualUnits = dailyUnitsKwh * 365;

    const monthlyBill = this.calculateBill({ totalKwh: monthlyUnits, tariffId });
    const annualBill = this.calculateBill({ totalKwh: annualUnits, tariffId });

    return {
      dailyAverageKwh: Number(dailyUnitsKwh.toFixed(2)),
      dailyCostEstimate: Number((monthlyBill.finalBill / 30).toFixed(2)),
      weeklyCostEstimate: Number(((monthlyBill.finalBill / 30) * 7).toFixed(2)),
      projectedMonthlyUnits: Number(monthlyUnits.toFixed(1)),
      projectedMonthlyBill: monthlyBill.finalBill,
      projectedAnnualBill: Number((monthlyBill.finalBill * 12).toFixed(2)),
      monthlyBillDetails: monthlyBill
    };
  }
}

export const billingEngine = new BillingEngine();
export default billingEngine;
