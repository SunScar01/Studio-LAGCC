// "Spotlight of the month": 5 projects marked "spotlight": true in projects.json.
// Needs data.js loaded first.
(function () {
  const track = document.getElementById("spotlight-track");
  if (!track) return;
  document.getElementById("spotlight-title").textContent = new Date().toLocaleString("en-US", { month: "long" });

  function show(project) {
    document.getElementById("spotlight-name").textContent = project.title;
    document.getElementById("spotlight-meta").textContent = project.creator + " · " + project.major;
    document.getElementById("spotlight-link").href = "project.html?id=" + encodeURIComponent(project.id);
    track.querySelectorAll("a").forEach(function (a) {
      a.classList.toggle("is-active", a.dataset.id === project.id);
    });
  }

  async function init() {
    let list = [];
    try {
      list = (await loadProjects()).filter(function (p) { return p.spotlight; }).slice(0, 5);
    } catch (error) {
      console.error(error);
    }
    if (list.length === 0) { track.closest(".spotlight").hidden = true; return; }

    const middle = (list.length - 1) / 2;
    list.forEach(function (project, index) {
      const offset = index - middle;
      const item = document.createElement("li");
      const link = document.createElement("a");
      const image = document.createElement("img");
      item.style.setProperty("--o", offset);
      item.style.setProperty("--a", Math.abs(offset));
      link.href = "project.html?id=" + encodeURIComponent(project.id);
      link.dataset.id = project.id;
      link.setAttribute("aria-label", project.title + " by " + project.creator);
      image.src = project.thumbnail;
      image.alt = "";
      image.loading = "lazy";
      image.onerror = function () { image.onerror = null; image.src = "assets/images/no-image.svg"; };
      link.appendChild(image);
      item.appendChild(link);
      track.appendChild(item);
      link.addEventListener("mouseenter", function () { show(project); });
      link.addEventListener("focus", function () { show(project); });
    });
    show(list[Math.floor(middle)]);
    document.getElementById("spotlight-caption").hidden = false;
  }
  init();
})();
