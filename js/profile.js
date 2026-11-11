function getStudentName() {
  return new URLSearchParams(window.location.search).get("name");
}

function showProfileMessage(title, text, canRetry) {
  document.getElementById("profile-message-title").textContent = title;
  document.getElementById("profile-message-text").textContent = text;
  document.getElementById("profile-retry").hidden = !canRetry;
  document.getElementById("profile").hidden = true;       // the message replaces the page content
  document.getElementById("profile-message").hidden = false;
}

function hideProfileMessage() {
  document.getElementById("profile-message").hidden = true;
  document.getElementById("profile").hidden = false;
}

async function initProfile() {
  hideProfileMessage();

  const name = getStudentName();
  if (!name) {
    showProfileMessage("Student not found.", "That profile link is not valid.", false);
    return;
  }

  try {
    const allProjects = await loadProjects();
    const projects = allProjects.filter(function (project) {
      return project.creator === name;
    });

    if (projects.length === 0) {
      showProfileMessage("Student not found.", "We couldn't find a student with that name.", false);
      return;
    }

    document.title = name + " | LAGCC STUDIO";
    document.getElementById("crumb-name").textContent = name;
    document.getElementById("profile-avatar").textContent = name.charAt(0).toUpperCase();
    document.getElementById("profile-name").textContent = name;
    document.getElementById("profile-major").textContent = projects[0].major;
    document.getElementById("profile-count").textContent = projects.length;

    const contact = document.getElementById("profile-contact");
    if (projects[0].creatorEmail) {
      contact.href = "mailto:" + projects[0].creatorEmail;
    } else {
      contact.hidden = true;                              // no email on file
    }

    renderProjects(projects, document.getElementById("project-grid"));
  } catch (error) {
    console.error(error);
    showProfileMessage("Something went wrong.", "We couldn't load this profile right now.", true);
  }
}

document.getElementById("profile-retry").addEventListener("click", initProfile);

initProfile();
