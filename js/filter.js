// Filtering logic only. No page code in here, so it is easy to test.

function matchesCategory(project, category) {
  return category === "All" || project.category === category;
}

function matchesQuery(project, query) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);   // "game jason" -> ["game", "jason"]
  if (words.length === 0) return true;                              // empty search matches everything

  const text = [project.title, project.creator, project.major, project.category]
    .concat(project.tools || [])
    .join(" ")
    .toLowerCase();

  return words.every(function (word) {
    return text.includes(word);                                     // every word must appear somewhere
  });
}

function filterProjects(projects, category, query) {
  return projects.filter(function (project) {
    return matchesCategory(project, category) && matchesQuery(project, query);
  });
}

// Returns a sorted copy. "Trending" uses likes for now (we have no weekly numbers).
function sortProjects(projects, mode) {
  const copy = projects.slice();
  if (mode === "newest") {
    copy.sort(function (a, b) { return b.date.localeCompare(a.date); });          // dates are YYYY-MM-DD
  } else if (mode === "comments") {
    copy.sort(function (a, b) { return (b.comments || []).length - (a.comments || []).length; });
  } else {
    copy.sort(function (a, b) { return b.likes - a.likes; });
  }
  return copy;
}
