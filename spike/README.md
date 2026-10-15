# Fetch Spike (Week 2)

Throwaway code. Not for `main`.

## How to run
Download `spike.html` and open it in a browser. It loads `data/projects.json` from this repo's GitHub raw URL, so you need an internet connection.

## What it does
- Loads the sample projects with `fetch()` and `async`/`await`
- Shows each project's thumbnail, title, creator and category
- Shows a friendly error message if the load fails (404 or network error)

