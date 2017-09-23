 Temperature_Reader
A project that gets information from a temperature-humidity sensor onto a web page

# Purpose:
This is a project I was interested in when I started playing with an Arduino and thought it would be nice to
send data to the webpage

# Setup:
The arduino sketch in the Temperature_Humidity folder has to be compiled and pushed to the Arduino.

The DHT11PIN value can be changed for which ever data pin you are using.

the DHT11 library files have to be installed

Run npm install for the server-client, 
In app.js, modfiy LOCAL_HOST_PORT and the SERIAL_PORT values for your environment.
run: node app.js

![Photo of the web application](https://farm5.staticflickr.com/4400/37255068231_dae98b7b32_b.jpg)
