// Demo login for the browser only. No server, and passwords are never saved or sent anywhere.
const USER_KEY = "lagccStudioUser";

function getUser() {
  try {
    const text = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    return text ? JSON.parse(text) : null;
  } catch (error) {
    return null;
  }
}

function saveUser(email, remember) {
  const user = { email: email, name: email.split("@")[0] };
  const store = remember ? localStorage : sessionStorage;   // "remember me" = keep after the tab closes
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(USER_KEY);
  store.setItem(USER_KEY, JSON.stringify(user));
}

function clearUser() {
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(USER_KEY);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(id, message) {
  const input = document.getElementById(id);
  const error = document.getElementById(id + "-error");
  error.textContent = message;
  error.hidden = false;
  input.setAttribute("aria-invalid", "true");
}

function clearErrors(form) {
  for (const error of form.querySelectorAll(".auth-error")) error.hidden = true;
  for (const input of form.querySelectorAll("input")) input.removeAttribute("aria-invalid");
}

function setupShowButtons() {
  for (const button of document.querySelectorAll("[data-show-for]")) {
    button.addEventListener("click", function () {
      const input = document.getElementById(button.dataset.showFor);
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      button.textContent = show ? "Hide" : "Show";
      button.setAttribute("aria-label", (show ? "Hide " : "Show ") + input.placeholder.toLowerCase());
    });
  }
}

function setupLogin(form) {
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    clearErrors(form);
    const email = form.email.value.trim();
    let ok = true;
    if (!isValidEmail(email)) { showError("email", "Enter a valid email address."); ok = false; }
    if (form.password.value === "") { showError("password", "Enter your password."); ok = false; }
    if (!ok) return;
    saveUser(email, form.remember.checked);
    window.location.href = "index.html";
  });
}

function setupSignup(form) {
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    clearErrors(form);
    const email = form.email.value.trim();
    let ok = true;
    if (!isValidEmail(email)) { showError("email", "Enter a valid email address."); ok = false; }
    if (form.password.value.length < 8) { showError("password", "Use at least 8 characters."); ok = false; }
    if (form.confirm.value !== form.password.value) { showError("confirm", "Passwords do not match."); ok = false; }
    if (!ok) return;
    saveUser(email, form.remember.checked);
    window.location.href = "index.html";
  });
}

// On every page: the header link says Log In, or Log Out when someone is signed in
function setupHeaderLink() {
  const link = document.getElementById("auth-link");
  if (!link) return;
  const user = getUser();
  if (user) {
    link.textContent = "Log Out";
    link.title = "Signed in as " + user.email;
    link.addEventListener("click", function (event) {
      event.preventDefault();
      clearUser();
      window.location.reload();
    });
  }
}

setupShowButtons();
setupHeaderLink();
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
if (loginForm) setupLogin(loginForm);
if (signupForm) setupSignup(signupForm);
