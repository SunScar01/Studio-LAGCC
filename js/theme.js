// Light/dark theme. Loaded in <head> so the saved theme is applied before the page paints (no flash).
const THEME_KEY = "lagccStudioTheme";

function getSavedTheme() {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch (error) {
    return null;                                  // storage blocked: just use the default
  }
}

function getStartTheme() {
  const saved = getSavedTheme();
  if (saved === "dark" || saved === "light") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const button = document.getElementById("theme-toggle");
  if (button) {
    const isDark = theme === "dark";
    button.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
    button.querySelector(".icon-moon").toggleAttribute("hidden", isDark);   // SVGs need the attribute, not .hidden
    button.querySelector(".icon-sun").toggleAttribute("hidden", !isDark);
  }
}

applyTheme(getStartTheme());                      // runs immediately

document.addEventListener("DOMContentLoaded", function () {
  const button = document.getElementById("theme-toggle");
  applyTheme(getStartTheme());                    // now the button exists, so update its icon and label
  button.addEventListener("click", function () {
    const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch (error) {
      console.error(error);
    }
    applyTheme(next);
  });
});
