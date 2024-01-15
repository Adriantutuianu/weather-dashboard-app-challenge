const searchBtn = $("#search-button");
const cityInput = $("#search-input");
const cityForm = $("#search-form");
const nowDayJs = dayjs().format("DD/MM/YYYY");

const APIkey = "d80a5e97b418450696733535d1602cdf";

const BASE_URL_BY_CITY = `https://api.openweathermap.org/geo/1.0/direct`;

// Weather card
function createWeatherCard(data) {
  const card = $("<div>").addClass("card");
  //Card header - city name
  //used if statement to avoid errors in console
  if (data.city && data.city.name) {
    const cardHeader = $("<div>")
      .addClass("card-header")
      .text(`${data.city.name} (${nowDayJs})`);
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

  //save to local storage the city searched
  saveToLocalStorage(cityName);

  performSearch(cityName);

  // Clear the search input
  cityInput.val("");
}

function saveToLocalStorage(city) {
  // check if the city name is not empty - don`t want to display an empty <li>
  if (city.trim() !== "") {
    // retrieve existing history from local storage
    let history = JSON.parse(localStorage.getItem("searchHistory")) || [];

    //check if the city is already in the history
    const isAlreadyInHistory = history.includes(city);

    //add the city if it is not in the history
    if (!isAlreadyInHistory) {
      //add new city to the history
      history.unshift(city);

      //limit the history to 7 searched cities
      history = history.slice(0, 7);

      //saved the updated history to local storage
      localStorage.setItem("searchHistory", JSON.stringify(history));

      // display the updated history
      displayHistory();
    }
  }
}
function displayHistory() {
  //get history container from html
  const historyContainer = $("#history");

  //clear previous history
  historyContainer.empty();

  // retrieve the history from local storage
  const history = JSON.parse(localStorage.getItem("searchHistory")) || [];

  //display each city in a new list item
  history.forEach(function (city) {
    //capitalize first letter of the city => history display
    const capitalizedCity = city.charAt(0).toUpperCase() + city.slice(1);

    const historyItem = $("<li>")
      .addClass("list-group-item list-group-item-action custom-hover-style ")
      .text(capitalizedCity);

    //attach a click event listener to each history item
    historyItem.on("click", function () {
      // perform a new search for the clicked city
      performSearch(city);
    });

    //appent the list item to the history container
    historyContainer.append(historyItem);
  });
}

function performSearch(searchTerm) {
  const URL_BY_CITY = `${BASE_URL_BY_CITY}?q=${searchTerm}&appid=${APIkey}`;

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

//function update weather card
function updateWeather(data) {
  const todayContainer = $("#today");
  todayContainer.empty();

  const card = createWeatherCard(data);
  todayContainer.append(card);
}

//call function to display history
displayHistory();
