

var SerialPort = require('serialport');
const path = require('path');

const LOCAL_HOST_PORT = 8000;
const POLLING_TIME = 5000;//A bunch of timeout errors occur if it polls to fast. 5 seconds is good.
const SERIAL_PORT = 'COM4';
const END_OF_MESSAGE_TAG = '\r';

var buffer = "";
var storedTemperature = "999";
var storedHumidity = "99";

//Set up connection to the Arduino
var port = new SerialPort(SERIAL_PORT, {baudRate: 9600}, function(err) {
    if(err != null)
        console.log(err.message);
});

//@brief reads the data from the Arduino and updates the temperature.
port.on('data', function(data) {
    buffer += data.toString();
    if(buffer.includes(END_OF_MESSAGE_TAG))
    {
        //storedData = buffer.substr(0, buffer.length-1);
        if(buffer.toUpperCase().includes("ERROR"))
        {
            storedHumidity = storedTemperature = buffer;
        }
        else
        {
            var values = buffer.substring(0, buffer.length-1).split(',');
            if(values.length == 2)
            {
                storedTemperature = values[0];
                storedHumidity = values[1];
            }
            else
            {
                storedTemperature = storedHumidity = "Data from Arduino is unexpected.";
            }
        }
        buffer = "";
    }
});

//@brief Sends data to the Arduino to indicate that I want data.
setTimeout(function() {
    if(port.isOpen) {
        port.write("t");
        setInterval(function () {
            port.write("t" + END_OF_MESSAGE_TAG);
        }, POLLING_TIME);
    }
}, POLLING_TIME)


//Set up express
var express = require('express')
var app = express();

//Set up getters
app.get('/temperature', function(req, res){
        res.send(storedTemperature);
});

app.get('/humidity', function(req, res){
       res.send(storedHumidity);
});

//Set up directories for html/javascript
app.use(express.static(path.join(__dirname, 'public')));
//Use the css from the node_modules
app.use('/css', express.static(path.join(__dirname, 'node_modules/purecss/build')));

//Start the server.
app.listen(LOCAL_HOST_PORT);