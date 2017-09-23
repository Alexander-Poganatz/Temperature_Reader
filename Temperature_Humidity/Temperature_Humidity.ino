/**
*@file: Temperature_Humidity.ino
*@author Alexander Poganatz
*@author a_poganatz@outlook.com
*@date 2017-09-22
*@verion 0.1
*@brief Recieves data from the serial port, gets a temperature reading, and then sends it back
*/

#include <dht11.h>

#define DHT11PIN 8
#define END_OF_DATA_TAG '\r'

dht11 DHT11;

/**
*@fn void setup()
*@brief Gets the program ready for communication.
*@return nothing
*/
void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
}

/**
*@fn void loop()
*@brief Upon recieving serial data, eat it all up, get sensor data, and send it back
*@return nothing
*/
void loop() {
  // put your main code here, to run repeatedly:
  if(Serial.available() > 0)
  {
    while(Serial.available() > 0)
      Serial.read();
    
    int check = DHT11.read(DHT11PIN);
    switch(check)
    {
      case DHTLIB_OK:
        Serial.print(DHT11.temperature);
        Serial.print(',');
        Serial.print(DHT11.humidity);
        break;
      case DHTLIB_ERROR_TIMEOUT:
        Serial.print("Error: time out when communicating with the sensor.");
        
        break;
      case DHTLIB_ERROR_CHECKSUM:
        Serial.print("Error: data from sensor is currupted");
        break;
      default:
        Serial.print("Error: unknown issue communicating with sensor");
        break;
    }
    Serial.print(END_OF_DATA_TAG);
  }
  delay(1000);
}
