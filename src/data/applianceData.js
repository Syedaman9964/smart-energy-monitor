/**
 * ============================================================================
 * WATT VISION - APPLIANCE REGISTRY & DISAGGREGATION PROFILE DATA
 * ============================================================================
 * Contains technical energy profiles for standard household & lab electrical loads
 * with rated wattage, typical operating power factor (cos φ), and daily energy shares.
 */

export const APPLIANCE_REGISTRY = [
  {
    id: 'app-01',
    name: 'Dual Inverter Split AC (1.5 Ton)',
    category: 'HVAC / Cooling',
    location: 'Master Bedroom',
    ratedWatts: 1500,
    currentPower: 1180, // Watts active
    voltage: 230.1,
    current: 5.12,
    powerFactor: 0.98,
    energyToday: 5.42, // kWh
    costToday: 43.36,  // ₹
    status: 'ON',
    isHardwareControlled: false,
    usagePercentage: 42.2,
    starRating: 5,
    icon: 'Wind'
  },
  {
    id: 'app-02',
    name: 'Storage Water Geyser (25L)',
    category: 'Water Heating',
    location: 'Bathroom 1',
    ratedWatts: 2000,
    currentPower: 0,
    voltage: 229.8,
    current: 0.0,
    powerFactor: 1.00,
    energyToday: 1.95,
    costToday: 15.60,
    status: 'STANDBY',
    isHardwareControlled: false,
    usagePercentage: 15.2,
    starRating: 4,
    icon: 'Flame'
  },
  {
    id: 'app-03',
    name: 'Frost-Free Inverter Refrigerator (350L)',
    category: 'Refrigeration',
    location: 'Kitchen',
    ratedWatts: 220,
    currentPower: 145,
    voltage: 230.2,
    current: 0.65,
    powerFactor: 0.95,
    energyToday: 2.15,
    costToday: 17.20,
    status: 'ON',
    isHardwareControlled: false,
    usagePercentage: 16.7,
    starRating: 5,
    icon: 'Snowflake'
  },
  {
    id: 'app-04',
    name: 'Fully Automatic Front-Load Washing Machine',
    category: 'Laundry',
    location: 'Utility Area',
    ratedWatts: 1800,
    currentPower: 0,
    voltage: 229.7,
    current: 0.0,
    powerFactor: 0.92,
    energyToday: 0.84,
    costToday: 6.72,
    status: 'STANDBY',
    isHardwareControlled: false,
    usagePercentage: 6.5,
    starRating: 5,
    icon: 'Shirt'
  },
  {
    id: 'app-05',
    name: 'Induction Cooktop (2000W)',
    category: 'Cooking',
    location: 'Kitchen',
    ratedWatts: 2000,
    currentPower: 0,
    voltage: 229.9,
    current: 0.0,
    powerFactor: 0.99,
    energyToday: 1.10,
    costToday: 8.80,
    status: 'OFF',
    isHardwareControlled: false,
    usagePercentage: 8.6,
    starRating: 4,
    icon: 'CookingPot'
  },
  {
    id: 'app-06',
    name: 'BLDC Energy-Efficient Ceiling Fans (x4)',
    category: 'Ventilation',
    location: 'Living & Bedrooms',
    ratedWatts: 140, // 35W each
    currentPower: 110,
    voltage: 230.0,
    current: 0.48,
    powerFactor: 0.98,
    energyToday: 0.72,
    costToday: 5.76,
    status: 'ON',
    isHardwareControlled: false,
    usagePercentage: 5.6,
    starRating: 5,
    icon: 'Fan'
  },
  {
    id: 'app-07',
    name: 'Smart 4K LED TV + Soundbar System',
    category: 'Entertainment',
    location: 'Living Room',
    ratedWatts: 180,
    currentPower: 0,
    voltage: 229.9,
    current: 0.0,
    powerFactor: 0.94,
    energyToday: 0.45,
    costToday: 3.60,
    status: 'STANDBY',
    isHardwareControlled: false,
    usagePercentage: 3.5,
    starRating: 4,
    icon: 'Tv'
  },
  {
    id: 'app-08',
    name: 'LED Home Lighting Network (20 Points)',
    category: 'Lighting',
    location: 'All Rooms',
    ratedWatts: 180, // 9W average per bulb
    currentPower: 54,
    voltage: 230.0,
    current: 0.24,
    powerFactor: 0.96,
    energyToday: 0.21,
    costToday: 1.68,
    status: 'ON',
    isHardwareControlled: false,
    usagePercentage: 1.7,
    starRating: 5,
    icon: 'Lightbulb'
  }
];
