const dataEndpointUrl = "data/members.json";
const directoryDisplay = document.getElementById("directoryDisplay");
const gridBtn = document.getElementById("gridBtn");
const listBtn = document.getElementById("listBtn");
const menuBtn = document.getElementById("menuBtn");
const navbar = document.getElementById("navbar");
const themeToggle = document.getElementById("themeToggle");
const menuIcon = document.getElementById("menuIcon");
const closeIcon = document.getElementById("closeIcon");

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

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});

document.getElementById("yearContainer").textContent = new Date().getFullYear();
document.getElementById("modificationContainer").textContent = `Last Modification: ${document.lastModified}`;

async function loadChamberDirectoryData() {
    try {
        const networkResponse = await fetch(dataEndpointUrl);
        if (!networkResponse.ok) {
            throw new Error(`Data transport streaming processing error level: ${networkResponse.status}`);
        }
        const parsedPayload = await networkResponse.json();
        generateDirectoryLayout(parsedPayload.members);
    } catch (processError) {
        console.error("Data collection exceptions trace:", processError);
        directoryDisplay.innerHTML = `<p class="error-msg-box" style="color:#DC2626; font-weight:bold; text-align:center; padding:2rem;">Unable to process directory items. Please confirm data/members.json is safely positioned inside your project directories.</p>`;
    }
}

function generateDirectoryLayout(memberCollectionArray) {
    directoryDisplay.innerHTML = ""; 
    
    memberCollectionArray.forEach(business => {
        const itemCard = document.createElement("section");
        itemCard.className = "business-card-item";
        
        let membershipTextLabel = "General Member";
        if (business.membershipLevel === 2) membershipTextLabel = "Silver Ally";
        if (business.membershipLevel === 3) membershipTextLabel = "Gold Partner";
        
        itemCard.innerHTML = `
            <div class="card-branding-shield">
                <img src="images/${business.image}" alt="${business.name} Logo Illustration" loading="lazy" class="logo-fallback-svg">
            </div>
            <div class="card-text-details">
                <h3>${business.name}</h3>
                <p class="tagline-phrase">"${business.tagline}"</p>
                <span class="membership-badge tier-status-${business.membershipLevel}">${membershipTextLabel}</span>
                <hr class="card-divider">
                <p class="info-row-detail">
                    <svg class="inline-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span>${business.address}</span>
                </p>
                <p class="info-row-detail">
                    <svg class="inline-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    <span>${business.phone}</span>
                </p>
                <a href="${business.website}" target="_blank" rel="noopener" class="card-redirect-anchor">
                    <svg class="inline-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="2" y1="12" x2="22" y2="12"></line>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    </svg>
                    <span>Visit Website</span>
                </a>
            </div>
        `;
        directoryDisplay.appendChild(itemCard);
    });
}

gridBtn.addEventListener("click", () => {
    directoryDisplay.className = "grid-layout-style";
    gridBtn.classList.add("active-view");
    listBtn.classList.remove("active-view");
});

listBtn.addEventListener("click", () => {
    directoryDisplay.className = "list-layout-style";
    listBtn.classList.add("active-view");
    gridBtn.classList.remove("active-view");
});

loadChamberDirectoryData();