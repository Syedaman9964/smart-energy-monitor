/**
 * ============================================================================
 * WATTVISION - ESP32 ENERGY MONITOR & EDGE TELEMETRY FIRMWARE
 * ============================================================================
 * Project: Smart Energy Monitor & Analytics Platform
 * Target MCU: ESP32-WROOM-32 (NodeMCU-32S / ESP32 DevKit v1)
 * Framework: Arduino / PlatformIO
 * 
 * Hardware Connections:
 *   - PZEM-004T v3.0 RX -> ESP32 GPIO 17 (TX2)
 *   - PZEM-004T v3.0 TX -> ESP32 GPIO 16 (RX2)
 *   - 16x2 I2C LCD SDA  -> ESP32 GPIO 21
 *   - 16x2 I2C LCD SCL  -> ESP32 GPIO 22
 *   - 5V / GND          -> Common Power Rail (HLK-PM01 / USB)
 * ============================================================================
 */

#include <Arduino.h>
#include "config.h"
#include "pzem_handler.h"
#include "lcd_handler.h"
#include "wifi_manager.h"
#include "mqtt_client_handler.h"

// Hardware Module Instances
PZEMHandler pzemModule;
LCDHandler lcdModule;
WiFiManager wifiModule;
MQTTClientHandler mqttModule;

// Non-blocking loop timers
unsigned long lastPzemSampleTime = 0;
unsigned long lastLcdUpdateTime = 0;

void setup() {
  // 1. Initialize Serial for Debug Output
  Serial.begin(115200);
  delay(500);
  Serial.println("\n=================================================");
  Serial.println("   WATTVISION - ESP32 SMART ENERGY MONITOR v2.1  ");
  Serial.println("=================================================");

  // 2. Initialize 16x2 I2C LCD
  lcdModule.begin();
  lcdModule.showBootStatus("WattVision v2.1", "Booting system...");
  delay(800);

  // 3. Initialize PZEM Hardware UART (Serial2 on GPIO 16/17)
  pzemModule.begin();

  // 4. Initialize Wi-Fi Connection
  lcdModule.showBootStatus("Connecting WiFi", WIFI_SSID);
  wifiModule.connect();

  if (wifiModule.isConnected()) {
    lcdModule.showBootStatus("WiFi Connected!", wifiModule.getLocalIP().c_str());
  } else {
    lcdModule.showBootStatus("WiFi Timeout", "Offline Logging");
  }
  delay(1200);

  // 5. Initialize MQTT Handler
  mqttModule.begin();

  Serial.println("[SYSTEM] Setup completed successfully. Entering main execution loop...");
}

void loop() {
  unsigned long currentMillis = millis();

  // A. Network Maintenance
  wifiModule.handleReconnection();
  mqttModule.loop();

  // B. Sample PZEM-004T Sensor (every 2 seconds)
  if (currentMillis - lastPzemSampleTime >= SENSOR_READ_INTERVAL_MS) {
    lastPzemSampleTime = currentMillis;

    // Read all 6 parameters (with validation & simulation fallback)
    ElectricalReadings readings = pzemModule.readMetrics();

    if (readings.isValid) {
      Serial.printf("[TELEMETRY] [%s] V: %.1f V | I: %.3f A | P: %.1f W | E: %.3f kWh | F: %.1f Hz | PF: %.2f\n",
                    readings.isSimulated ? "SIMULATION" : "REAL-HARDWARE",
                    readings.voltage,
                    readings.current,
                    readings.power,
                    readings.energy,
                    readings.frequency,
                    readings.powerFactor);

      // C. Dispatch HTTP POST batch to Backend API
      wifiModule.sendTelemetryBatch(readings);

      // D. Publish to MQTT broker if enabled
      mqttModule.publishTelemetry(readings);
    } else {
      Serial.println("[WARN] Sensor readings invalid or AC line disconnected.");
    }
  }

  // E. Update Local 16x2 LCD Display (every 1 second)
  if (currentMillis - lastLcdUpdateTime >= LCD_REFRESH_INTERVAL_MS) {
    lastLcdUpdateTime = currentMillis;
    lcdModule.displayReadings(pzemModule.getLastReadings(), wifiModule.getLocalIP());
  }

  // Yield to FreeRTOS background tasks
  yield();
}
