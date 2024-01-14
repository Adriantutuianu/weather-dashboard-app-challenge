const searchBtn = $("#search-button");
const cityInput = $("#search-input");
const cityForm = $("#search-form");
const APIkey = "d80a5e97b418450696733535d1602cdf";

// const cityName = "Sheffield";
const BASE_URL_BY_CITY = `https://api.openweathermap.org/geo/1.0/direct`;
// Using the 5 Day Weather Forecast API, you'll notice that you will need to pass in coordinates instead of just a city name.
// Using the OpenWeatherMap APIs, how could we retrieve geographical coordinates given a city name?
function getCityData(event) {
  event.preventDefault();
  const cityName = cityInput.val();

  const URL_BY_CITY = `${BASE_URL_BY_CITY}?q=${cityName}&appid=${APIkey}`;

  fetch(URL_BY_CITY)
    .then(function (resp) {
      return resp.json();
    })
    .then(function (data) {
      console.log(data);
      const lat = data[0].lat;
      const lon = data[0].lon;

      //get lan and lon
      console.log("Latitude: ", lat.toFixed(2));
      console.log("Longitude: ", lon.toFixed(2));
    });
}

cityForm.on("submit", getCityData);
