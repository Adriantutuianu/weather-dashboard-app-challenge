const searchBtn = $("#search-button");
const cityInput = $("#search-input");
const cityForm = $("#search-form");
const APIkey = "d80a5e97b418450696733535d1602cdf";

const BASE_URL_BY_CITY = `https://api.openweathermap.org/geo/1.0/direct`;

// Weather card
function createWeatherCard(data) {
  const card = $("<div>").addClass("card");
  //Card header - city name
  //used if statement to avoid errors in console
  if (data.city && data.city.name) {
    const cardHeader = $("<div>").addClass("card-header").text(data.city.name);
    card.append(cardHeader);
  }
  //card body
  const cardBody = $("<div>").addClass("card-body");
  //card body temperature
  if (data.list && data.list.length > 0 && data.list[0].main) {
    const temperatureKelvin = data.list[0].main.temp;
    const temperatureCelsius = (temperatureKelvin - 273.15).toFixed(2);

    const temperatureParagraph = $("<p>")
      .addClass("card-text")
      .text(`Temperature: ${temperatureCelsius}°C`);

    //card body wind
    const wind = data.list[0].wind.speed;
    const windCity = $("<p>").addClass("card-text").text(`Wind: ${wind} KPH`);

    const humidity = data.list[0].main.humidity;
    const humidityCity = $("<p>")
      .addClass("card-text")
      .text(`Humidity: ${humidity} %`);

    //append to card body
    cardBody.append(temperatureParagraph, windCity, humidityCity);
  }

  card.append(cardBody);

  return card;
}

function getForecastData(lat, lon) {
  const FORECAST_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIkey}`;

  fetch(FORECAST_URL)
    .then(function (resp) {
      return resp.json();
    })
    .then(function (data) {
      console.log(data);

      // Update the weatherContainer with the forecast data
      updateWeather(data);
    });
}

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

      getForecastData(lat, lon);

      //get lan and lon
      console.log("Latitude: ", lat.toFixed(2));
      console.log("Longitude: ", lon.toFixed(2));

      const todayContainer = $("#today");
      todayContainer.empty();

      const card = createWeatherCard(data);
      todayContainer.append(card);
    });
}

cityForm.on("submit", getCityData);

function updateWeather(data) {
  const todayContainer = $("#today");
  todayContainer.empty();

  const card = createWeatherCard(data);
  todayContainer.append(card);
}
