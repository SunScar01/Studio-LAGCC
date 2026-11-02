# Component Inventory (Week 3)

Based on Shakira's wireframes (Home, Gallery, Project Detail, Submission, Success, Empty/Error; desktop and mobile). Fields refer to `docs/data-schema.md`.

## Components
| Component | Screens | Fields needed | Status / notes |
|---|---|---|---|
| Header (logo, nav, search, buttons) | all | none | Login / Sign Up are demo-only. |
| Hero | Home | none | Images come from the Image Bank, not the data. |
| Project card | Home, Gallery, Detail ("More Projects") | thumbnail, title, creator, major, category, likes | Fixed height. Missing thumbnail shows the logo. Likes approved by supervisor. |
| Featured Projects row + "View All" | Home | same as card | Decided: shows projects where `recommended` is true. |
| Search field | all | title, description, tools, creator | OK. Handle empty input, extra spaces and special characters. |
| Filter: Major | Gallery | major | Fixed list of 10 majors in `data-schema.md`. |
| Filter: Category | Gallery | category | Decided: dropdown next to Major. Needs adding to the wireframe. |
| Card bookmark button | Home, Gallery, Project | none (ids saved in LocalStorage) | Decided: saves in the browser, does not open the page. Approved by supervisor. Needs a way to view saved projects. |
| Sort: Newest | Gallery | date | OK. |
| Sort: Most Popular | Gallery | likes | OK, using demo likes. |
| Sort / tab: Recommended | Gallery | recommended | OK, using the flag. |
| Results count ("6 results") | Gallery | none | Calculated from the filtered list. |
| Pagination | Gallery | none | Extra work. Decide if the MVP needs it (10 projects). |
| Reset / Clear Filters | Gallery, Empty | none | OK. |
| Project page (`project.html?id=`) | Project | all fields | Decided: no modal, a card opens its own page. Shows images, tags and "View Project." No Previous/Next. Needs a not-found state. |
| Project page: image gallery | Project | thumbnail, images | Handle none, one or several. |
| Project page: tags | Project | tools | Same as `tools`? Ask. |
| Project page: "More Projects" | Project | category | Rule needed (same category?). |
| Submission form (one page) | Submission | title, description, major, category, tools, thumbnail, projectUrl, **creator** | Creator is a required field (decided). Missing in the wireframe, so add it. |
| Success screen | Success | none | "View My Project" must find the new LocalStorage entry. |
| Empty state ("No projects found") | Empty/Error | none | Matches our empty-state handling. |
| Error state | Empty/Error | none | Matches our fetch `try`/`catch`. |
| Login / Sign Up (demo) | Header | none (a name saved in LocalStorage) | Decided: demo only, no password. Approved by supervisor as a demo. |
| Comments section | Project | `comments` (`id`, `author`, `text`, `date`) | Decided: sample comments from the JSON plus comments saved in the browser. Needs login to post. Approved by supervisor as a demo. |
| Theme toggle | Header, all | none (choice saved in LocalStorage) | Decided: light and dark. Needs a dark palette in Figma and a contrast check. |
| Footer | all | none | Links should point somewhere real. |

## Risks
- **Likes, Popular and Recommended** use demo data. The counts are not real and do not sync between users.
- **Login** needs a demo-only design, and never stores real passwords.
- **Image upload** in the form: LocalStorage holds about 5 MB of text, so storing real files is a problem. Store only a file name or a small preview.
- **Major and Category filters:** each of the 10 sample projects has a different major and category, so the dropdowns have 10 options each and a filter shows one project. The values must match the schema lists exactly.
- **Very long titles, missing thumbnails, many tools** on one project (from the schema edge cases).
- **Bookmarks** are stored per browser and are lost if site data is cleared. LocalStorage can be blocked, so hide the button if it is.
- **Separate project page:** a wrong or missing `?id=` needs a not-found state, and GitHub Pages needs relative links.
- **Pagination** adds work. Confirm it is in the MVP.

- **Comments** are not shared between visitors, and the text must be shown as plain text, never HTML.
- **Dark theme:** the official red fails contrast as text on dark. The logo may need a dark-background version.
- **Scope:** bookmarks, comments, demo login and the dark theme are approved by the supervisor as demos. Keep the written approval on file.

## Changes to tell Shakira
1. Add a Category dropdown next to Major on the Gallery screen.
2. Add a Creator name field to the submission form (one page, not four steps).
3. Featured Projects uses the `recommended` flag, so no design change.
4. Cards have a bookmark button, and clicking a card opens its own page (no modal).
5. Add a comments section to the project page, with a signed-out state.
6. Add Log in and Sign up screens and a signed-in header.
7. Design a dark theme and a theme toggle in the header.

## Question for Shakira
- Are the project-page tags the same as `tools`?
- Where do people see their saved projects?

## Schema status
`data-schema.md` already includes `images`, `likes` and `recommended`. Featured uses `recommended`.
