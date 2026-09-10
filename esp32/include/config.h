#ifndef CONFIG_H
#define CONFIG_H

/**
 * ============================================================================
 * WATTVISION - ESP32 FIRMWARE CONFIGURATION & HARDWARE PINOUTS
 * ============================================================================
 * Project: Smart Energy Monitoring & IoT Analytics Platform
 * Target: ESP32-WROOM-32 (NodeMCU-32S / ESP32 DevKit v1)
 */

// 1. Wi-Fi Access Point Credentials
#define WIFI_SSID               "Your_WiFi_SSID"
#define WIFI_PASSWORD           "Your_WiFi_Password"
#define WIFI_CONNECT_TIMEOUT_MS 20000

// 2. Backend Cloud / Local Gateway Server
// Set this to your computer's local IP where backend runs (e.g. 192.168.1.100:5000)
#define API_HOST                "http://192.168.1.100:5000"
#define API_ENDPOINT_TELEMETRY  "/api/telemetry/live"
#define API_TIMEOUT_MS          4000

// 3. MQTT Broker Settings (Optional / Alternate Transport)
#define MQTT_ENABLED            false
#define MQTT_BROKER             "broker.hivemq.com"
#define MQTT_PORT               1883
#define MQTT_TOPIC_TELEMETRY    "wattvision/devices/ESP32-01/telemetry"

// 4. Hardware UART Pin Configuration (PZEM-004T v3.0)
// Using ESP32 HardwareSerial 2 (Serial2)
#define PZEM_RX_PIN             16   // Connects to PZEM TX
#define PZEM_TX_PIN             17   // Connects to PZEM RX
#define PZEM_BAUD_RATE          9600

// 5. I2C LiquidCrystal Display Pinout (16x2 Character LCD)
#define LCD_I2C_ADDRESS         0x27 // Typically 0x27 or 0x3F for PCF8574
#define LCD_SDA_PIN             21   // ESP32 I2C Data
#define LCD_SCL_PIN             22   // ESP32 I2C Clock
#define LCD_COLUMNS             16
#define LCD_ROWS                2

// 6. Timers and Intervals
#define SENSOR_READ_INTERVAL_MS 2000  // Poll PZEM every 2 seconds
#define LCD_REFRESH_INTERVAL_MS 1000  // Refresh local screen every 1 second
#define HTTP_POST_INTERVAL_MS   2000  // Send batch to cloud every 2 seconds

// 7. Device Metadata & Simulation Switch
#define DEVICE_ID               "ESP32-WROOM-01"
#define FIRMWARE_VERSION        "v2.1.0-college-build"

// Set true to force simulation when physical PZEM sensor is not plugged into AC mains
#define FORCE_SIMULATION_MODE   false

#endif // CONFIG_H
