#ifndef LCD_HANDLER_H
#define LCD_HANDLER_H

#include <Arduino.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include "config.h"
#include "pzem_handler.h"

class LCDHandler {
private:
  LiquidCrystal_I2C lcd;
  int currentScreenPage;

public:
  LCDHandler() : lcd(LCD_I2C_ADDRESS, LCD_COLUMNS, LCD_ROWS), currentScreenPage(0) {}

  void begin() {
    Wire.begin(LCD_SDA_PIN, LCD_SCL_PIN);
    lcd.init();
    lcd.backlight();
    lcd.clear();
    
    // Boot splash screen
    lcd.setCursor(0, 0);
    lcd.print("WattVision IoT");
    lcd.setCursor(0, 1);
    lcd.print("Energy Monitor");
    delay(1500);
    lcd.clear();
  }

  void showBootStatus(const char* statusLine1, const char* statusLine2) {
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print(statusLine1);
    lcd.setCursor(0, 1);
    lcd.print(statusLine2);
  }

  /**
   * Alternates between two metric display screens
   * Screen 0: Voltage, Current, and Active Power
   * Screen 1: Energy (kWh), Frequency, and Power Factor
   */
  void displayReadings(const ElectricalReadings& r, const String& ipStr) {
    lcd.clear();

    if (!r.isValid) {
      lcd.setCursor(0, 0);
      lcd.print("PZEM Sensor Disconn");
      lcd.setCursor(0, 1);
      lcd.print("IP: ");
      lcd.print(ipStr.length() > 0 ? ipStr.substring(0, 12) : "No WiFi");
      return;
    }

    if (currentScreenPage == 0) {
      // Screen 0: "V:230.1V  I:5.12A" / "P: 1178W  PF:0.98"
      lcd.setCursor(0, 0);
      lcd.printf("V:%.1fV I:%.2fA", r.voltage, r.current);
      
      lcd.setCursor(0, 1);
      lcd.printf("P:%.0fW PF:%.2f", r.power, r.powerFactor);
    } else {
      // Screen 1: "E: 148.35 kWh" / "F:50.0Hz IP:..145"
      lcd.setCursor(0, 0);
      lcd.printf("E: %.2fkWh", r.energy);
      
      lcd.setCursor(0, 1);
      lcd.printf("F:%.1fHz %s", r.frequency, ipStr.length() > 6 ? ipStr.substring(ipStr.lastIndexOf('.') + 1).c_str() : "WiFi");
    }

    // Toggle screen for next cycle
    currentScreenPage = (currentScreenPage + 1) % 2;
  }
};

#endif // LCD_HANDLER_H
