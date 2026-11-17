function showMessage(title, text, canRetry) {
  document.getElementById("gallery-message-title").textContent = title;
  document.getElementById("gallery-message-text").textContent = text;
  document.getElementById("gallery-retry").hidden = !canRetry;
  document.getElementById("hero").hidden = true;        // the message replaces the whole page
  document.getElementById("projects").hidden = true;
  document.getElementById("gallery-message").hidden = false;
}

function hideMessage() {
  document.getElementById("gallery-message").hidden = true;
  document.getElementById("hero").hidden = false;
  document.getElementById("projects").hidden = false;
}

let allProjects = [];
let currentCategory = "All";
let currentQuery = "";
let currentSort = "trending";
const PAGE_SIZE = 8;
let visibleCount = PAGE_SIZE;

function updateGallery() {
  const grid = document.getElementById("project-grid");
  const results = sortProjects(filterProjects(allProjects, currentCategory, currentQuery), currentSort);
  const shown = results.slice(0, visibleCount);                  // "Load More Work" raises visibleCount

  renderProjects(shown, grid);
  grid.hidden = results.length === 0;
  document.getElementById("no-results").hidden = results.length > 0;
  document.getElementById("load-more-wrap").hidden = shown.length >= results.length;
  document.getElementById("result-count").textContent =
    "Showing " + shown.length + " of " + results.length + (results.length === 1 ? " project" : " projects");

  if (results.length === 0) {
    const what = currentQuery ? "\u201c" + currentQuery + "\u201d" : currentCategory;
    document.getElementById("no-results-text").textContent = "No projects match " + what + ".";
  }

  saveToUrl();
}

function saveToUrl() {
  const params = new URLSearchParams();
  if (currentCategory !== "All") params.set("category", currentCategory);
  if (currentQuery) params.set("q", currentQuery);
  const text = params.toString();
  history.replaceState(null, "", text ? "?" + text : window.location.pathname);   // refresh keeps the filters
}

function setCategory(category) {
  currentCategory = category;
  visibleCount = PAGE_SIZE;                                      // a new filter starts from the first page
  for (const chip of document.querySelectorAll(".chip")) {
    chip.setAttribute("aria-pressed", chip.dataset.category === category ? "true" : "false");
  }
}

function setupFilters() {
  const search = document.getElementById("site-search");

  for (const chip of document.querySelectorAll(".chip")) {
    chip.addEventListener("click", function () {
      setCategory(chip.dataset.category);
      updateGallery();
    });
  }

  search.addEventListener("input", function () {
    currentQuery = search.value.trim();
    visibleCount = PAGE_SIZE;
    updateGallery();
  });

  document.getElementById("sort-select").addEventListener("change", function (event) {
    currentSort = event.target.value;
    visibleCount = PAGE_SIZE;
    updateGallery();
  });

  document.getElementById("load-more").addEventListener("click", function () {
    visibleCount += PAGE_SIZE;
    updateGallery();
  });

  document.getElementById("clear-filters").addEventListener("click", function () {
    search.value = "";
    currentQuery = "";
    setCategory("All");
    updateGallery();
  });

  // start from the address, e.g. index.html?category=Finance&q=graph
  const params = new URLSearchParams(window.location.search);
  const wanted = params.get("category") || "All";
  const known = [...document.querySelectorAll(".chip")].some(function (chip) {
    return chip.dataset.category === wanted;
  });
  setCategory(known ? wanted : "All");
  currentQuery = (params.get("q") || "").trim();
  search.value = currentQuery;
}

async function init() {
  hideMessage();

  try {
    const projects = await loadProjects();

    if (!Array.isArray(projects) || projects.length === 0) {
      showMessage("No projects found.", "Please check back soon.", false);
      return;
    }

    allProjects = projects;
    updateGallery();
  } catch (error) {
    console.error(error);
    showMessage("Something went wrong.", "We couldn't load the projects right now.", true);
  }
}

document.getElementById("gallery-retry").addEventListener("click", init);

setupFilters();
init();
