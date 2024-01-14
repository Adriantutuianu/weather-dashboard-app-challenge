const APIkey = "d80a5e97b418450696733535d1602cdf";

const cityName = "Sheffield";
// const BASE_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIkey}`;
const BASE_URL_BY_CITY = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${APIkey}`;
// Using the 5 Day Weather Forecast API, you'll notice that you will need to pass in coordinates instead of just a city name.
// Using the OpenWeatherMap APIs, how could we retrieve geographical coordinates given a city name?

fetch(BASE_URL_BY_CITY)
  .then(function (resp) {
    return resp.json();
  })
  .then(function (data) {
    console.log(data);

    //get lan and lon
    const lat = data[0].lat;
    console.log("Latitude: ", lat.toFixed(2));
    const lon = data[0].lon;
    console.log("Longitude: ", lon.toFixed(2));

    //Event handler to extract data from input search
    $(".input-group").submit(function (e) {
      e.preventDefault();
      //get the value from the input field
      const cityName = $("#search-input").val();
      console.log("Extracted City Name:", cityName);
    });
  });
