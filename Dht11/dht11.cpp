//
//    FILE: dht11.cpp
// VERSION: 0.4.1
// PURPOSE: DHT11 Temperature & Humidity Sensor library for Arduino
// LICENSE: GPL v3 (http://www.gnu.org/licenses/gpl.html)
//
// DATASHEET: http://www.micro4you.com/files/sensor/DHT11.pdf
//
// HISTORY:
// George Hadjikyriacou - Original version (??)
// Mod by SimKard - Version 0.2 (24/11/2010)
// Mod by Rob Tillaart - Version 0.3 (28/03/2011)
// + added comments
// + removed all non DHT11 specific code
// + added references
// Mod by Rob Tillaart - Version 0.4 (17/03/2012)
// + added 1.0 support
// Mod by Rob Tillaart - Version 0.4.1 (19/05/2012)
// + added error codes
// Mod by Alexander Poganatz - (22/09/2017)
// + changed the timeout check from a 10000 iteration for loop to 100 microseconds
// + Added all the data when verifying the checksum instead of just the integer humidity and temperature values
//

#include "dht11.h"

#define TIMEOUT_VALUE 100

// Return values:
// DHTLIB_OK
// DHTLIB_ERROR_CHECKSUM
// DHTLIB_ERROR_TIMEOUT
int dht11::read(int pin)
{
	// BUFFER TO RECEIVE
	uint8_t bits[5];
	uint8_t cnt = 7;
	uint8_t idx = 0;

	// EMPTY BUFFER
	for (int i=0; i< 5; i++) bits[i] = 0;

	// REQUEST SAMPLE
	pinMode(pin, OUTPUT);
	digitalWrite(pin, LOW);
	delay(20);
	digitalWrite(pin, HIGH);
	unsigned long t = micros();
	//Wait for DHT response
	delayMicroseconds(20);
	pinMode(pin, INPUT);
	while(HIGH == digitalRead(pin))
		if((micros() - t) > TIMEOUT_VALUE) {return DHTLIB_ERROR_TIMEOUT;}

	// DHT sends out response signal for 80microseconds
	t = micros();
	while(digitalRead(pin) == LOW)
		if ((micros() - t) > TIMEOUT_VALUE) {return DHTLIB_ERROR_TIMEOUT;}

	//Pulss up for 80 microseconds so DHT can prepare data
	t = micros();
	while(digitalRead(pin) == HIGH)
		if ((micros() - t) > TIMEOUT_VALUE) {return DHTLIB_ERROR_TIMEOUT;}

	// READ OUTPUT - 40 BITS => 5 BYTES or TIMEOUT
	for (int i=0; i<40; i++)
	{
		//pulls down for 50 microseconds
		t = micros();
		while(digitalRead(pin) == LOW)
			if ((micros() - t) > TIMEOUT_VALUE) {return DHTLIB_ERROR_TIMEOUT;}

		t = micros();
		
		//26-28microseconds is "0", 70 millseconds is "1"
		while(digitalRead(pin) == HIGH)
			if ( ( micros() - t) > TIMEOUT_VALUE) {return DHTLIB_ERROR_TIMEOUT;}
		
		if ( ( micros() - t) > 40) bits[idx] |= (1 << cnt);
		if (cnt == 0)   // next byte?
		{
			cnt = 7;    // restart at MSB
			idx++;      // next byte!
		}
		else cnt--;
	}

	// WRITE TO RIGHT VARS
        // as bits[1] and bits[3] are allways zero they are omitted in formulas.
	humidity    = bits[0]; 
	temperature = bits[2]; 

	uint8_t sum = bits[0] + bits[2] + bits[1] + bits[3];  

	if (bits[4] != sum) return DHTLIB_ERROR_CHECKSUM;
	return DHTLIB_OK;
}
//
// END OF FILE
//