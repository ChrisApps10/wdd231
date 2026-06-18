const openWeatherMapKey = "452d14f4a0ad44eb554f56374670abc1";

const storeLat = "35.7023";
const storeLon = "139.7745";

const gamesJsonUrl = "data/games.json";

document.addEventListener("DOMContentLoaded", () => {
    const currentPath = window.location.pathname.split("/").pop();
    const navLinks = document.querySelectorAll("#navbar ul li a");

    navLinks.forEach(link => {
        const linkHref = link.getAttribute("href");

        if (currentPath === linkHref || (currentPath === "" && linkHref === "index.html")) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });

    fetchChamberWeatherStationData(storeLat, storeLon);
});

const menuBtn = document.getElementById("menuBtn");
const navbar = document.getElementById("navbar");
const themeToggle = document.getElementById("themeToggle");
const menuIcon = document.getElementById("menuIcon");
const closeIcon = document.getElementById("closeIcon");

if (localStorage.getItem("theme") === "dark") {
    document.documentElement.classList.add("dark-mode");
    document.body.classList.add("dark-mode");
}

if (menuBtn) {
    menuBtn.addEventListener("click", () => {
        const isOpened = navbar.classList.toggle("open-menu");
        menuBtn.setAttribute("aria-expanded", isOpened.toString());

        if (isOpened) {
            menuIcon.classList.remove("active-toggle-icon");
            closeIcon.classList.add("active-toggle-icon");
        } else {
            closeIcon.classList.remove("active-toggle-icon");
            menuIcon.classList.add("active-toggle-icon");
        }
    });
}

if (themeToggle) {
    themeToggle.addEventListener("click", () => {

        if (document.documentElement.classList.contains("dark-mode")) {

            document.documentElement.classList.remove("dark-mode");
            document.body.classList.remove("dark-mode");

            localStorage.setItem("theme", "light");

        } else {

            document.documentElement.classList.add("dark-mode");
            document.body.classList.add("dark-mode");

            localStorage.setItem("theme", "dark");
        }
    });
}

const yearContainer = document.getElementById("yearContainer");
if (yearContainer) {
    yearContainer.textContent = new Date().getFullYear();
}

const modificationContainer = document.getElementById("modificationContainer");
if (modificationContainer) {
    modificationContainer.textContent = `Last Modification: ${document.lastModified}`;
}

async function fetchChamberWeatherStationData(lat, lon) {
    const weatherApiUrl = 
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${openWeatherMapKey}`;

    const forecastApiUrl = 
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${openWeatherMapKey}`;

    try {
        const responseWeather = await fetch(weatherApiUrl);
        if (!responseWeather.ok) {
            throw new Error(`HTTP error! status: ${responseWeather.status}`);
        }
        const weatherData = await responseWeather.json();

        const responseForecast = await fetch(forecastApiUrl);
        if (!responseForecast.ok) {
            throw new Error(`HTTP error! status: ${responseForecast.status}`);
        }
        const forecastData = await responseForecast.json();

        renderWeatherComponent(weatherData, forecastData);

    } catch (error) {
        console.error("Fetch failed:", error);
        const liveWeatherOutput = document.getElementById("liveWeatherOutput");
        const forecastOutput = document.getElementById("forecastOutput");

        if (liveWeatherOutput) {
            liveWeatherOutput.innerHTML = `<p>Weather data feed is offline.</p>`;
        }
        if (forecastOutput) {
            forecastOutput.innerHTML = "";
        }
    }
}

function renderWeatherComponent(currentData, forecastData) {
    const liveWeatherOutput = document.getElementById("liveWeatherOutput");
    const forecastOutput = document.getElementById("forecastOutput");

    if (liveWeatherOutput && currentData && currentData.main && currentData.weather && currentData.weather[0]) {
        const tempValue = Math.round(currentData.main.temp);
        const descriptionValue = currentData.weather[0].description;
        const iconCode = currentData.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        const highValue = Math.round(currentData.main.temp_max);
        const lowValue = Math.round(currentData.main.temp_min);
        const humidityValue = currentData.main.humidity;

        liveWeatherOutput.innerHTML = `
            <div style="display:flex;align-items:center;gap:1rem;">
                <img src="${iconUrl}" alt="${descriptionValue}" style="width:70px;height:70px;">
                <div>
                    <div style="font-size:1.5rem;font-weight:bold;">${tempValue}°F</div>
                    <div style="text-transform:capitalize;">${descriptionValue}</div>
                </div>
            </div>
            <div>High: ${highValue}°</div>
            <div>Low: ${lowValue}°</div>
            <div>Humidity: ${humidityValue}%</div>
        `;
    }

    if (forecastOutput && forecastData && forecastData.list) {
        const dailyData = forecastData.list
            .filter(item => item.dt_txt.includes("12:00:00"))
            .slice(0, 3);

        let forecastHtml = "";
        dailyData.forEach((day, index) => {
            const date = new Date(day.dt * 1000);
            const label = index === 0 ? "Today" : date.toLocaleDateString("en-US", { weekday: "long" });

            forecastHtml += `
                <div style="margin-bottom:0.5rem;">
                    ${label}: <strong>${Math.round(day.main.temp)}°F</strong>
                </div>
            `;
        });
        forecastOutput.innerHTML = forecastHtml;
    }
}

async function loadCuratedShowroomSpotlights() {
    try {
        const response = await fetch(gamesJsonUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const dataPayload = await response.json();
        const catalogItems = dataPayload.games || [];

        if (!catalogItems.length) {
            return;
        }

        const shuffled = catalogItems.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 3);

        renderShowroomSpotlights(selected);

    } catch (error) {
        console.error("Fetch operation failed:", error);
    }
}

function renderShowroomSpotlights(spotlightArray) {
    const grid = document.getElementById("dynamicSpotlightGrid");
    if (!grid) return;
    grid.innerHTML = "";

    spotlightArray.forEach(item => {
        const cardElement = document.createElement("section");
        cardElement.className = "business-card-item";

        cardElement.innerHTML = `
            <div class="card-text-details">
                <h3>${item.title}</h3>
                <p class="tagline-phrase">${item.category}</p>
            </div>
            <div class="card-branding-shield">
                <img src="images/${item.image}" alt="${item.title}" class="logo-fallback-svg" loading="lazy">
            </div>
            <div class="card-text-details">
                <p class="info-row-detail"><strong>REGION:</strong> ${item.region}</p>
                <p class="info-row-detail"><strong>GRADE:</strong> ${item.collectibleGrade}</p>
                <p class="info-row-detail"><strong>PRICE:</strong> ${item.price}</p>
                <p class="info-row-detail"><strong>SPECS:</strong> ${item.hardwareSpecs}</p>
            </div>
        `;
        grid.appendChild(cardElement);
    });
}

loadCuratedShowroomSpotlights();