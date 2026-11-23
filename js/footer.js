// Footer newsletter box. Demo only: nothing is sent or saved yet.
(function () {
  const form = document.getElementById("news-form");
  if (!form) return;
  const email = document.getElementById("news-email");
  const status = document.getElementById("news-status");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    email.setAttribute("aria-invalid", String(!ok));
    status.classList.toggle("is-error", !ok);
    status.textContent = ok
      ? "Thanks! Sign-up is not live yet, so your email was not saved."
      : "Enter a valid email address, like name@example.com.";
    if (ok) email.value = "";
  });
})();
