function showMessage(title, text, canRetry) {
  document.getElementById("gallery-message-title").textContent = title;
  document.getElementById("gallery-message-text").textContent = text;
  document.getElementById("gallery-retry").hidden = !canRetry;
  const hero = document.getElementById("hero");
  if (hero) hero.hidden = true;        // the message replaces the whole page
  document.getElementById("projects").hidden = true;
  document.getElementById("gallery-message").hidden = false;
}

function hideMessage() {
  document.getElementById("gallery-message").hidden = true;
  const heroBack = document.getElementById("hero");
  if (heroBack) heroBack.hidden = false;
  document.getElementById("projects").hidden = false;
}

let allProjects = [];
let currentCategory = "All";
let currentQuery = "";
let currentMajor = "";
let currentSort = "trending";
const PAGE_SIZE = 8;                                             // first screen
const SCROLL_BATCH = 4;                                          // cards added each time the page end comes into view
const SCROLL_DELAY = 600;                                        // ms between batches, so the page fills slowly
let loadingMore = false;
let visibleCount = PAGE_SIZE;
let hasScrolledToResults = false;

// Loads a few more cards each time the end of the grid scrolls into view, with a pause between batches
function setupInfiniteScroll() {
  const wrap = document.getElementById("load-more-wrap");
  if (!("IntersectionObserver" in window)) return;               // the Load More button stays
  document.getElementById("load-more").hidden = true;
  const spinner = document.getElementById("scroll-loading");

  const observer = new IntersectionObserver(function (entries) {
    const pastIt = entries[0].boundingClientRect.top < 0;        // scrolled beyond the grid end: keep filling, slowly
    if (!(entries[0].isIntersecting || pastIt) || loadingMore || wrap.hidden) return;
    loadingMore = true;
    spinner.hidden = false;
    setTimeout(function () {
      visibleCount += SCROLL_BATCH;
      updateGallery(true);
      spinner.hidden = true;
      loadingMore = false;
      observer.unobserve(wrap);                                  // observe again: if the end is still on screen it loads the next batch
      if (!wrap.hidden) observer.observe(wrap);
    }, SCROLL_DELAY);
  }, { rootMargin: "0px 0px 500px 0px" });
  observer.observe(wrap);
}

function updateGallery(append) {
  const grid = document.getElementById("project-grid");
  const results = sortProjects(filterProjects(allProjects, currentCategory, currentQuery, currentMajor), currentSort);
  const shown = results.slice(0, visibleCount);                  // scrolling to the end raises visibleCount
  const alreadyShown = append ? grid.children.length : 0;

  renderProjects(shown.slice(alreadyShown), grid, Boolean(append));
  grid.hidden = results.length === 0;
  document.getElementById("no-results").hidden = results.length > 0;
  document.getElementById("load-more-wrap").hidden = results.length === 0 || shown.length >= results.length;
  document.getElementById("result-count").textContent =
    "Showing " + shown.length + " of " + results.length + (results.length === 1 ? " project" : " projects");

  document.getElementById("major-filter").hidden = currentMajor === "";
  document.getElementById("major-name").textContent = currentMajor;

  if (results.length === 0) {
    const what = currentQuery ? "\u201c" + currentQuery + "\u201d" : (currentMajor || currentCategory);
    document.getElementById("no-results-text").textContent = "No projects match " + what + ".";
  }

  saveToUrl();
}

function saveToUrl() {
  const params = new URLSearchParams();
  if (currentCategory !== "All") params.set("category", currentCategory);
  if (currentQuery) params.set("q", currentQuery);
  if (currentMajor) params.set("major", currentMajor);
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

// On wide screens the header stays at the top while you scroll (see components.css), so the search box stays in view
function stickyHeader() {
  return window.matchMedia("(min-width: 900px)").matches;
}

// The search bar is in the header, so bring the results into view (only if they are further down)
function scrollToResults() {
  const section = document.getElementById("projects");
  if (!section || section.getBoundingClientRect().top < 120) return;
  section.scrollIntoView({ block: "start", behavior: "instant" });                    // instant: the grid changes with every key, so a smooth scroll keeps getting cut off
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
    if (currentQuery && stickyHeader()) scrollToResults();      // phones: wait for Enter, or the page jumps back to the box
  });
  search.addEventListener("keydown", function (event) {
    if (event.key !== "Enter" || !currentQuery) return;
    scrollToResults();
    if (!stickyHeader()) search.blur();                         // closes the phone keyboard so the results show
  });

  document.getElementById("sort-select").addEventListener("change", function (event) {
    currentSort = event.target.value;
    visibleCount = PAGE_SIZE;
    updateGallery();
  });

  // Fallback button (browsers without IntersectionObserver)
  document.getElementById("load-more").addEventListener("click", function () {
    visibleCount += PAGE_SIZE;
    updateGallery();
  });

  setupInfiniteScroll();

  document.getElementById("major-clear").addEventListener("click", function () {
    currentMajor = "";
    visibleCount = PAGE_SIZE;
    updateGallery();
  });

  document.getElementById("clear-filters").addEventListener("click", function () {
    search.value = "";
    currentQuery = "";
    currentMajor = "";
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
  currentMajor = (params.get("major") || "").trim();
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

    if (window.location.search && !hasScrolledToResults) {       // arrived from the menu or a search: show the results, not the hero
      hasScrolledToResults = true;
      document.getElementById("projects").scrollIntoView();
    }
  } catch (error) {
    console.error(error);
    showMessage("Something went wrong.", "We couldn't load the projects right now.", true);
  }
}

document.getElementById("gallery-retry").addEventListener("click", init);

setupFilters();
init();
