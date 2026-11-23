// Your own profile (demo): name, major and picture are saved in this browser only.
function showMyMessage() {
  document.getElementById("my-profile").hidden = true;
  document.getElementById("my-message").hidden = false;
}

function fallbackMajor(user) {
  return user.major || "Add your major";
}

function renderMe(user) {
  document.title = user.name + " | LAGCC STUDIO";
  document.getElementById("crumb-name").textContent = user.name;
  document.getElementById("my-name").textContent = user.name;

  const major = document.getElementById("my-major");
  major.textContent = fallbackMajor(user);
  major.classList.toggle("is-placeholder", !user.major);

  const image = document.getElementById("my-avatar-img");
  image.hidden = !user.avatar;
  if (user.avatar) image.src = user.avatar;
  document.querySelector("#my-avatar .avatar-icon").hidden = Boolean(user.avatar);

  renderHeaderProfile(user);
}

function showProfileError(message) {
  const error = document.getElementById("my-profile-error");
  error.textContent = message;
  error.hidden = false;
}

// Click the pencil: the text turns into a box. Enter or clicking away saves, Esc cancels.
function setupTextEdit(key, textId, inputId, buttonId, required) {
  const text = document.getElementById(textId);
  const input = document.getElementById(inputId);
  const button = document.getElementById(buttonId);
  let editing = false;

  function open() {
    editing = true;
    input.value = key === "major" ? (getUser().major || "") : getUser()[key];
    text.hidden = true;
    button.hidden = true;
    input.hidden = false;
    input.focus();
    input.select();
  }

  function close(save) {
    if (!editing) return;
    editing = false;
    const value = input.value.trim();
    input.hidden = true;
    text.hidden = false;
    button.hidden = false;
    if (save && !(required && value === "")) {
      const changes = {};
      changes[key] = value;
      const user = updateUser(changes);
      if (user) renderMe(user);
      else showProfileError("Couldn't save. Your browser's storage may be full or blocked.");
    }
    button.focus();
  }

  button.addEventListener("click", open);
  input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") { event.preventDefault(); close(true); }   // preventDefault: otherwise Enter "clicks" the pencil that gets focus next
    if (event.key === "Escape") { event.preventDefault(); close(false); }
  });
  input.addEventListener("blur", function () { close(true); });
}

// Shrink the chosen picture to a small square so it fits in browser storage
function resizeToSquare(file, size) {
  return new Promise(function (resolve, reject) {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = function () {
      const image = new Image();
      image.onerror = reject;
      image.onload = function () {
        const side = Math.min(image.width, image.height);
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        canvas.getContext("2d").drawImage(image, (image.width - side) / 2, (image.height - side) / 2, side, side, 0, 0, size, size);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function setupAvatarEdit() {
  const file = document.getElementById("avatar-file");
  document.getElementById("edit-avatar").addEventListener("click", function () { file.click(); });
  file.addEventListener("change", async function () {
    const chosen = file.files[0];
    if (!chosen) return;
    try {
      const avatar = await resizeToSquare(chosen, 256);
      const user = updateUser({ avatar: avatar });
      if (user) renderMe(user);
      else showProfileError("Couldn't save the picture. Your browser's storage may be full or blocked.");
    } catch (error) {
      console.error(error);
      showProfileError("That file couldn't be used as a picture. Try a JPG or PNG.");
    }
    file.value = "";
  });
}

let allProjects = [];

async function loadAll() {
  try {
    allProjects = await loadProjects();
  } catch (error) {
    console.error(error);                          // the page still works, just with no cards
    allProjects = [];
  }
}

function renderMyProjects(user) {
  const grid = document.getElementById("project-grid");
  const mine = allProjects.filter(function (project) {
    return project.creator.toLowerCase() === user.name.toLowerCase();
  });
  renderProjects(mine, grid);
  document.getElementById("my-count").textContent = mine.length;

  const tile = document.createElement("a");
  tile.className = "new-project-tile";
  tile.href = "submit.html";
  tile.textContent = "+ Start a new project";
  grid.appendChild(tile);
}

function renderSaved() {
  const ids = getBookmarks();
  const saved = ids
    .map(function (id) { return allProjects.find(function (project) { return project.id === id; }); })
    .filter(Boolean)                               // ignore ids that no longer exist
    .reverse();                                    // newest saved first
  renderProjects(saved, document.getElementById("saved-grid"));
  document.getElementById("saved-count").textContent = saved.length;
  document.getElementById("saved-empty").hidden = saved.length > 0;
}

// Tabs: Projects | Saved. Arrow keys move between them.
function selectTab(name) {
  for (const tab of document.querySelectorAll(".profile-tab")) {
    const active = tab.id === "tab-" + name;
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
    document.getElementById(tab.getAttribute("aria-controls")).hidden = !active;
  }
  if (name === "saved") renderSaved();             // refresh, so unsaved ones disappear
  history.replaceState(null, "", name === "saved" ? "#saved" : window.location.pathname);
}

function setupTabs() {
  const tabs = [...document.querySelectorAll(".profile-tab")];
  tabs.forEach(function (tab, index) {
    tab.addEventListener("click", function () { selectTab(tab.id.replace("tab-", "")); });
    tab.addEventListener("keydown", function (event) {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      const next = tabs[(index + (event.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
      next.focus();
      selectTab(next.id.replace("tab-", ""));
    });
  });
}

async function initMe() {
  const user = getUser();
  if (!user) {
    showMyMessage();
    return;
  }
  document.getElementById("my-profile").hidden = false;
  renderMe(user);
  setupTextEdit("name", "my-name", "name-input", "edit-name", true);
  setupTextEdit("major", "my-major", "major-input", "edit-major", false);
  setupAvatarEdit();
  setupTabs();
  await loadAll();
  renderMyProjects(user);
  renderSaved();                                   // fills the Saved count
  if (window.location.hash === "#saved") selectTab("saved");
}

document.getElementById("site-search").addEventListener("keydown", function (event) {
  if (event.key === "Enter" && event.target.value.trim() !== "") {
    window.location.href = "collections.html?q=" + encodeURIComponent(event.target.value.trim());
  }
});

initMe();
