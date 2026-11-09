async function loadProjects() {
  const response = await fetch("data/projects.json");

  if (!response.____) {
    throw new Error("Could not load projects");
  }

  return await response.____();
}
