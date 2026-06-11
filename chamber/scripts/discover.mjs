document.addEventListener("DOMContentLoaded", () => {

    if (localStorage.getItem("theme") === "dark") {
        document.documentElement.classList.add("dark-mode");
        document.body.classList.add("dark-mode");
    }

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

    const menuBtn = document.getElementById("menuBtn");
    const navbar = document.getElementById("navbar");
    const menuIcon = document.getElementById("menuIcon");
    const closeIcon = document.getElementById("closeIcon");

    if (menuBtn && navbar) {
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

    const themeToggle = document.getElementById("themeToggle");
    
    if (localStorage.getItem("theme") === "dark") {
        document.documentElement.classList.add("dark-mode");
        document.body.classList.add("dark-mode");
    } else {
        document.documentElement.classList.remove("dark-mode");
        document.body.classList.remove("dark-mode");
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
    const modificationContainer = document.getElementById("modificationContainer");

    if (yearContainer) {
        yearContainer.textContent = new Date().getFullYear();
    }
    if (modificationContainer) {
        modificationContainer.textContent = `Last Modification: ${document.lastModified}`;
    }

    const visitorMessageOutput = document.getElementById("visitorMessageOutput");
    if (visitorMessageOutput) {
        const lastVisit = localStorage.getItem("lastVisitTimestamp");
        const currentTimestamp = Date.now();
        localStorage.setItem("lastVisitTimestamp", currentTimestamp.toString());

        if (!lastVisit) {
            visitorMessageOutput.innerHTML = `<p>Welcome! Let us know if you have any questions.</p>`;
        } else {
            const timeDifference = currentTimestamp - parseInt(lastVisit, 10);
            const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

            if (daysDifference < 1) {
                visitorMessageOutput.innerHTML = `<p>Back so soon! Awesome!</p>`;
            } else {
                const dayText = daysDifference === 1 ? "day" : "days";
                visitorMessageOutput.innerHTML = `<p>You last visited ${daysDifference} ${dayText} ago.</p>`;
            }
        }
    }
});