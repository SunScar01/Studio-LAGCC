// Draws project cards into a grid. Used by the gallery (app.js) and the profile pages.
// Needs bookmarks.js loaded first.
function renderProjects(projects, grid) {
  const template = document.getElementById("project-card-template");

  grid.innerHTML = "";                                  // clear the grid first

  for (const project of projects) {
    const card = template.content.cloneNode(true);      // copy the blueprint
    const url = "project.html?id=" + encodeURIComponent(project.id);

    card.querySelector(".project-card__media > a").href = url;

    const saveButton = card.querySelector(".project-card__tools .icon-button[aria-pressed]");
    saveButton.setAttribute("aria-pressed", String(isBookmarked(project.id)));
    saveButton.addEventListener("click", function () {
      saveButton.setAttribute("aria-pressed", String(toggleBookmark(project.id)));
    });

    const image = card.querySelector(".project-card__image");
    image.src = project.thumbnail;
    image.onerror = () => { image.src = "assets/images/no-image.svg"; };

    const title = card.querySelector(".project-card__title a");
    title.textContent = project.title;
    title.href = url;

    const creator = card.querySelector(".js-creator");
    creator.textContent = project.creator;
    creator.href = "profile.html?name=" + encodeURIComponent(project.creator);

    card.querySelector(".js-major").textContent = project.major;
    const tag = card.querySelector(".js-tag");
    tag.textContent = project.recommended ? "Featured" : project.category;
    tag.classList.toggle("project-card__tag--featured", Boolean(project.recommended));

    card.querySelector(".js-likes").textContent = project.likes;
    card.querySelector(".js-comments").textContent = (project.comments || []).length;

    grid.appendChild(card);                             // put it on the page
  }
}
