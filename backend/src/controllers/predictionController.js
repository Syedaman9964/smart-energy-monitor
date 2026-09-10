/**
 * ============================================================================
 * PREDICTION CONTROLLER
 * ============================================================================
 * Serves 24-hour predictive curves, 30-day forecast models, and scenario simulations.
 */

import predictionEngine from '../services/predictionEngine.js';

export const get24HourPrediction = (req, res) => {
  try {
    const forecast = predictionEngine.predict24HourLoad();
    res.json({
      success: true,
      data: forecast
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const get30DayPrediction = (req, res) => {
  try {
    const forecast = predictionEngine.predict30DayForecast();
    res.json({
      success: true,
      data: forecast
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const postScenarioSimulation = (req, res) => {
  try {
    const { additionalAcHours = 0, solarCapacityKw = 0, temperatureShiftC = 0 } = req.body;
    const result = predictionEngine.simulateScenario({
      additionalAcHours: parseFloat(additionalAcHours),
      solarCapacityKw: parseFloat(solarCapacityKw),
      temperatureShiftC: parseFloat(temperatureShiftC)
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
