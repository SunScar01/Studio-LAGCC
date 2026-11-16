// Saved projects. Only the ids are stored, in this browser.
const BOOKMARKS_KEY = "lagccStudioBookmarks";

function getBookmarks() {
  try {
    const text = localStorage.getItem(BOOKMARKS_KEY);
    const list = text ? JSON.parse(text) : [];
    return Array.isArray(list) ? list : [];
  } catch (error) {
    return [];                                   // storage blocked or the saved text is broken
  }
}

function isBookmarked(id) {
  return getBookmarks().includes(id);
}

// Saves or unsaves, and returns the new state (true = saved)
function toggleBookmark(id) {
  const list = getBookmarks();
  const wasSaved = list.includes(id);
  const next = wasSaved ? list.filter(function (item) { return item !== id; }) : list.concat(id);
  try {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(next));
  } catch (error) {
    console.error(error);
    return wasSaved;                             // could not save, so nothing changed
  }
  return !wasSaved;
}
