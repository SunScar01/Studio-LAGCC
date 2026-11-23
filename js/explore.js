// "Explore by major" menu in the header.
// Opens on hover (mouse) or click/Enter (keyboard, touch). Escape or clicking outside closes it.
// Needs data.js loaded first (for the featured project).
(function () {
  const GROUPS = [
    { title: "Arts, Media & Design", majors: ["Film & Television", "Fine Arts", "Fine Arts, Design Studies", "Industrial Design", "Photography", "New Media Technology"] },
    { title: "Computing & Engineering", majors: ["Computer Science", "Computer Technology", "Cybersecurity", "Engineering Civil", "Programming and Software"] },
    { title: "Business & Law", majors: ["Accounting", "Business Administration", "Hospitality & Events", "Paralegal Studies"] },
    { title: "Health & Wellness", majors: ["Nursing", "Nutrition & Culinary", "Occupational Therapy asst.", "Public and Community Health", "Veterinary Technology"] }
  ];
  const ARROW = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true"><path d="M4 12h15m0 0-6-6m6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  const link = document.querySelector(".site-nav a[href='index.html#projects']");
  if (!link) return;                                   // page without the full header

  const item = link.parentElement;
  const header = document.querySelector(".site-header");

  // the plain link still works without JavaScript; here it becomes a real button
  const button = document.createElement("button");
  button.type = "button";
  button.className = "nav-explore";
  button.textContent = "Explore";
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-controls", "explore-menu");
  item.replaceChild(button, link);

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function buildPanel() {
    const panel = el("div", "explore-menu");
    panel.id = "explore-menu";
    panel.hidden = true;
    panel.tabIndex = -1;                               // so clicking blank space inside keeps focus in the menu
    panel.setAttribute("role", "region");
    panel.setAttribute("aria-label", "Explore by major");

    const inner = el("div", "container explore-menu__inner");
    inner.appendChild(el("p", "explore-menu__title", "Explore by major"));

    const grid = el("div", "explore-menu__grid");
    const cols = el("div", "explore-menu__cols");
    for (const group of GROUPS) {
      const col = el("div", "explore-menu__col");
      col.appendChild(el("h3", "explore-menu__group", group.title));
      const list = el("ul", "explore-menu__list");
      for (const major of group.majors) {
        const row = document.createElement("li");
        const a = el("a", "", major);
        a.href = "index.html?major=" + encodeURIComponent(major);
        row.appendChild(a);
        list.appendChild(row);
      }
      col.appendChild(list);
      cols.appendChild(col);
    }
    grid.appendChild(cols);

    const side = el("aside", "explore-menu__side");
    const top = el("div", "explore-menu__links");
    for (const text of ["All 68 Majors", "All Work"]) {
      const a = el("a", "explore-menu__all", text + " ");
      a.href = "index.html#projects";
      a.insertAdjacentHTML("beforeend", ARROW);        // fixed icon, no user data
      top.appendChild(a);
    }
    side.appendChild(top);
    side.appendChild(el("p", "explore-menu__label", "Featured this week"));
    const feature = el("a", "explore-feature");
    feature.id = "explore-feature";
    feature.hidden = true;                             // shown once the data has loaded
    side.appendChild(feature);
    grid.appendChild(side);

    inner.appendChild(grid);
    panel.appendChild(inner);
    return panel;
  }

  const panel = buildPanel();
  item.appendChild(panel);                             // inside the same list item, so Tab goes from the button into the menu
  const overlay = el("div", "explore-overlay");
  overlay.hidden = true;
  document.body.appendChild(overlay);

  let isOpen = false;
  let pinned = false;                                  // opened by click or key, so moving the mouse away does not close it
  let hideTimer = null;
  let featureLoaded = false;

  async function loadFeature() {
    if (featureLoaded) return;
    featureLoaded = true;
    try {
      const projects = await loadProjects();
      const best = projects.slice().sort(function (a, b) { return b.likes - a.likes; })[0];   // most liked, we have no weekly numbers
      if (!best) return;
      const feature = document.getElementById("explore-feature");
      const image = el("img", "explore-feature__image");
      image.alt = "";
      image.src = best.thumbnail;
      image.onerror = function () { image.src = "assets/images/no-image.svg"; };
      feature.href = "project.html?id=" + encodeURIComponent(best.id);
      feature.appendChild(image);
      feature.appendChild(el("span", "explore-feature__title", best.title));
      feature.appendChild(el("span", "explore-feature__meta", best.creator + ", " + best.major));
      feature.hidden = false;
    } catch (error) {
      console.error(error);                            // the menu works without the featured project
    }
  }

  function open() {
    clearTimeout(hideTimer);
    if (isOpen) return;
    isOpen = true;
    panel.hidden = false;
    overlay.hidden = false;
    button.setAttribute("aria-expanded", "true");
    loadFeature();
  }

  function close() {
    clearTimeout(hideTimer);
    if (!isOpen) return;
    isOpen = false;
    pinned = false;
    panel.hidden = true;
    overlay.hidden = true;
    button.setAttribute("aria-expanded", "false");
  }

  // mouse: open on hover, close shortly after leaving (the delay lets you cross the gap into the menu)
  item.addEventListener("pointerenter", function (event) {
    if (event.pointerType === "mouse") open();
  });
  item.addEventListener("pointerleave", function (event) {
    if (event.pointerType !== "mouse" || pinned) return;
    hideTimer = setTimeout(close, 250);
  });

  // click, Enter and Space (a button turns Enter and Space into clicks)
  button.addEventListener("click", function () {
    if (isOpen && !pinned) {                           // it opened by hover, so this click keeps it open
      pinned = true;
    } else if (isOpen) {
      close();
    } else {
      open();
      pinned = true;
    }
  });

  overlay.addEventListener("click", close);

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape" || !isOpen) return;
    const hadFocus = item.contains(document.activeElement);
    close();
    if (hadFocus) button.focus();
  });

  item.addEventListener("focusout", function (event) {
    if (isOpen && event.relatedTarget && !item.contains(event.relatedTarget)) close();   // tabbed out of the menu
  });
})();
