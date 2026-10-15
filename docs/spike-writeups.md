# Spike Write-up: fetch() and JSON (Sanskar)

**What I built:** A throwaway page (`spike.html`) that loads `projects.json` with `fetch()` and `async`/`await`, then shows each project as a list item with its thumbnail, title, creator and category. If loading fails, it shows a friendly error message instead of an empty page.

**What worked:** `fetch()` loaded all 10 sample projects from the raw GitHub URL, and `response.json()` turned them into JavaScript objects I could loop over. Building the list with `createElement`, `textContent` and `appendChild` was simple once I had the array.

**What surprised me:**
- A wrong URL (404) does **not** make `fetch()` fail. It succeeds and returns a response saying "not found." I have to check `response.ok` myself and throw an error, or the code tries to read the error page as JSON.
- With Wi-Fi off, the page still loaded the data, because the browser had a cached copy. Testing real failures needs the cache turned off or a URL that can't be reached.
- Joining text with `+` doesn't add spaces. My first version printed "JasonGame Design." Template literals (backticks and `${}`) are easier to read.
- The thumbnail paths in the JSON are relative to the repo (`assets/thumbnails/project-001.png`), so on a page outside the repo I had to put the full GitHub address in front of them. File names also have to match the JSON exactly, or the image shows as broken.
- Scripts are blocked when you run them in the console on the raw GitHub page itself, so I had to use a blank page.

**What I'd do differently in the real build (Week 6):**
- Put the loading code in its own `data.js` file, separate from the code that draws the cards.
- Handle an empty `projects.json` as well as failed loads, with a clear message for each.
- Show a placeholder image when a thumbnail is missing or broken, instead of a broken image icon.
- Use the same `response.ok` check and `try`/`catch` pattern, and keep error messages friendly for users while logging details to the console.
