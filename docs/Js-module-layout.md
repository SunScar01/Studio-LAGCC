# JavaScript Module Layout and Filtering Pseudo-code (Week 3 level-up)

Each file has one job. Data flows one way:
`data.js` loads -> `app.js` holds the state -> `filter.js` narrows the list -> `app.js` draws the cards.
`app.js` runs the Gallery page and `project.js` runs the project page. Both use `data.js`, `bookmarks.js`, `auth.js` and `theme.js`. `project.js` also uses `comments.js`.

## Modules

### data.js
- **Job:** load the project data. Nothing else.
- **Exposes:** `loadProjects()` fetches `data/projects.json`, checks `response.ok`, returns an array. Throws on failure.
- **Does NOT:** touch the page, filter or sort.

### filter.js
- **Job:** take a list and the current filter settings, return the matching list.
- **Exposes:**
  - `filterProjects(projects, filters)` returns a new array.
  - `sortProjects(projects, sortBy)` returns a new array.
  - `getMajors(projects)` and `getCategories(projects)` return the option lists.
- **Does NOT:** touch the page, change the original array, or fetch data.

### project.js
- **Job:** the project page (`project.html?id=...`).
- **Exposes:** `getProjectId()` reads `id` from the address; `renderProjectPage(project)` fills the page.
- **Does:** loads the data with `loadProjects()`, finds the project, shows the not-found state if there is no match.
- **Does NOT:** know about filters.

### bookmarks.js
- **Job:** save and read bookmarks in LocalStorage.
- **Exposes:** `getBookmarks()` returns an array of ids; `isBookmarked(id)`; `toggleBookmark(id)` returns the new state.
- **Does NOT:** touch the page. Wraps every LocalStorage call in try/catch, because storage can be blocked.

### comments.js
- **Job:** the comments on the project page.
- **Exposes:** `getComments(project)` returns the sample comments plus the ones saved in the browser, oldest first; `addComment(projectId, author, text)` validates (1 to 500 characters) and saves to LocalStorage.
- **Does NOT:** draw HTML from comment text. The page code uses `textContent`.

### auth.js
- **Job:** the demo login. A fake signed-in name in LocalStorage.
- **Exposes:** `signUp(name, email)`, `logIn(name)`, `logOut()`, `getUser()`.
- **Does NOT:** check passwords or talk to a server.

### theme.js
- **Job:** light and dark theme.
- **Exposes:** `getTheme()`, `setTheme(theme)`, `toggleTheme()`. Sets `data-theme` on `<html>`.
- **Does:** follow `prefers-color-scheme` until the visitor chooses. A tiny inline script in each page's `<head>` applies the saved theme before the page paints.

### form.js
- **Job:** the submission form (demo only).
- **Exposes:**
  - `validateForm(values)` returns a list of errors, empty if fine.
  - `saveSubmission(values)` writes the entry to LocalStorage.
  - `loadSubmissions()` reads saved entries from LocalStorage.
- **Does NOT:** upload files or draw the project cards.

### app.js
- **Job:** start the app and connect everything.
- **Exposes:** nothing. It runs on page load.
- **Does:**
  - calls `loadProjects()`, then adds `loadSubmissions()`
  - holds the state: `allProjects`, `filters`, `sortBy`
  - on any change, runs `filterProjects` then `sortProjects`, then redraws the cards
  - shows the loading, empty and error states
  - draws each card as a link to `project.html?id=...` and wires the bookmark buttons to `toggleBookmark`
- **Does NOT:** contain filter logic or the project page.

## Filtering pseudo-code

```
STATE
  allProjects = []
  filters = { search: "", major: "All", category: "All" }
  sortBy = "newest"

filterProjects(projects, filters):
  text = trim(lowercase(filters.search))
  result = []
  for each project in projects:
    if filters.major is not "All" and project.major != filters.major:
      skip
    if filters.category is not "All" and project.category != filters.category:
      skip
    if text is not empty:
      haystack = lowercase(title + creator + major + category + tools joined + description)
      if haystack does not contain text:
        skip
    add project to result
  return result

sortProjects(projects, sortBy):
  copy = copy of projects     // never change the original
  if sortBy == "newest":  sort copy by date, latest first
  if sortBy == "oldest":  sort copy by date, earliest first
  if sortBy == "popular": sort copy by likes, highest first (missing likes count as 0)
  if sortBy == "az":      sort copy by title, A to Z
  return copy

on any filter, search or sort change:
  filters/sortBy = new value
  visible = sortProjects(filterProjects(allProjects, filters), sortBy)
  if visible is empty: show "No projects found" with a Clear filters button
  else: draw one card per project in visible
  update the results count: "Showing X of Y projects"

on Reset:
  filters = { search: "", major: "All", category: "All" }, sortBy = "newest"
  run the same update
```

## Edge cases the filter must handle
- Empty search or only spaces: treat as no search.
- Special characters such as `(`, `+`, `.`: use plain `includes`, not a regular expression.
- `tools` or `images` missing or empty: treat as an empty list.
- `likes` missing: treat as 0.
- Zero results: show the empty state, not a blank page.
- Filters stack: major AND category AND search must all match.
