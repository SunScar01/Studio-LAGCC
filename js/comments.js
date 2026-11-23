// Comments are saved in this browser only (a demo, there is no server).
// Stored as { "<project id>": [ { id, author, text, date } ] }
const COMMENTS_KEY = "lagccStudioComments";

function readAllComments() {
  try {
    const parsed = JSON.parse(localStorage.getItem(COMMENTS_KEY) || "{}");
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch (error) {
    return {};                                   // storage blocked or the saved text is broken
  }
}

function getSavedComments(projectId) {
  const list = readAllComments()[projectId];
  return Array.isArray(list) ? list : [];
}

// Returns the new comment, or null if it could not be saved
function addComment(projectId, author, text) {
  const all = readAllComments();
  const comment = {
    id: "local-" + Date.now(),
    author: author,
    text: text,
    date: new Date().toISOString().slice(0, 10)
  };
  all[projectId] = getSavedComments(projectId).concat(comment);
  try {
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(all));
  } catch (error) {
    console.error(error);
    return null;
  }
  return comment;
}
