const weatherForm = document.getElementById("weather-form");
const weatherCard = document.getElementById("weather-card");
const weatherInfo = document.querySelectorAll("#weather-card li");
const apiKey = "c7a7d10ff649a1198055af35bcd3efd3";

weatherForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (document.querySelector(".error")) {
    document.querySelector(".error").remove();
  }

  try {
    const [weatherData, country] = await getWeatherData();

    const cityName = weatherData.name;
    const temperatureUnit = getTempUnit();
    const temperature = convertTemperature(
      temperatureUnit,
      weatherData.main.temp
    );
    const humidity = weatherData.main.humidity;
    const weatherDesc = weatherData.weather[0].description;

    weatherInfo.forEach((info) => {
      switch (info.id) {
        case "country":
          info.textContent = country;
          break;
        case "city-name":
          info.textContent = cityName;
          break;
        case "temperature":
          info.textContent = temperature;
          break;
        case "humidity":
          info.textContent = `Humidity: ${humidity}%`;
          break;
        case "weather-desc":
          info.textContent = weatherDesc;
          break;
      }
    });

    weatherCard.style.display = "flex";
  } catch (error) {
    displayError("Please type the city name correctly");
  }
});

async function getWeatherData() {
  const cityLocation = await getCityLocation();
  const cityLat = cityLocation[0];
  const cityLon = cityLocation[1];

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${cityLat}&lon=${cityLon}&appid=${apiKey}`
  );
  const data = await response.json();

  return [data, cityLocation[2]];
}

async function getCityLocation() {
  const cityName = document.getElementById("city-name").value.toLowerCase();

  const response = await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${apiKey}`
  );
  const data = await response.json();

  return [data[0].lat, data[0].lon, data[0].country];
}

function displayError(message) {
  const errorDisplay = document.createElement("p");
  errorDisplay.textContent = message;
  errorDisplay.classList.add("error");
  weatherForm.append(errorDisplay);
}

function getTempUnit() {
  return document.getElementById("fahrenheit").checked
    ? "fahrenheit"
    : "celsius";
}

function convertTemperature(unit, temperature) {
  if (unit === "fahrenheit") {
    return `${((temperature - 273.15) * (9 / 5) + 32).toFixed(1)}°F`;
  } else if (unit === "celsius") {
    return `${(temperature - 273.15).toFixed(1)}°C`;
  }
}
