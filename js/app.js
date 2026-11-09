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

async function init() {
  hideMessage();

  try {
    const projects = await loadProjects();

    if (!Array.isArray(projects) || projects.length === 0) {
      showMessage("No projects found.", "Please check back soon.", false);
      return;
    }

    renderProjects(projects);
  } catch (error) {
    console.error(error);
    showMessage("Something went wrong.", "We couldn't load the projects right now.", true);
  }
}

document.getElementById("gallery-retry").addEventListener("click", init);

init();
