# Data Schema

`data/projects.json` is an array of project objects. Every object uses the fields below. All sample projects and people are fictional.

| Field | Type | Required? | Description | Example |
|-------|------|-----------|-------------|---------|
| id | string | yes | Unique ID, format `proj-###`. Used by the code to tell projects apart, never shown to users. | `"proj-001"` |
| title | string | yes | Project name. Shown as the card heading and modal title. Can be long, so the layout must wrap it. | `"Puzzle Game"` |
| creator | string | yes | Student's name. Shown on the card and in the modal. | `"Jason"` |
| major | string | yes | Student's major. Used by the major filter and shown in the modal. | `"Software Development"` |
| category | string | yes | One of the allowed categories below. Used by the category filter and shown as a badge. | `"Game Design"` |
| tools | array of strings | no | Tools and software used. Shown as badges and searchable. May be an empty array `[]`. | `["Unity", "Blender", "VS Code"]` |
| description | string | yes | Short summary of the project. Shown on the card (may be shortened) and in full in the modal. Aim for 1-2 sentences. | `"A 3D puzzle game built during summer 2026."` |
| thumbnail | string | no | Path to the card image, relative to the site root. If missing or broken, the card shows a placeholder. | `"assets/thumbnails/project-001.png"` |
| projectUrl | string | no | Link to the project, shown in the modal. If missing, the link is hidden. | `"https://example.com"` |
| date | string | yes | Completion date, format `YYYY-MM-DD`. Used for display and sorting. | `"2026-07-26"` |

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

## Rules
- The file is a single JSON array. Objects are separated by commas, with no comma after the last one.
- `id` values are unique and follow the pattern `proj-001`, `proj-002`, and so on.
- `category` must exactly match one of the allowed categories, including capitalization and the `&`.
- `date` uses `YYYY-MM-DD`.
- Tool names use one spelling everywhere (`VS Code`, not `Vscode`; `LangChain`, not `Lang Chain`).
- Thumbnail files live in `assets/thumbnails/` and are named after the project number, for example `project-001.png`. The path in the JSON must match the real file name exactly, including capitalization and extension.
- Thumbnails are sample images we have the right to use. Do not use photos of identifiable people without permission.
- Sample data uses fictional projects and people. Real student work needs written permission.
