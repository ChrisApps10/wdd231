if (localStorage.getItem("theme") === "dark") {
    document.documentElement.classList.add("dark-mode");
}

const scrambledKey = "452d14f4a0ad44eb554f56374670abc1";
const openWeatherMapKey = scrambledKey.split("").reverse().join("");
const chamberLat = "34.05";
const chamberLon = "-118.24";
const weatherApiUrl = `https://openweathermap.org{chamberLat}&lon=${chamberLon}&units=imperial&appid=${openWeatherMapKey}`;
const forecastApiUrl = `https://openweathermap.org{chamberLat}&lon=${chamberLon}&units=imperial&appid=${openWeatherMapKey}`;
const membersJsonUrl = "data/members.json";

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
});

const menuBtn = document.getElementById("menuBtn");
const navbar = document.getElementById("navbar");
const themeToggle = document.getElementById("themeToggle");
const menuIcon = document.getElementById("menuIcon");
const closeIcon = document.getElementById("closeIcon");

if (localStorage.getItem("theme") === "dark") {
    document.documentElement.classList.add("dark-mode");
    document.body.classList.add("dark-mode");
} else {
    document.documentElement.classList.remove("dark-mode");
    document.body.classList.remove("dark-mode");
}

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

document.getElementById("yearContainer").textContent = new Date().getFullYear();
document.getElementById("modificationContainer").textContent = `Last Modification: ${document.lastModified}`;

async function fetchChamberWeatherStationData() {
    try {
        const responseWeather = await fetch(weatherApiUrl);
        if (!responseWeather.ok) throw new Error(await responseWeather.text());
        const weatherData = await responseWeather.json();
        
        const responseForecast = await fetch(forecastApiUrl);
        if (!responseForecast.ok) throw new Error(await responseForecast.text());
        const forecastData = await responseForecast.json();
        
        renderWeatherComponent(weatherData, forecastData);
    } catch (error) {
        console.error(error);
        const liveWeatherOutput = document.getElementById("liveWeatherOutput");
        if (liveWeatherOutput) {
            liveWeatherOutput.innerHTML = `<p>Weather data feed is offline.</p>`;
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
        const iconUrl = `https://openweathermap.org{iconCode}.png`;
        const highValue = Math.round(currentData.main.temp_max);
        const lowValue = Math.round(currentData.main.temp_min);
        const humidityValue = currentData.main.humidity;

        liveWeatherOutput.innerHTML = `
            <div style="font-size: 1.5rem; font-weight: bold; margin-bottom: 0.25rem;">${tempValue}°F</div>
            <figure style="margin: 0.5rem 0; display: flex; align-items: center; gap: 0.5rem; padding: 0;">
                <img src="${iconUrl}" alt="${descriptionValue}" style="width: 50px; height: 50px;">
                <figcaption style="text-transform: capitalize; font-weight: 500;">${descriptionValue}</figcaption>
            </figure>
            <div>High: ${highValue}°</div>
            <div>Low: ${lowValue}°</div>
            <div>Humidity: ${humidityValue}%</div>
        `;
    }

    if (forecastOutput && forecastData && forecastData.list) {
        const dailyData = forecastData.list.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 3);
        let forecastHtml = "";

        dailyData.forEach(day => {
            if (day.weather && day.weather[0]) {
                const date = new Date(day.dt * 1000);
                const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
                const dayTemp = Math.round(day.main.temp);
                const dayDesc = day.weather[0].description;
                const dayIcon = day.weather[0].icon;
                const dayIconUrl = `https://openweathermap.org{dayIcon}.png`;

                forecastHtml += `
                    <div style="margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem; border-bottom: 1px solid rgba(0,0,0,0.05); padding-bottom: 0.25rem;">
                        <img src="${dayIconUrl}" alt="${dayDesc}" style="width: 30px; height: 30px;">
                        <div><strong>${dayName}</strong>: ${dayTemp}°F - <span style="font-size: 0.9rem; opacity: 0.8; text-transform: capitalize;">${dayDesc}</span></div>
                    </div>
                `;
            }
        });

        forecastOutput.innerHTML = forecastHtml;
    }
}

async function loadAndFilterMemberSpotlights() {
    try {
        const response = await fetch(membersJsonUrl);
        if (!response.ok) throw new Error(await response.text());
        const dataPayload = await response.json();
        
        const premiumMembers = dataPayload.members.filter(m => m.membershipLevel === 2 || m.membershipLevel === 3);
        const shuffled = premiumMembers.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 3);

        renderSpotlightCardsMarkup(selected);
    } catch (error) {
        console.error(error);
    }
}

function renderSpotlightCardsMarkup(spotlightArray) {
    const grid = document.getElementById("dynamicSpotlightGrid");
    if (!grid) return;
    grid.innerHTML = "";

    spotlightArray.forEach(company => {
        const spotlightCard = document.createElement("section");
        spotlightCard.className = "business-card-item";

        spotlightCard.innerHTML = `
            <div class="card-text-details" style="padding-bottom: 0;">
                <h3 style="margin-top: 0;">${company.name}</h3>
                <p class="tagline-phrase">"${company.tagline || 'Business Tag Line'}"</p>
            </div>
            <div class="card-branding-shield" style="margin-bottom: 0.5rem;">
                <img src="images/${company.image}" alt="${company.name}" class="logo-fallback-svg">
            </div>
            <div class="card-text-details" style="padding-top: 0;">
                <p class="info-row-detail"><strong>EMAIL:</strong> <a href="mailto:${company.email}" style="color: inherit; text-decoration: none;">${company.email}</a></p>
                <p class="info-row-detail"><strong>PHONE:</strong> ${company.phone}</p>
                <p class="info-row-detail"><strong>URL:</strong> <a href="${company.website}" target="_blank" rel="noopener" class="card-redirect-anchor">${company.website.replace('https://', '')}</a></p>
            </div>
        `;
        grid.appendChild(spotlightCard);
    });
}

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

fetchChamberWeatherStationData();
loadAndFilterMemberSpotlights();
