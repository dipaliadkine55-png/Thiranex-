javascript
"use strict";

const themeToggle = document.getElementById("theme-toggle");
const root = document.documentElement;

if (themeToggle) {
    let savedTheme = null;

    try {
        savedTheme = localStorage.getItem("dashboard-theme");
    } catch {
        // Continue without persistent theme storage.
    }

    const systemPrefersDark =
        window.matchMedia("(prefers-color-scheme: dark)").matches;

    function applyTheme(theme) {
        root.dataset.theme = theme;

        const isDark = theme === "dark";

        themeToggle.textContent = isDark ? "Light mode" : "Dark mode";
        themeToggle.setAttribute("aria-pressed", String(isDark));
        themeToggle.setAttribute(
            "aria-label",
            isDark ? "Switch to light theme" : "Switch to dark theme"
        );
    }

    applyTheme(
        savedTheme === "dark" || savedTheme === "light"
            ? savedTheme
            : systemPrefersDark
                ? "dark"
                : "light"
    );

    themeToggle.addEventListener("click", () => {
        const nextTheme =
            root.dataset.theme === "dark" ? "light" : "dark";

        applyTheme(nextTheme);

        try {
            localStorage.setItem("dashboard-theme", nextTheme);
        } catch {
            // Theme switching still works without local storage.
        }
    });
}