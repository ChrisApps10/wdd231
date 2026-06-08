document.addEventListener("DOMContentLoaded", () => {
    
    const currentPath = window.location.pathname.split("/").pop();
    const navLinks = document.querySelectorAll("#navbar ul li a");

    navLinks.forEach(link => {
        const linkHref = link.getAttribute("href");
        if (currentPath === linkHref || (currentPath === "" && linkHref === "join.html")) {
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
    const timestampField = document.getElementById("formTimestamp");
    if (timestampField) {
        timestampField.value = new Date().toISOString();
    }

    const openButtons = document.querySelectorAll(".open-modal-btn");
    openButtons.forEach(button => {
        button.addEventListener("click", () => {
            const targetId = button.getAttribute("data-target");
            const modal = document.getElementById(targetId);
            if (modal) {
                modal.showModal();
            }
        });
    });

    const closeButtons = document.querySelectorAll(".close-modal-btn");
    closeButtons.forEach(button => {
        button.addEventListener("click", () => {
            const modal = button.closest("dialog");
            if (modal) {
                modal.close();
            }
        });
    });

    const modals = document.querySelectorAll(".benefit-modal-box");
    modals.forEach(modal => {
        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                modal.close();
            }
        });
    });
});