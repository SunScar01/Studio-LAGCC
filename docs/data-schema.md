# Data Schema

`data/projects.json` is an array of project objects. Every object uses the fields below. All sample projects and people are fictional.

| Field | Type | Required? | Description | Example |
|-------|------|-----------|-------------|---------|
| id | string | yes | Unique ID, format `proj-###`. Used by the code to tell projects apart, never shown to users. | `"proj-001"` |
| title | string | yes | Project name. Shown as the card heading and modal title. Can be long, so the layout must wrap it. | `"Puzzle Game"` |
| creator | string | yes | Student's name. Shown on the card and in the modal. Searchable. | `"Jason"` |
| major | string | yes | Student's major. Used by the major filter and shown in the modal. | `"Software Development"` |
| category | string | yes | One of the allowed categories below. Used by the category filter and shown as a badge. | `"Game Design"` |
| tools | array of strings | no | Tools and software used. Shown as badges and searchable. May be an empty array `[]`. | `["Unity", "Blender", "VS Code"]` |
| description | string | yes | Short summary of the project. Shown on the card (may be shortened) and in full in the modal. Aim for 1-2 sentences. | `"A 3D puzzle game built during summer 2026."` |
| thumbnail | string | no | Path to the card image, relative to the site root. If missing or broken, the card shows a placeholder. | `"assets/thumbnails/project-001.png"` |
| images | array of strings | no | Extra images for the detail view, shown after the thumbnail. May be an empty array `[]`, in which case only the thumbnail is shown. | `["assets/thumbnails/project-001-2.png"]` |
| likes | number | no | Demo like count, a whole number of 0 or more. Shown on cards and used by the "Most Popular" sort. Not a real count. | `120` |
| recommended | boolean | no | `true` if the project appears under "Recommended." Set by hand. Defaults to `false`. | `true` |
| projectUrl | string | no | Link to the project, shown in the modal. If missing, the link is hidden. | `"https://example.com"` |
| date | string | yes | Completion date, format `YYYY-MM-DD`. Used for display and for the "Newest" sort. | `"2026-07-26"` |

## Example entry
```json
{
  "id": "proj-001",
  "title": "Puzzle Game",
  "creator": "Jason",
  "major": "Software Development",
  "category": "Game Design",
  "tools": ["Unity", "Blender", "VS Code"],
  "description": "A 3D puzzle game built during summer 2026.",
  "thumbnail": "assets/thumbnails/project-001.png",
  "images": [
    "assets/thumbnails/project-001-2.png",
    "assets/thumbnails/project-001-3.png"
  ],
  "likes": 120,
  "recommended": true,
  "projectUrl": "https://example.com",
  "date": "2026-07-26"
}
```

## Allowed categories
- Technology
- Game Design
- Art & Design
- Engineering
- Business

## Sorting
- **Newest:** by `date`, latest first.
- **Most Popular:** by `likes`, highest first.
- **Recommended:** projects with `recommended: true`.

## Rules
- The file is a single JSON array. Objects are separated by commas, with no comma after the last one.
- `id` values are unique and follow the pattern `proj-001`, `proj-002`, and so on.
- `category` must exactly match one of the allowed categories, including capitalization and the `&`.
- `date` uses `YYYY-MM-DD`.
- Tool names use one spelling everywhere (`VS Code`, not `Vscode`; `LangChain`, not `Lang Chain`).
- Image files live in `assets/thumbnails/`. The card image is named `project-001.png`, and extra detail images add a number: `project-001-2.png`, `project-001-3.png`. Paths must match the real file names exactly, including capitalization and extension.
- `likes` and `recommended` are demo data set by hand. They are not collected from real users.
- Images are sample images we have the right to use. Do not use photos of identifiable people without permission.
- Sample data uses fictional projects and people. Real student work needs written permission.

## Edge cases the code must handle
- Very long titles.
- Missing `thumbnail` or `projectUrl`.
- `images` empty, with one image, or with several.
- `likes` missing or 0.
- Many tools on one project.
- No projects matching a search or filter (empty state).
