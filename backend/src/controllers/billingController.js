/**
 * ============================================================================
 * BILLING CONTROLLER
 * ============================================================================
 * Serves real-time Indian billing calculations, MTD summaries, and custom
 * tariff forecasting simulations.
 */

import db from '../models/db.js';
import billingEngine from '../services/billingEngine.js';

export const getBillingSummary = (req, res) => {
  try {
    const telemetry = db.getLatestTelemetry();
    const tariffId = db.getActiveTariffId();
    const loadKw = db.getConnectedLoadKw();

    // Calculate current Month-To-Date (MTD) Bill
    const mtdBill = billingEngine.calculateBill({
      totalKwh: telemetry.energyToday * 26, // Estimated ~26 days into billing cycle
      tariffId,
      sanctionedLoadKw: loadKw,
      powerFactor: telemetry.powerFactor
    });

    // Projections
    const projections = billingEngine.projectFutureBills(telemetry.energyToday, tariffId);

    res.json({
      success: true,
      data: {
        mtdBill,
        projections,
        activeTariffId: tariffId,
        sanctionedLoadKw: loadKw,
        todayUnitsKwh: telemetry.energyToday,
        todayCostEstimateInr: Number((telemetry.energyToday * 6.20).toFixed(2))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const calculateCustomBill = (req, res) => {
  try {
    const {
      totalKwh = 150,
      tariffId = 'bescom_karnataka',
      sanctionedLoadKw = 3,
      powerFactor = 0.95,
      solarExportKwh = 0,
      customConfig
    } = req.body;

    const calculation = billingEngine.calculateBill({
      totalKwh: parseFloat(totalKwh),
      tariffId,
      sanctionedLoadKw: parseFloat(sanctionedLoadKw),
      powerFactor: parseFloat(powerFactor),
      solarExportKwh: parseFloat(solarExportKwh),
      customConfig
    });

    res.json({
      success: true,
      data: calculation
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getBillingHistory = (req, res) => {
  try {
    const tariffId = db.getActiveTariffId();
    const months = [
      { month: 'July 2026', units: 312.4, status: 'PAID', paidDate: '2026-08-05' },
      { month: 'June 2026', units: 345.8, status: 'PAID', paidDate: '2026-07-06' },
      { month: 'May 2026', units: 388.2, status: 'PAID', paidDate: '2026-06-04' },
      { month: 'April 2026', units: 395.0, status: 'PAID', paidDate: '2026-05-07' },
      { month: 'March 2026', units: 280.5, status: 'PAID', paidDate: '2026-04-05' },
      { month: 'February 2026', units: 245.0, status: 'PAID', paidDate: '2026-03-05' }
    ];

    const history = months.map(m => {
      const bill = billingEngine.calculateBill({ totalKwh: m.units, tariffId });
      return {
        ...m,
        amountInr: bill.finalBill,
        energyCharge: bill.baseEnergyCharge,
        fixedCharges: bill.fixedCharges,
        dutyTax: bill.electricityDuty
      };
    });

    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
