
const API_KEY = '89fb0b547ac2d44e248799c3b2bd8fbc';
const searchBtn = document.querySelector('.search-btn');
const cityInput = document.querySelector('.city-input');
const currentWeatherCard = document.querySelector('.current-weather-cards');
const forecastCards = document.querySelector('.weather-cards');
const useCurrentLocationBtn = document.querySelector('.use-current-location-btn'); 

// Function to fetch weather data
async function fetchWeatherData(city) {
  try {
    
    const currentWeatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    const currentWeatherData = await currentWeatherResponse.json();

    if (currentWeatherResponse.ok) {
      
      displayCurrentWeather(currentWeatherData);
      
      fetchForecastData(currentWeatherData.coord.lat, currentWeatherData.coord.lon);
    } else {
      alert(currentWeatherData.message); 
    }
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}


async function fetchForecastData(lat, lon) {
  try {
    const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    const forecastData = await forecastResponse.json();

    if (forecastResponse.ok) {
      displayForecast(forecastData);
    }
  } catch (error) {
    console.error('Error fetching forecast data:', error);
  }
}


function displayCurrentWeather(data) {
  const { name, main, wind, weather, dt } = data;
  const date = new Date(dt * 1000).toLocaleDateString();
  
  currentWeatherCard.innerHTML = `
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-semibold">${name} (${date})</h2>
        <p class="text-lg">Temperature: ${main.temp}°C</p>
        <p>Wind: ${wind.speed} M/S</p>
        <p>Humidity: ${main.humidity}%</p>
      </div>
      <div>
        <img src="https://openweathermap.org/img/wn/${weather[0].icon}@4x.png" alt="${weather[0].description}" />
      </div>
    </div>
  `;
}


function displayForecast(data) {
  forecastCards.innerHTML = '';
  const dailyData = {};

  
  data.list.forEach(item => {
    const date = item.dt_txt.split(' ')[0];
    if (!dailyData[date]) {
      dailyData[date] = [];
    }
    dailyData[date].push(item);
  });

  
  const days = Object.keys(dailyData).slice(0, 5);
  days.forEach(date => {
    const dayData = dailyData[date][0]; 
    const { main, wind, weather } = dayData;

    forecastCards.innerHTML += `
      <div class="bg-gray-200 p-4 rounded-lg shadow-sm text-center">
      <p class="text-lg font-semibold">(${date})</p>
      <img src="https://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="${weather[0].icon}" />
        <p>Temp: ${main.temp}°C</p>
        <p>Wind: ${wind.speed} M/S</p>
        <p>Humidity: ${main.humidity}%</p>
      </div>
    `;
  });
}


searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) {
    fetchWeatherData(city);
  } else {
    alert('Please enter a city name.');
  }
});


useCurrentLocationBtn.addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      fetchForecastData(latitude, longitude); 
      fetchWeatherDataByCoordinates(latitude, longitude);
    }, () => {
      alert('Unable to retrieve your location. Please enable location services.');
    });
  } else {
    alert('Geolocation is not supported by this browser.');
  }
});

async function fetchWeatherDataByCoordinates(lat, lon) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    const data = await response.json();

    if (response.ok) {
      displayCurrentWeather(data);
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error('Error fetching weather data by coordinates:', error);
  }
}
