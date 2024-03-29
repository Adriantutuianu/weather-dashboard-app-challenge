const searchBtn = $("#search-button");
const cityInput = $("#search-input");
const cityForm = $("#search-form");
const nowDayJs = dayjs().format("DD/MM/YYYY");

const APIkey = "d80a5e97b418450696733535d1602cdf";

const BASE_URL_BY_CITY = `https://api.openweathermap.org/geo/1.0/direct`;

// Weather card
function createWeatherCard(data, isForecast = false) {
  const card = $("<div>").addClass("card");
  //used if statement to avoid errors in console
  if (data.city && data.city.name) {
    let date;

    //update date for #forecast
    if (isForecast) {
      date = calculateForecastDate(data.list[0].dt_txt);
    } else {
      date = nowDayJs;
    }
    //Card header - city name
    const cardHeader = $("<div>")
      .addClass("card-header")
      .text(`${data.city.name} ${date}`);

    // add weather icon
    if (data.list && data.list.length > 0 && data.list[0].weather) {
      const weatherIconCode = data.list[0].weather[0].icon;
      const weatherIconUrl = `https://openweathermap.org/img/w/${weatherIconCode}.png`;
      const weatherIcon = $("<img>")
        .attr("src", weatherIconUrl)
        .attr("alt", "Weather Icon")
        .addClass("weather-icon");
      cardHeader.append(weatherIcon);
    }

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
    //card body humidity
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

// Function to calculate forecast date
function calculateForecastDate(dateTime) {
  // dateTime is in the format "yyyy-mm-dd hh:mm:ss"
  const dateParts = dateTime.split(" ");
  const date = dateParts[0];
  const formattedDate = dayjs(date).format("DD/MM/YYYY");
  return formattedDate;
}

function getForecastData(lat, lon) {
  const FORECAST_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIkey}`;

  fetch(FORECAST_URL)
    .then(function (resp) {
      return resp.json();
    })
    .then(function (data) {
      // Update the weatherContainer with the forecast data
      updateWeather(data);

      forecastWeather(data);
    });
}

function getCityData(event) {
  event.preventDefault();
  const cityName = cityInput.val();

  //save to local storage the city searched
  saveToLocalStorage(cityName);

  performSearch(cityName);

  // clear the search input
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
    //add class + text
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
      // get lan and lon
      const lat = data[0].lat;
      const lon = data[0].lon;

      getForecastData(lat, lon);

      updateWeather(data);
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

//function forecast weather card
function forecastWeather(data) {
  const forecastContainer = $("#forecast");
  forecastContainer.empty();

  // Display the forecast heading
  const forecastHeading = $("<h4>").text("5 Days Forecast:");
  forecastContainer.append(forecastHeading);

  // check if data.list is defined and has a length
  if (data.list && data.list.length > 0) {
    // iterate over the forecast data for the next 5 days
    for (let i = 1; i < data.list.length; i += 8) {
      // Create a column for each forecast card
      const forecastCardContainer = $("<div>")
        .addClass("col mb-3  mt-1")
        .append(
          createWeatherCard(
            {
              city: data.city,
              list: [data.list[i]], // Use data for every 8th element (next 24 hours)
            },
            true //isforecast
          )
        );
      forecastCardContainer.find(".card-body").addClass("text-white bg-dark");

      forecastContainer.append(forecastCardContainer);
    }
  }
}
