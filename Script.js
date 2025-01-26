
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const weatherData = document.getElementById("weatherData");
const extendedForecast = document.getElementById("extendedForecast");
const locationBtn = document.querySelector("button");  
const recentCitiesDropdown = document.getElementById("recentCitiesDropdown");

const apiKey = "a166a707b16ee3fa31cad0610dec82f0";


loadRecentCities();

searchBtn.addEventListener("click", function () {
    const city = cityInput.value.trim();
    if (city) {
        getWeather(city);
        saveRecentCity(city);  
    } else {
        weatherData.innerHTML = "<p class='text-red-500'>Please enter a city name.</p>";
    }
});

locationBtn.addEventListener("click", function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            getWeatherByCoordinates(latitude, longitude);
        }, function(error) {
            weatherData.innerHTML = "<p class='text-red-500'>Please turn on location.</p>";
        });
    } else {
        weatherData.innerHTML = "<p class='text-red-500'>Error occurred</p>";
    }
});


recentCitiesDropdown.addEventListener("change", function () {
    const selectedCity = recentCitiesDropdown.value;
    if (selectedCity) {
        getWeather(selectedCity);  
    }
});

function getWeather(city) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(weatherUrl)
        .then(response => {
            if (!response.ok) throw new Error("City not found");
            return response.json();
        })
        .then(data => {
            displayWeatherData(data);
            getExtendedForecast(city);
        })
        .catch(error => {
            weatherData.innerHTML = `<p class="text-red-500">Error: ${error.message}</p>`;
        });
}

function getWeatherByCoordinates(lat, lon) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(weatherUrl)
        .then(response => {
            if (!response.ok) throw new Error("Unable to fetch weather data");
            return response.json();
        })
        .then(data => {
            displayWeatherData(data);
            getExtendedForecastByCoordinates(lat, lon);
        })
        .catch(error => {
            weatherData.innerHTML = `<p class="text-red-500">Error: ${error.message}</p>`;
        });
}

function getExtendedForecast(city) {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    fetch(forecastUrl)
        .then(response => {
            if (!response.ok) throw new Error("Unable to fetch forecast");
            return response.json();
        })
        .then(data => {
            displayExtendedForecast(data.list);
        })
        .catch(error => {
            extendedForecast.innerHTML = `<p class="text-red-500">Error: ${error.message}</p>`;
        });
}

function getExtendedForecastByCoordinates(lat, lon) {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(forecastUrl)
        .then(response => {
            if (!response.ok) throw new Error("Unable to fetch forecast");
            return response.json();
        })
        .then(data => {
            displayExtendedForecast(data.list);
        })
        .catch(error => {
            extendedForecast.innerHTML = `<p class="text-red-500">Error: ${error.message}</p>`;
        });
}

function displayWeatherData(data) {
    const weatherHTML = `
        <h2 class="text-2xl">${data.name}, ${data.sys.country}</h2>
        <p class="text-xl">Temperature: ${data.main.temp}°C</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
        <p><img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}"></p>
    `;
    weatherData.innerHTML = weatherHTML;
}

function displayExtendedForecast(forecast) {
    extendedForecast.innerHTML = "";

    for (let i = 0; i < forecast.length; i++) {
        if (i % 8 === 0) {  
            const item = forecast[i];
            const forecastHTML = `
                <div class="bg-blue-800 p-4 rounded-md">
                    <p>${new Date(item.dt * 1000).toLocaleDateString()}</p>
                    <img src="http://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="${item.weather[0].description}">
                    <p>${item.main.temp}°C</p>
                    <p>Humidity: ${item.main.humidity}%</p>
                    <p>Wind Speed: ${item.wind.speed} m/s</p>
                </div>
            `;
            extendedForecast.innerHTML += forecastHTML;
        }
    }
}


function saveRecentCity(city) {
    let recentCities = JSON.parse(localStorage.getItem('recentCities')) || [];
    
    
    if (!recentCities.includes(city)) {
        recentCities.push(city);
        if (recentCities.length > 5) recentCities.shift();  
        localStorage.setItem('recentCities', JSON.stringify(recentCities));
    }

    loadRecentCities();  
}

function loadRecentCities() {
    let recentCities = JSON.parse(localStorage.getItem('recentCities')) || [];
    recentCitiesDropdown.innerHTML = "<option value=''>Recently searched</option>";
        
        recentCities.forEach(city => {
        const option = document.createElement("option");
        option.value = city;
        option.textContent = city;
        recentCitiesDropdown.appendChild(option);
    });

}

