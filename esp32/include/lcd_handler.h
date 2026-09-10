#ifndef LCD_HANDLER_H
#define LCD_HANDLER_H

#include <Arduino.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include "config.h"
#include "pzem_handler.h"

class LCDHandler {
private:
  LiquidCrystal_I2C* lcd;
  uint8_t currentScreenPage;
  unsigned long lastPageSwitch;

public:
  LCDHandler() : lcd(nullptr), currentScreenPage(0), lastPageSwitch(0) {}

  void begin() {
    Wire.begin(LCD_SDA_PIN, LCD_SCL_PIN);
    lcd = new LiquidCrystal_I2C(LCD_I2C_ADDRESS, LCD_COLUMNS, LCD_ROWS);
    lcd->init();
    lcd->backlight();
    lcd->clear();
  }

  void showBootStatus(const char* line1, const char* line2) {
    if (!lcd) return;
    lcd->clear();
    lcd->setCursor(0, 0);
    lcd->print(line1);
    lcd->setCursor(0, 1);
    lcd->print(line2);
  }

  /**
   * Cycles through 3 display pages every 3 seconds:
   *   Page 0: Voltage & Current
   *   Page 1: Active Power & Total Energy
   *   Page 2: Frequency, Power Factor & Mode (REAL vs SIM)
   */
  void displayReadings(const ElectricalReadings& r, const String& ip) {
    if (!lcd) return;

    if (millis() - lastPageSwitch > 3000) {
      currentScreenPage = (currentScreenPage + 1) % 3;
      lastPageSwitch = millis();
      lcd->clear();
    }

    char buf[17];

    switch (currentScreenPage) {
      case 0:
        // Page 0: Voltage & Current
        lcd->setCursor(0, 0);
        snprintf(buf, sizeof(buf), "V: %5.1fV", r.voltage);
        lcd->print(buf);

        lcd->setCursor(0, 1);
        snprintf(buf, sizeof(buf), "I: %5.2fA %s", r.current, r.isSimulated ? "SIM" : "HW");
        lcd->print(buf);
        break;

      case 1:
        // Page 1: Power & Energy
        lcd->setCursor(0, 0);
        snprintf(buf, sizeof(buf), "P: %6.1f W", r.power);
        lcd->print(buf);

        lcd->setCursor(0, 1);
        snprintf(buf, sizeof(buf), "E: %5.2fkWh", r.energy);
        lcd->print(buf);
        break;

      case 2:
        // Page 2: Frequency & Power Factor
        lcd->setCursor(0, 0);
        snprintf(buf, sizeof(buf), "F:%4.1fHz PF:%4.2f", r.frequency, r.powerFactor);
        lcd->print(buf);

        lcd->setCursor(0, 1);
        lcd->print(ip.length() > 0 ? ip.substring(0, 16) : "No WiFi");
        break;
    }
  }
};

#endif // LCD_HANDLER_H
