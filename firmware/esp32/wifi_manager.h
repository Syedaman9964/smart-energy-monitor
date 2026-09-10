#ifndef WIFI_MANAGER_H
#define WIFI_MANAGER_H

#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "config.h"
#include "pzem_handler.h"

class WiFiManager {
private:
  unsigned long lastReconnectAttempt;
  unsigned long lastHttpPostTime;

public:
  WiFiManager() : lastReconnectAttempt(0), lastHttpPostTime(0) {}

  void connect() {
    Serial.printf("[Wi-Fi] Connecting to SSID: %s\n", WIFI_SSID);
    WiFi.mode(WIFI_STA);
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

    unsigned long start = millis();
    while (WiFi.status() != WL_CONNECTED && millis() - start < WIFI_CONNECT_TIMEOUT_MS) {
      delay(500);
      Serial.print(".");
    }

    if (WiFi.status() == WL_CONNECTED) {
      Serial.println("\n[Wi-Fi] Connected successfully!");
      Serial.print("[Wi-Fi] IP Address: ");
      Serial.println(WiFi.localIP());
      Serial.print("[Wi-Fi] Signal Strength (RSSI): ");
      Serial.printf("%d dBm\n", WiFi.RSSI());
    } else {
      Serial.println("\n[Wi-Fi] Connection timed out. Will retry in background loop.");
    }
  }

  void handleReconnection() {
    if (WiFi.status() != WL_CONNECTED) {
      unsigned long now = millis();
      if (now - lastReconnectAttempt > 10000) { // Retry every 10 seconds
        lastReconnectAttempt = now;
        Serial.println("[Wi-Fi] Reconnecting to network...");
        WiFi.disconnect();
        WiFi.reconnect();
      }
    }
  }

  /**
   * Serializes electrical readings into JSON and sends HTTP POST to backend API
   */
  bool sendTelemetryBatch(const ElectricalReadings& r) {
    if (WiFi.status() != WL_CONNECTED || !r.isValid) {
      return false;
    }

    unsigned long now = millis();
    if (now - lastHttpPostTime < HTTP_POST_INTERVAL_MS) {
      return false;
    }
    lastHttpPostTime = now;

    HTTPClient http;
    String fullUrl = String(API_HOST) + String(API_ENDPOINT_TELEMETRY);
    http.begin(fullUrl);
    http.addHeader("Content-Type", "application/json");
    http.setTimeout(API_TIMEOUT_MS);

    // Build JSON Payload
    StaticJsonDocument<256> doc;
    doc["deviceId"] = DEVICE_ID;
    doc["voltage"] = r.voltage;
    doc["current"] = r.current;
    doc["power"] = r.power;
    doc["energy"] = r.energy;
    doc["frequency"] = r.frequency;
    doc["powerFactor"] = r.powerFactor;
    doc["wifiRssi"] = WiFi.RSSI();
    doc["uptimeSeconds"] = millis() / 1000;

    String requestBody;
    serializeJson(doc, requestBody);

    int httpResponseCode = http.POST(requestBody);
    bool success = false;

    if (httpResponseCode > 0) {
      Serial.printf("[HTTP POST] Response: %d -> Payload dispatched successfully\n", httpResponseCode);
      success = (httpResponseCode == 200 || httpResponseCode == 201);
    } else {
      Serial.printf("[HTTP POST ERROR] Failed, error: %s\n", http.errorToString(httpResponseCode).c_str());
    }

    http.end();
    return success;
  }

  String getLocalIP() const {
    if (WiFi.status() == WL_CONNECTED) {
      return WiFi.localIP().toString();
    }
    return "Disconnected";
  }

  bool isConnected() const {
    return WiFi.status() == WL_CONNECTED;
  }
};

#endif // WIFI_MANAGER_H
