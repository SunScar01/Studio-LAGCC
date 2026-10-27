# Component Inventory (Week 3)

Based on Shakira's wireframes (Home, Gallery, Project Detail, Submission, Success, Empty/Error; desktop and mobile). Fields refer to `docs/data-schema.md`.

## Components
| Component | Screens | Fields needed | Status / notes |
|---|---|---|---|
| Header (logo, nav, search, buttons) | all | none | Login / Sign Up are demo-only. |
| Hero | Home | none | Images come from the Image Bank, not the data. |
| Project card | Home, Gallery, Detail ("More Projects") | thumbnail, title, creator, major, category, likes | OK. Handle long titles and missing thumbnails. |
| Featured Projects row + "View All" | Home | same as card | Rule needed. Could use the `recommended` flag. Ask. |
| Search field | all | title, description, tools, creator | OK. Handle empty input, extra spaces and special characters. |
| Filter: Major | Gallery | major | Needs a fixed list of majors. Current data is free text. |
| Sort: Newest | Gallery | date | OK. |
| Sort: Most Popular | Gallery | likes | OK, using demo likes. |
| Sort / tab: Recommended | Gallery | recommended | OK, using the flag. |
| Results count ("6 results") | Gallery | none | Calculated from the filtered list. |
| Pagination | Gallery | none | Extra work. Decide if the MVP needs it (10 projects). |
| Reset / Clear Filters | Gallery, Empty | none | OK. |
| Detail view (modal or page) | Detail | all fields | Shows images, tags, Previous/Next and "View Project." |
| Detail: image gallery | Detail | thumbnail, images | Handle none, one or several. |
| Detail: tags | Detail | tools | Same as `tools`? Ask. |
| Detail: "More Projects" | Detail | category | Rule needed (same category?). |
| Detail: Previous / Next | Detail | none | Moves through the current filtered list. |
| Submission form (4 steps) | Submission | title, description, major, category, tools, thumbnail, projectUrl, **creator** | Creator field missing in the wireframe. |
| Success screen | Success | none | "View My Project" must find the new LocalStorage entry. |
| Empty state ("No projects found") | Empty/Error | none | Matches our empty-state handling. |
| Error state | Empty/Error | none | Matches our fetch `try`/`catch`. |
| Login / Sign Up (demo) | Header | none (a name saved in LocalStorage) | Last priority. Needs supervisor approval. |
| Footer | all | none | Links should point somewhere real. |

## Risks
- **Likes, Popular and Recommended** use demo data. The counts are not real and do not sync between users.
- **Login** needs a demo-only design, and never stores real passwords.
- **Image upload** in the form: LocalStorage holds about 5 MB of text, so storing real files is a problem. Store only a file name or a small preview.
- **Major filter:** `major` must become a fixed list for the filter to work.
- **Very long titles, missing thumbnails, many tools** on one project (from the schema edge cases).
- **Pagination and a 4-step form** add work. Confirm they are in the MVP.


## Schema status
`data-schema.md` already includes `images`, `likes` and `recommended`. Still open: a fixed list for `major`, and a `featured` rule.
