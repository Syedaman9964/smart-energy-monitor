/**
 * ============================================================================
 * WATT VISION - ESP32 + PZEM-004T + LCD SMART ENERGY MONITOR
 * ============================================================================
 * Project: Smart Energy Monitor & Analytics Platform
 * Target MCU: ESP32-WROOM-32 (NodeMCU-32S / ESP32 DevKit v1)
 * Framework: Arduino IDE / PlatformIO
 * 
 * Hardware Description:
 *   - ESP32 Dual Core @ 240 MHz
 *   - PZEM-004T v3.0 TTL UART AC Energy Meter (80-260V AC, 0-100A)
 *   - 100A Split-Core Current Transformer (CT Clamp)
 *   - 16x2 Character LCD via PCF8574 I2C Backpack
 *   - 5V AC-DC Step Down Power Module (HLK-PM01)
 * 
 * Pinout Connections:
 *   - PZEM RX  -> ESP32 GPIO 17 (TX2)
 *   - PZEM TX  -> ESP32 GPIO 16 (RX2)
 *   - LCD SDA  -> ESP32 GPIO 21
 *   - LCD SCL  -> ESP32 GPIO 22
 *   - 5V & GND -> Common Power Rail
 * ============================================================================
 */

#include <Arduino.h>
#include "config.h"
#include "pzem_handler.h"
#include "lcd_handler.h"
#include "wifi_manager.h"

// Instantiate Hardware Modules
PZEMHandler pzemModule;
LCDHandler lcdModule;
WiFiManager wifiModule;

// Non-blocking Timers
unsigned long lastPzemSampleTime = 0;
unsigned long lastLcdUpdateTime = 0;

void setup() {
  // 1. Initialize Serial for Debug Output
  Serial.begin(115200);
  delay(500);
  Serial.println("\n=============================================");
  Serial.println("   WATT VISION - SMART ENERGY MONITOR V2.1   ");
  Serial.println("=============================================");

  // 2. Initialize LCD Display
  lcdModule.begin();
  lcdModule.showBootStatus("Booting...", "Connecting WiFi");

  // 3. Initialize PZEM Hardware UART (Serial2 on GPIO 16/17)
  pzemModule.begin();

  // 4. Initialize Wi-Fi Connection
  wifiModule.connect();

  if (wifiModule.isConnected()) {
    lcdModule.showBootStatus("WiFi Connected", wifiModule.getLocalIP().c_str());
  } else {
    lcdModule.showBootStatus("WiFi Timeout", "Offline Logging");
  }
  delay(1200);

  Serial.println("[SYSTEM] Setup completed successfully. Entering main execution loop...");
}

void loop() {
  unsigned long currentMillis = millis();

  // A. Wi-Fi Auto-Reconnection Maintenance
  wifiModule.handleReconnection();

  // B. Sample PZEM-004T Sensor (every 2 seconds)
  if (currentMillis - lastPzemSampleTime >= SENSOR_READ_INTERVAL_MS) {
    lastPzemSampleTime = currentMillis;

    // Read all 6 parameters
    ElectricalReadings readings = pzemModule.readMetrics();

    if (readings.isValid) {
      Serial.printf("[TELEMETRY] V: %.1f V | I: %.3f A | P: %.1f W | E: %.2f kWh | F: %.1f Hz | PF: %.2f\n",
                    readings.voltage,
                    readings.current,
                    readings.power,
                    readings.energy,
                    readings.frequency,
                    readings.powerFactor);

      // C. Transmit Payload to Cloud / Backend API
      wifiModule.sendTelemetryBatch(readings);
    } else {
      Serial.println("[WARN] Sensor readings invalid or AC line disconnected.");
    }
  }

  // D. Update Local 16x2 LCD Display (every 1 second)
  if (currentMillis - lastLcdUpdateTime >= LCD_REFRESH_INTERVAL_MS) {
    lastLcdUpdateTime = currentMillis;
    lcdModule.displayReadings(pzemModule.getLastReadings(), wifiModule.getLocalIP());
  }

  // Yield to ESP32 RTOS background Wi-Fi tasks
  yield();
}
