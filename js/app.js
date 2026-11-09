function renderProjects(projects) {
  const grid = document.getElementById("project-grid");
  const template = document.getElementById("project-card-template");

  grid.innerHTML = "";                                 

  for (const project of projects) {
    const card = template.content.cloneNode(true);     
    const url = "project.html?id=" + project.id;

    const image = card.querySelector(".project-card__image");
    image.src = project.thumbnail;
    image.onerror = () => { image.src = "assets/images/no-image.svg"; };

    const title = card.querySelector(".project-card__title a");
    title.textContent = project.title;
    title.href = url;

    card.querySelector(".project-card__meta").textContent =
      project.creator + ", " + project.major;

    card.querySelector(".js-likes").textContent = project.likes;
    card.querySelector(".js-comments").textContent = (project.comments || []).length;

    grid.appendChild(card);                           
  }
}

async function init() {
  try {
    const projects = await loadProjects();
    renderProjects(projects);
  } catch (error) {
    console.error(error);
  }
}

init();
