/*
* Copyright Sahil Kale 2020
* Github: @dakaleyt | sahil.kale1@gmail.com
* All rights reserved
* 
* Purpose:
* Revision: 1.0
* Microcontroller: Arduino UNO
*/


#include <SoftwareSerial.h>

//Bluetooth declarations
int BTPinRx = 12; //Maps to correct pins
int BTPinTx = 11;
int BTbaudRate = 32000; //operates at 32KHz... I think?
SoftwareSerial BTSerial(BTPinRx, BTPinTx);

//Software Setup
int temperatureSensorPin = A0; //A0 maps to PC0 with a 328P
int kTemperatureConstant = 8.8;

void setup() 
{
  Serial.begin(9600); //initalizes the serial at 9600 baud. Testing only.
  BTSerial.begin(BTbaudRate);
}

double readSensor(int sensorPin, double kConst) //kConst is the value that can convert 0 - 1023 value into the number required
{
  int sensorValue = -1;  // variable to store the value coming from the sensor
  sensorValue = analogRead(sensorPin);
  
  if(sensorValue >= 0 && sensorValue <=1023)
  {
    return sensorValue * kConst; //gives temperature in degrees CELSIUS!! 
  }
  else { return -1; }

  Serial.println(sensorValue); //debug
}


void bluetoothFunction(double SensorValueToWrite)
{
  if(BTSerial.available())
  {
    Serial.write(BTSerial.read()); //outputs the bluetooth input if any is given. This could be used to communicate things like beeps, light status, etc
  }

  //real shit here:
  if(SensorValueToWrite != -1)
  {
    BTSerial.write(SensorValueToWrite); //writes the sensorValueToWrite
  }
  else { Serial.println("Error-Bluetooth NOT successful"); }
}



void loop() 
{ 
  bluetoothFunction(readSensor(temperatureSensorPin,kTemperatureConstant));
}
