#ifndef MQTT_CLIENT_HANDLER_H
#define MQTT_CLIENT_HANDLER_H

#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include "config.h"
#include "pzem_handler.h"

class MQTTClientHandler {
private:
  WiFiClient espClient;
  PubSubClient client;
  unsigned long lastMqttReconnect;

public:
  MQTTClientHandler() : client(espClient), lastMqttReconnect(0) {}

  void begin() {
#if MQTT_ENABLED
    client.setServer(MQTT_BROKER, MQTT_PORT);
    Serial.printf("[MQTT] Configured broker: %s:%d\n", MQTT_BROKER, MQTT_PORT);
#endif
  }

  void loop() {
#if MQTT_ENABLED
    if (!client.connected()) {
      unsigned long now = millis();
      if (now - lastMqttReconnect > 5000) {
        lastMqttReconnect = now;
        reconnect();
      }
    } else {
      client.loop();
    }
#endif
  }

  void reconnect() {
#if MQTT_ENABLED
    if (WiFi.status() != WL_CONNECTED) return;

    Serial.print("[MQTT] Connecting to broker...");
    String clientId = "WattVision-" + String(DEVICE_ID);
    if (client.connect(clientId.c_str())) {
      Serial.println(" Connected!");
    } else {
      Serial.printf(" Failed, rc=%d\n", client.state());
    }
#endif
  }

  bool publishTelemetry(const ElectricalReadings& r) {
#if MQTT_ENABLED
    if (!client.connected()) return false;

    StaticJsonDocument<384> doc;
    doc["deviceId"] = DEVICE_ID;
    doc["voltage"] = r.voltage;
    doc["current"] = r.current;
    doc["power"] = r.power;
    doc["energy"] = r.energy;
    doc["frequency"] = r.frequency;
    doc["powerFactor"] = r.powerFactor;
    doc["isSimulated"] = r.isSimulated;

    char buffer[384];
    size_t n = serializeJson(doc, buffer);
    return client.publish(MQTT_TOPIC_TELEMETRY, buffer, n);
#else
    return false;
#endif
  }
};

#endif // MQTT_CLIENT_HANDLER_H
