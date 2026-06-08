document.addEventListener("DOMContentLoaded", () => {
    const currentPath = window.location.pathname.split("/").pop();
    const navLinks = document.querySelectorAll("#navbar ul li a");

    navLinks.forEach(link => {
        const linkHref = link.getAttribute("href");
        if (currentPath === linkHref || (currentPath === "" && linkHref === "thankyou.html")) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });

    const menuBtn = document.getElementById("menuBtn");
    const navbar = document.getElementById("navbar");
    const menuIcon = document.getElementById("menuIcon");
    const closeIcon = document.getElementById("closeIcon");

    if (menuBtn && navbar) {
        menuBtn.addEventListener("click", () => {
            const isOpened = navbar.classList.toggle("open-menu");
            menuBtn.setAttribute("aria-expanded", isOpened.toString());

            if (isOpened) {
                if (menuIcon) menuIcon.classList.remove("active-toggle-icon");
                if (closeIcon) closeIcon.classList.add("active-toggle-icon");
            } else {
                if (closeIcon) closeIcon.classList.remove("active-toggle-icon");
                if (menuIcon) menuIcon.classList.add("active-toggle-icon");
            }
        });
    }

    const themeToggle = document.getElementById("themeToggle");
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

    const formDataOutput = document.getElementById("formDataOutput");
    if (formDataOutput) {
        const urlParams = new URLSearchParams(window.location.search);
        
        if (urlParams.has("firstName") || urlParams.has("lastName") || urlParams.has("email")) {
            formDataOutput.innerHTML = "";
            
            const fieldMappings = [
                { key: "firstName", label: "First Name" },
                { key: "lastName", label: "Last Name" },
                { key: "email", label: "Email Address" },
                { key: "phone", label: "Mobile Number" },
                { key: "organization", label: "Business Name" },
                { key: "membershipLevel", label: "Membership Level Tier" },
                { key: "orgTitle", label: "Organizational Title" },
                { key: "description", label: "Business Description" },
                { key: "formTimestamp", label: "Application Time Stamp" }
            ];

            fieldMappings.forEach(field => {
                let rawValue = urlParams.get(field.key);
                
                if (rawValue !== null) {
                    let cleanValue = decodeURIComponent(rawValue).replace(/\+/g, " ");
                    
                    if (field.key === "formTimestamp" && cleanValue.trim() !== "") {
                        try {
                            cleanValue = new Date(cleanValue).toLocaleString();
                        } catch (e) {
                            console.error("Timestamp parsing issue", e);
                        }
                    }
                    
                    if (cleanValue.trim() === "") {
                        cleanValue = "Not Provided";
                    }

                    const row = document.createElement("div");
                    row.className = "data-item-row";
                    row.innerHTML = `
                        <span class="data-label">${field.label}</span>
                        <span class="data-value">${cleanValue}</span>
                    `;
                    formDataOutput.appendChild(row);
                }
            });
        } else {
            formDataOutput.innerHTML = `<p class="loading-placeholder">No direct form application parameters were captured in the URL header.</p>`;
        }
    }
});