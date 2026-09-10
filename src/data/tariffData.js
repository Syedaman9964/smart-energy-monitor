/**
 * ============================================================================
 * WATT VISION - TARIFF & DISCOM BILLING DATA CONFIGURATION
 * ============================================================================
 * Defines India utility electricity tariff slabs, Time-of-Day (ToD) peak rules,
 * fixed meter charges, and statutory GST / electricity duty rates.
 */

// 1. Standard Indian State DISCOM Reference Profiles (e.g. BESCOM, TANGEDCO, MSEDCL)
export const INDIAN_DISCOM_PROFILES = [
  {
    id: 'bescom-karnataka',
    name: 'BESCOM (Karnataka) - LT2(a) Domestic',
    currency: '₹',
    slabs: [
      { range: '0 - 50 units', rate: 4.15 },
      { range: '51 - 100 units', rate: 5.60 },
      { range: '101 - 200 units', rate: 7.15 },
      { range: 'Above 200 units', rate: 8.20 }
    ],
    fixedMonthlyCharge: 110.00,
    electricityDutyPercent: 9.0,
    peakSurchargePercent: 20.0,
    peakHours: '18:00 - 22:00 IST'
  },
  {
    id: 'tangedco-tn',
    name: 'TANGEDCO (Tamil Nadu) - Domestic Low Tension',
    currency: '₹',
    slabs: [
      { range: '0 - 100 units', rate: 0.00 }, // Subsidized
      { range: '101 - 200 units', rate: 2.25 },
      { range: '201 - 400 units', rate: 4.50 },
      { range: 'Above 400 units', rate: 6.00 }
    ],
    fixedMonthlyCharge: 50.00,
    electricityDutyPercent: 5.0,
    peakSurchargePercent: 15.0,
    peakHours: '18:30 - 21:30 IST'
  },
  {
    id: 'msedcl-maharashtra',
    name: 'MSEDCL (Maharashtra) - Residential LT-I',
    currency: '₹',
    slabs: [
      { range: '0 - 100 units', rate: 5.88 },
      { range: '101 - 300 units', rate: 11.26 },
      { range: '301 - 500 units', rate: 16.03 },
      { range: 'Above 500 units', rate: 17.81 }
    ],
    fixedMonthlyCharge: 138.00,
    electricityDutyPercent: 16.0,
    peakSurchargePercent: 25.0,
    peakHours: '18:00 - 22:00 IST'
  }
];

// 2. Active Default Tariff Settings for WattVision Dashboard
export const DEFAULT_TARIFF_SETTINGS = {
  currency: '₹',
  baseRatePerKwh: 8.00,       // ₹8.00 / kWh
  peakRatePerKwh: 12.00,      // ₹12.00 / kWh during peak hours
  offPeakRatePerKwh: 5.00,    // ₹5.00 / kWh during off-peak night hours
  fixedMonthlyCharge: 150.00, // ₹150 / month fixed meter rent
  taxRatePercent: 18.0,       // 18% GST / Electricity Duty
  billingCycleDay: 1,         // Billing cycle starts 1st of month
  peakHoursStart: '18:00',
  peakHoursEnd: '22:00'
};
