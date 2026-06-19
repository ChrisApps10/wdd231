if (localStorage.getItem("theme") === "dark") {
    document.documentElement.classList.add("dark-mode");
    document.body.classList.add("dark-mode");
} else {
    document.documentElement.classList.remove("dark-mode");
    document.body.classList.remove("dark-mode");
}

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

    const timestampField = document.getElementById("formTimestamp");
    if (timestampField) {
        timestampField.value = new Date().toISOString();
    }

    attachMenuToggleListeners();
    attachThemeToggleListeners();
    attachSidebarModalListeners();
});

function attachMenuToggleListeners() {
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
}

function attachThemeToggleListeners() {
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
}

function attachSidebarModalListeners() {
    const openButtons = document.querySelectorAll(".open-modal-btn");
    openButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const targetId = e.currentTarget.getAttribute("data-target");
            const targetModal = document.getElementById(targetId);
            if (targetModal) {
                targetModal.showModal();
            }
        });
    });

    const closeButtons = document.querySelectorAll(".close-modal-btn");
    closeButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const openDialog = e.currentTarget.closest("dialog");
            if (openDialog) {
                openDialog.close();
            }
        });
    });
}