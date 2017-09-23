/**
 * @file temperature_manager.js
 * @author Alexander Poganatz
 * @author a_poganatz@outlook.com
 * @date 2017-09-22
 * @version 1.0
 * @brief This is the controller between the client index.html and server side code.
 * */

//The id's of the h1 tags I want to change.
const TEMPERATURE_TYPE_HEADER_ID_NAME = "temp-type-display";
const TEMPERATURE_ID_NAME = "temp-display";
const HUMIDITY_ID_NAME = "humidity-display";

const CELSIUS = "Celsius";
const FAHRENHEIT = "Fahrenheit";
const KELVIN = "Kelvin";

const UPDATE_TIME_INTERVAL = 30000;

//Global stores values. It is set to an absurd number by default to indicate errors
var temperature = "999";
var humidity = "99";

var currentDisplayFunction = displayCelsius; /**Used by the refreshData function to update the ui to the appropriate format */

/**
 * @fn function setData(t, tag)
 * @brief Sets the temperature type, value, and humidity value
 * @param t [in] The text to set the temperature value
 * @param tag [in] The text to set on the temperature type header
 * @return nothing
 * */
function setData(t, tag)
{
    var element = document.getElementById(TEMPERATURE_ID_NAME);
    element.innerHTML = t;

    element = document.getElementById(TEMPERATURE_TYPE_HEADER_ID_NAME);
    element.innerHTML = tag;

    element = document.getElementById(HUMIDITY_ID_NAME);
    element.innerHTML = humidity + "%";
}

/**
 * @fn function displayCelsius()
 * @brief Updates the humidity text and the temperature text as celsius
 * @return nothing
 * */
function displayCelsius()
{
    setData(temperature, CELSIUS);
}

/**
 * @fn function displayFahrenheit()
 * @brief Updates the humidity text and temperature text as fahrenheit
 * @return nothing
 * */
function displayFahrenheit()
{
    var temp = Number(temperature);
    temp *= 9;
    temp /= 5.0;
    temp += 32;
    setData(temp.toString(), FAHRENHEIT);
}

/**
 * @fn function displayFahrenheit()
 * @brief Updates the humidity text and temperature text as kelvin
 * @return nothing
 * */
function displayKelvin()
{
    var temp = Number(temperature);
    temp += 273.15;
    setData(temp.toString(), KELVIN);
}

/**
 * @fn function setTemp(data)
 * @brief Updates the global temperature value.
 * @param data [in] The temperature value in celsius as a string
 * @return nothing
 * */
function setTemp(data)
{
    temperature = data;
}

/**
 * @fn function setHumidity(data)
 * @brief Updates the global humidity value.
 * @param data [in] The humidity value as a string
 * @return nothing
 * */
function setHumidity(data)
{
    humidity = data;
}

/**
 * @fn function refreshData(url, func)
 * @brief Handles getting a value from the server and uses the passed setter to set it. It also updates the web page.
 * @param url [in] The path to get the data from.
 * @param func [in] the setter for the data
 * @return nothing
 * @note No error handling yet
 * */
function refreshData(url, func)
{
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if(this.readyState == 4 && this.status == 200)
      {
        if(this.responseText.toUpperCase().includes("ERROR"))
        {
          //Handle error message if I want.
        } else
        {
            func(this.responseText);
            currentDisplayFunction();
        }
      }
    }//End onreadystatechange

    xhttp.open('GET', url, true);
    xhttp.send();
}

/**
 * @fn updateAll()
 * @brief Updates the temperature and humidity values and updates the values on the web browser
 * @return nothing
 * */
function updateAll()
{
    refreshData('/temperature', setTemp);
    refreshData('/humidity', setHumidity);
}

/**
 * @fn <anonymous>
 * @brief Updates the web page when it finishes loading and sets an update interval
 * @return nothing
 * */
window.onload = function()
{
    updateAll();
    setInterval(updateAll, UPDATE_TIME_INTERVAL);
};

/**
 * @fn function celciusClick()
 * @brief Handles the celsius button click and updates the UI
 * @return nothing
 * */
function celsiusClick(){
    currentDisplayFunction = displayCelsius;
    currentDisplayFunction();
}

/**
 * @fn function fahrenheitClick()
 * @brief Handles the fahrenheit button click and updates the UI
 * @return nothing
 * */
function fahrenheitClick(){
    currentDisplayFunction = displayFahrenheit;
    currentDisplayFunction();
}

/**
 * @fn function kelvinClick()
 * @brief Handles the celsius button click and updates the UI
 * @return nothing
 * */
function kelvinClick(){
    currentDisplayFunction = displayKelvin;
    currentDisplayFunction();
}