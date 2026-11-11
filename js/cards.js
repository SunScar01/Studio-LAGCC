// Draws project cards into a grid. Used by the gallery (app.js) and the profile page (profile.js).
function renderProjects(projects, grid) {
  const template = document.getElementById("project-card-template");

  grid.innerHTML = "";                                  // clear the grid first

  for (const project of projects) {
    const card = template.content.cloneNode(true);      // copy the blueprint
    const url = "project.html?id=" + encodeURIComponent(project.id);

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
    card.querySelector(".js-likes").textContent = project.likes;
    card.querySelector(".js-comments").textContent = (project.comments || []).length;

    grid.appendChild(card);                             // put it on the page
  }
}
