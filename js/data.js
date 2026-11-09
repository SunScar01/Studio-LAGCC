async function loadProjects() {
  const response = await fetch("data/projects.json");

  if (!response.ok) {
    throw new Error("Could not load projects");
  }

  return await response.json();
}
