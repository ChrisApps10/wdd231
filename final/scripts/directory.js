if (localStorage.getItem("theme") === "dark") {
    document.documentElement.classList.add("dark-mode");
    document.body.classList.add("dark-mode");
} else {
    document.documentElement.classList.remove("dark-mode");
    document.body.classList.remove("dark-mode");
}

import { getLayoutPreference, saveLayoutPreference } from './storage.js';
import { initializeModal } from './modal.js';

const dataEndpointUrl = "data/games.json";
const directoryDisplay = document.getElementById("directoryDisplay");
const gridBtn = document.getElementById("gridBtn");
const listBtn = document.getElementById("listBtn");
const menuBtn = document.getElementById("menuBtn");
const navbar = document.getElementById("navbar");
const themeToggle = document.getElementById("themeToggle");
const menuIcon = document.getElementById("menuIcon");
const closeIcon = document.getElementById("closeIcon");

let detailsModal = null;
let masterGamesCollection = [];
let activeCategoryFilter = "all";

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

    const savedLayout = getLayoutPreference("catalogLayoutPreference");
    if (savedLayout === "list") {
        directoryDisplay.className = "list-layout-style";
        if (listBtn) listBtn.classList.add("active-view");
        if (gridBtn) gridBtn.classList.remove("active-view");
    } else {
        directoryDisplay.className = "grid-layout-style";
        if (gridBtn) gridBtn.classList.add("active-view");
        if (listBtn) listBtn.classList.remove("active-view");
    }

    detailsModal = initializeModal("itemDetailsModal", "closeModalBtn", "modalContentContainer");
    loadCatalogDirectoryData();
    attachCategoryFilterListeners();
});

function attachCategoryFilterListeners() {
    const filters = {
        "filterAll": "all",
        "filterConsoles": "consoles",
        "filterGames": "games",
        "filterAccessories": "accessories"
    };

    Object.keys(filters).forEach(btnId => {
        const targetBtn = document.getElementById(btnId);
        if (targetBtn) {
            targetBtn.addEventListener("click", (e) => {
                document.querySelectorAll(".filter-buttons .view-btn").forEach(b => b.classList.remove("active-view"));
                e.currentTarget.classList.add("active-view");
                activeCategoryFilter = filters[btnId];
                generateDirectoryLayout(masterGamesCollection);
            });
        }
    });
}

async function loadCatalogDirectoryData() {
    try {
        const networkResponse = await fetch(dataEndpointUrl);
        if (!networkResponse.ok) {
            throw new Error(`Data transport streaming processing error level: ${networkResponse.status}`);
        }
        const parsedPayload = await networkResponse.json();
        masterGamesCollection = parsedPayload.games || [];
        generateDirectoryLayout(masterGamesCollection);
    } catch (processError) {
        console.error("Data collection exceptions trace:", processError);
        directoryDisplay.innerHTML = `<p class="error-msg-box" style="color:#DC2626; font-weight:bold; text-align:center; padding:2rem;">Unable to process directory items.</p>`;
    }
}

function generateDirectoryLayout(gamesCollectionArray) {
    directoryDisplay.innerHTML = ""; 
    
    const filteredCollection = gamesCollectionArray.filter(item => {
        if (activeCategoryFilter === "all") return true;
        return item.category.toLowerCase() === activeCategoryFilter;
    });

    if (filteredCollection.length === 0) {
        directoryDisplay.innerHTML = `<p style="text-align:center; padding:2rem; width:100%; grid-column:span 3;">No matching catalog items found.</p>`;
        return;
    }
    
    filteredCollection.forEach(item => {
        const itemCard = document.createElement("section");
        itemCard.className = "business-card-item";
        
        itemCard.innerHTML = `
            <div class="card-branding-shield">
                <img src="images/${item.image}" alt="${item.title} Stock Visual Asset" loading="lazy" class="logo-fallback-svg">
            </div>
            <div class="card-text-details">
                <h3>${item.title}</h3>
                <p class="tagline-phrase">"${item.category}"</p>
                <hr class="card-divider">
                <p class="info-row-detail">
                    <strong>REGION:</strong> <span>${item.region}</span>
                </p>
                <p class="info-row-detail">
                    <strong>GRADE:</strong> <span>${item.collectibleGrade}</span>
                </p>
                <p class="info-row-detail">
                    <strong>PRICE:</strong> <span>${item.price}</span>
                </p>
                <button class="view-btn inspect-member-trigger" style="margin-top:0.75rem; width:100%; font-size:0.85rem; padding:0.4rem; justify-content:center;" data-item-id="${item.id}">View Details</button>
            </div>
        `;
        directoryDisplay.appendChild(itemCard);
    });

    attachItemModalListeners(filteredCollection);
}

function attachItemModalListeners(games) {
    const triggerButtons = document.querySelectorAll(".inspect-member-trigger");
    triggerButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const itemId = e.currentTarget.getAttribute("data-item-id");
            const matchedItem = games.find(g => g.id === itemId);
            
            if (matchedItem && detailsModal) {
                const modalHtml = `
                    <h2 style="color:var(--primary-color); margin-bottom:0.25rem;">${matchedItem.title}</h2>
                    <p style="font-style:italic; margin:0 0 0.75rem 0; opacity:0.8;">Category: ${matchedItem.category}</p>
                    <div class="modal-image-shield" style="margin:1rem 0;">
                        <img src="images/${matchedItem.image}" alt="${matchedItem.title}" style="width:100%; height:100%; object-fit:contain;">
                    </div>
                    <p style="margin:0.5rem 0;"><strong>Region Profile:</strong> ${matchedItem.region}</p>
                    <p style="margin:0.5rem 0;"><strong>Condition Grade:</strong> ${matchedItem.collectibleGrade}</p>
                    <p style="margin:0.5rem 0;"><strong>Market Valuation:</strong> <span style="color:var(--primary-color); font-weight:bold;">${matchedItem.price}</span></p>
                    <div style="margin-top:0.75rem; padding-top:0.75rem; border-top:1px dashed rgba(0,0,0,0.15);">
                        <p style="margin:0; font-weight:700;">Hardware / Software Specifications:</p>
                        <p style="margin:0.25rem 0; font-size:0.9rem; line-height:1.4;">${matchedItem.hardwareSpecs}</p>
                    </div>
                `;
                detailsModal.open(modalHtml);
            }
        });
    });
}

if (gridBtn) {
    gridBtn.addEventListener("click", () => {
        directoryDisplay.className = "grid-layout-style";
        gridBtn.classList.add("active-view");
        if (listBtn) listBtn.classList.remove("active-view");
        saveLayoutPreference("catalogLayoutPreference", "grid");
    });
}

if (listBtn) {
    listBtn.addEventListener("click", () => {
        directoryDisplay.className = "list-layout-style";
        listBtn.classList.add("active-view");
        if (gridBtn) gridBtn.classList.remove("active-view");
        saveLayoutPreference("catalogLayoutPreference", "list");
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