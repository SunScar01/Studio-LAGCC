async function init() {
  try {
    const projects = await loadProjects();
    console.log(projects);
  } catch (error) {
    console.error(error);
  }
}

init();
