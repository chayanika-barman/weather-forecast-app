const apiKey = "8d0e941ad009231328ffa937d0a28af7";


// Function to fetch current weather data by city name
async function getWeather(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    const data = await response.json();

    if (data.cod === 200) {
      displayCurrentWeather(data);
      saveCity(city);
      updateCityDropdown();
    } else {
      alert('City not found. Please try again.');
    }
  } catch (error) {
    alert('Error fetching weather data.');
  }
}

// Function to fetch weather forecast data by city name
async function getForecast(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    );
    const data = await response.json();

    if (data.cod === '200') {
      displayForecast(data);
    } else {
      alert('Forecast not found. Please try again.');
    }
  } catch (error) {
    alert('Error fetching forecast data.');
  }
}

// Function to handle search button click
function searchWeather() {
  const city = document.getElementById('cityInput').value.trim();
  if (city === '') {
    alert('Please enter a city name.');
    return;
  }
  getWeather(city);
  getForecast(city);
}

// Function to get weather for current location
function getCurrentLocationWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
        );
        const data = await response.json();
        displayCurrentWeather(data);
        getForecastByCoords(latitude, longitude);
      } catch (error) {
        alert('Error fetching weather data.');
      }
    });
  } else {
    alert('Geolocation is not supported by this browser.');
  }
}

// Function to fetch forecast by coordinates
async function getForecastByCoords(lat, lon) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );
    const data = await response.json();
    displayForecast(data);
  } catch (error) {
    alert('Error fetching forecast data.');
  }
}

// Function to display current weather data
function displayCurrentWeather(data) {
  const weatherDiv = document.getElementById('currentWeather');
  weatherDiv.innerHTML = `
    <h2 class="text-2xl font-bold mb-2">${data.name}</h2>
    <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Weather Icon" class="mx-auto">
    <p class="text-xl">${data.weather[0].description}</p>
    <p class="text-xl">Temperature: ${data.main.temp} °C</p>
    <p class="text-xl">Humidity: ${data.main.humidity}%</p>
    <p class="text-xl">Wind Speed: ${data.wind.speed} m/s</p>
  `;
}

// Function to display weather forecast data
function displayForecast(data) {
  const forecastDiv = document.getElementById('forecast');
  forecastDiv.innerHTML = ''; // Clear previous forecast

  // Get forecast for the next 5 days at noon
  const forecastList = data.list.filter((item) => item.dt_txt.includes('12:00:00'));

  forecastList.forEach((item) => {
    const date = new Date(item.dt_txt).toLocaleDateString();
    forecastDiv.innerHTML += `
      <div class="bg-white p-4 rounded shadow text-center">
        <h3 class="font-bold mb-2">${date}</h3>
        <img src="http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="Weather Icon" class="mx-auto">
        <p>${item.weather[0].description}</p>
        <p>Temp: ${item.main.temp} °C</p>
        <p>Humidity: ${item.main.humidity}%</p>
        <p>Wind: ${item.wind.speed} m/s</p>
      </div>
    `;
  });
}

// Function to save searched city to localStorage
function saveCity(city) {
  let cities = JSON.parse(localStorage.getItem('cities')) || [];
  if (!cities.includes(city)) {
    cities.push(city);
    localStorage.setItem('cities', JSON.stringify(cities));
  }
}

// Function to update the city dropdown with recently searched cities
function updateCityDropdown() {
  const cityDropdown = document.getElementById('cityDropdown');
  cityDropdown.innerHTML = '<option value="">Select Recent City</option>'; // Reset dropdown

  const cities = JSON.parse(localStorage.getItem('cities')) || [];
  cities.forEach((city) => {
    const option = document.createElement('option');
    option.value = city;
    option.textContent = city;
    cityDropdown.appendChild(option);
  });
}

// Function to handle city selection from dropdown
function selectCity(city) {
  if (city !== '') {
    getWeather(city);
    getForecast(city);
  }
}

// Event listener for Enter key in the city input field
document.getElementById('cityInput').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    searchWeather();
  }
});

// Update the city dropdown on page load
window.onload = updateCityDropdown;
