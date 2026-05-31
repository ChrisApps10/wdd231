if (localStorage.getItem("theme") === "dark") {
    document.documentElement.classList.add("dark-mode");
}

const openWeatherMapKey = "YOUR_REAL_OPENWEATHERMAP_API_KEY_HERE";
const chamberLat = "34.0522";
const chamberLon = "-118.2437";
const weatherApiUrl = `https://openweathermap.org{chamberLat}&lon=${chamberLon}&units=imperial&appid=${openWeatherMapKey}`;
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
        const response = await fetch(weatherApiUrl);
        if (!response.ok) throw new Error(`Status error: ${response.status}`);
        const weatherData = await response.json();
        renderWeatherComponent(weatherData);
    } catch (error) {
        console.error("Weather trace fault:", error);
        const liveWeatherOutput = document.getElementById("liveWeatherOutput");
        if (liveWeatherOutput) {
            liveWeatherOutput.innerHTML = `<p>Weather data feed is offline.</p>`;
        }
    }
}

function renderWeatherComponent(data) {
    const liveWeatherOutput = document.getElementById("liveWeatherOutput");
    const forecastOutput = document.getElementById("forecastOutput");
    
    if (!data || !data.list || data.list.length === 0) return;
    
    const currentInfo = data.list[0];

    if (liveWeatherOutput) {
        liveWeatherOutput.innerHTML = `
            <div style="font-size: 1.5rem; font-weight: bold; margin-bottom: 0.25rem;">${Math.round(currentInfo.main.temp)}° F</div>
            <div style="text-transform: capitalize; font-weight: 500; margin-bottom: 0.5rem;">${currentInfo.weather[0].description}</div>
            <div>High: ${Math.round(currentInfo.main.temp_max)}°</div>
            <div>Low: ${Math.round(currentInfo.main.temp_min)}°</div>
            <div>Humidity: ${currentInfo.main.humidity}%</div>
        `;
    }

    const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 3);
    let forecastHtml = "";

    dailyData.forEach(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        forecastHtml += `<div style="margin-bottom:0.5rem;">${dayName}: <strong>${Math.round(day.main.temp)}°F</strong></div>`;
    });

    if (forecastOutput) {
        forecastOutput.innerHTML = forecastHtml;
    }
}

async function loadAndFilterMemberSpotlights() {
    try {
        const response = await fetch(membersJsonUrl);
        if (!response.ok) throw new Error(`Status error: ${response.status}`);
        const dataPayload = await response.json();
        
        const premiumMembers = dataPayload.members.filter(m => m.membershipLevel === 2 || m.membershipLevel === 3);
        const shuffled = premiumMembers.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 3);

        renderSpotlightCardsMarkup(selected);
    } catch (error) {
        console.error("Spotlights trace fault:", error);
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
            <div class="card-branding-shield">
                <img src="images/${company.image}" alt="${company.name}" class="logo-fallback-svg">
            </div>
            <div class="card-text-details">
                <h3>${company.name}</h3>
                <p class="tagline-phrase">"${company.tagline || 'Business Tag Line'}"</p>
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