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

    const targetOutput = document.getElementById("formDataOutputTarget");
    if (targetOutput) {
        const urlParams = new URLSearchParams(window.location.search);
        let tableRowsHtml = "";

        const readableLabels = {
            "firstName": "First Name",
            "lastName": "Last Name",
            "orgTitle": "Title / Role",
            "email": "Email Address",
            "phone": "Phone Number",
            "organization": "Business Name",
            "membershipLevel": "Membership Tier",
            "description": "Business Profile Description",
            "formTimestamp": "Submission Date & Time"
        };

        urlParams.forEach((value, key) => {
            const fieldLabel = readableLabels[key] || key;
            let displayValue = value;

            if (key === "formTimestamp" && value) {
                try {
                    displayValue = new Date(value).toLocaleString();
                } catch (e) {
                    displayValue = value;
                }
            }

            tableRowsHtml += `
                <tr>
                    <td style="font-weight: bold; padding: 0.75rem; border: 1px solid var(--border-color);">${fieldLabel}</td>
                    <td style="padding: 0.75rem; border: 1px solid var(--border-color); word-break: break-word;">${displayValue || "<em>Not Provided</em>"}</td>
                </tr>
            `;
        });

        if (tableRowsHtml === "") {
            targetOutput.innerHTML = `
                <tr>
                    <td colspan="2" style="text-align: center; padding: 2rem; font-style: italic; color: var(--text-muted);">
                        No application form data query string parameters detected.
                    </td>
                </tr>
            `;
        } else {
            targetOutput.innerHTML = tableRowsHtml;
        }
    }

    attachHeaderMenuListeners();
    attachHeaderThemeListeners();
});

function attachHeaderMenuListeners() {
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

function attachHeaderThemeListeners() {
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