// Submit a project: 4 steps (Information, Upload, Preview, Submit).
// Demo only: nothing is uploaded, saved or sent. Needs auth.js, bookmarks.js and cards.js.
(function () {
  const $ = function (id) { return document.getElementById(id); };
  const form = $("submit-form");
  const MAX_IMAGE = 5 * 1024 * 1024;
  const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];
  let step = 1;
  let thumbUrl = "";

  // only signed-in students can submit; everyone else sees a log in / sign up message
  const user = getUser();
  if (!user) {
    $("submit-flow").hidden = true;
    $("submit-gate").hidden = false;
    return;
  }
  if (user.name) $("f-name").value = user.name;

  function setError(id, message) {
    const input = $("f-" + id);
    $("e-" + id).textContent = message;
    input.setAttribute("aria-invalid", message ? "true" : "false");
    return !message;
  }

  function validateStep(n) {
    let ok = true;
    let first = null;
    function check(id, message) {
      const good = setError(id, message);
      if (!good && !first) first = $("f-" + id);
      ok = ok && good;
    }
    if (n === 1) {
      check("title", $("f-title").value.trim() ? "" : "Enter a project title.");
      check("name", $("f-name").value.trim() ? "" : "Enter your name.");
      check("major", $("f-major").value.trim() ? "" : "Enter your major or program.");
      check("category", $("f-category").value ? "" : "Choose a category.");
      const len = $("f-desc").value.trim().length;
      check("desc", len >= 20 ? "" : "Write at least 20 characters about your project.");
    }
    if (n === 2) {
      const file = $("f-thumb").files[0];
      let message = "";
      if (!file) message = "Choose a thumbnail image.";
      else if (IMAGE_TYPES.indexOf(file.type) === -1) message = "Use a PNG, JPG or WebP image.";
      else if (file.size > MAX_IMAGE) message = "That image is over 5 MB. Choose a smaller one.";
      check("thumb", message);
      const link = $("f-link").value.trim();
      let linkMessage = "";
      if (link) {
        try {
          const u = new URL(link);
          if (u.protocol !== "https:" && u.protocol !== "http:") linkMessage = "Start the link with https://";
        } catch (error) {
          linkMessage = "Enter a full link, like https://example.com";
        }
      }
      check("link", linkMessage);
    }
    if (first) first.focus();
    return ok;
  }

  function addRow(list, label, value) {
    const wrap = document.createElement("div");
    const dt = document.createElement("dt");
    const dd = document.createElement("dd");
    dt.textContent = label;
    dd.textContent = value;                          // textContent only: this is user text
    wrap.appendChild(dt);
    wrap.appendChild(dd);
    list.appendChild(wrap);
  }

  function buildPreview() {
    const project = {
      id: "preview",
      title: $("f-title").value.trim(),
      creator: $("f-name").value.trim(),
      major: $("f-major").value.trim(),
      category: $("f-category").value,
      thumbnail: thumbUrl,
      likes: 0,
      comments: [],
      recommended: false
    };
    renderProjects([project], $("preview-grid"));
    const list = $("preview-list");
    list.textContent = "";
    addRow(list, "Description", $("f-desc").value.trim());
    addRow(list, "Project link", $("f-link").value.trim() || "None");
  }

  function show(n) {
    step = n;
    for (let i = 1; i <= 4; i++) $("panel-" + i).hidden = i !== n;
    document.querySelectorAll(".stepper__item").forEach(function (item) {
      const num = Number(item.dataset.step);
      const button = item.querySelector("button");
      item.classList.toggle("is-current", num === n);
      item.classList.toggle("is-done", num < n);
      if (num === n) button.setAttribute("aria-current", "step"); else button.removeAttribute("aria-current");
      if (num !== 4) button.disabled = n === 4 || num > n;   // go back to finished steps only
    });
    $("btn-back").hidden = n === 1 || n === 4;
    $("form-actions").hidden = n === 4;
    $("btn-next").textContent = n === 3 ? "Submit Project" : "Next";
    $("btn-next").classList.toggle("submit-button--final", n === 3);
    if (n === 3) buildPreview();
    if (n === 4) {
      $("done-name").textContent = $("f-name").value.trim();
      $("done-title").textContent = $("f-title").value.trim();
    }
    const heading = $("legend-" + n);
    heading.focus();
    $("step-status").textContent = "Step " + n + " of 4";
    window.scrollTo({ top: 0 });
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (step === 3) { show(4); return; }
    if (!validateStep(step)) return;
    show(step + 1);
  });

  $("btn-back").addEventListener("click", function () { show(step - 1); });

  document.querySelectorAll(".stepper__button").forEach(function (button) {
    button.addEventListener("click", function () {
      const target = Number(button.parentElement.dataset.step);
      if (target < step) show(target);               // earlier steps only; Next checks the rest
    });
  });

  $("f-desc").addEventListener("input", function () { $("desc-count").textContent = $("f-desc").value.length; });

  $("f-thumb").addEventListener("change", function () {
    const file = $("f-thumb").files[0];
    const preview = $("thumb-preview");
    if (thumbUrl) { URL.revokeObjectURL(thumbUrl); thumbUrl = ""; }
    preview.hidden = true;
    if (!file) return;
    if (IMAGE_TYPES.indexOf(file.type) === -1 || file.size > MAX_IMAGE) { validateStep(2); return; }
    thumbUrl = URL.createObjectURL(file);
    preview.src = thumbUrl;
    preview.hidden = false;
    setError("thumb", "");
  });

  // clear an error as soon as the field is fixed
  ["title", "name", "major", "category", "desc", "link"].forEach(function (id) {
    $("f-" + id).addEventListener("input", function () { if ($("e-" + id).textContent) setError(id, ""); });
  });
  $("f-category").addEventListener("change", function () { setError("category", ""); });

  $("submit-another").addEventListener("click", function () {
    form.reset();
    if (user && user.name) $("f-name").value = user.name;
    $("desc-count").textContent = "0";
    if (thumbUrl) { URL.revokeObjectURL(thumbUrl); thumbUrl = ""; }
    $("thumb-preview").hidden = true;
    show(1);
  });

  show(1);
  $("step-status").textContent = "";
  window.scrollTo({ top: 0 });
})();
