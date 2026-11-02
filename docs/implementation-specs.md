# Implementation Specs (Week 4)

Fields refer to `docs/data-schema.md`. Components match `docs/component-inventory.md`.

## Naming conventions
- **Files:** lowercase, one job each (`filter.js`, `project.js`, `components.css`).
- **CSS classes:** kebab-case, BEM style. Block `project-card`, part `project-card__title`, variant `project-card--featured`, state `is-hidden`.
- **IDs:** only for things JS grabs once (`#search-input`). Style with classes.
- **JS:** camelCase for variables and functions (`renderCard`, verb first), UPPER_SNAKE for constants.
- **Data attributes:** `data-project-id`.
- **CSS variables:** in `css/variables.css`, by purpose: `--color-brand-red`, `--space-4`, `--font-heading`.
- **Comments:** explain why, not what.

---

## 1. Project card

**Used on:** Home (Featured), Gallery, Project page ("More Projects")
**Data inputs:** `id`, `title`, `creator`, `major`, `category`, `thumbnail`, `likes`. The bookmark state comes from LocalStorage, not from the JSON.

```html
<li class="project-card">
  <a class="project-card__link" href="project.html?id=proj-001">
    <img class="project-card__image" src="..." alt="" width="400" height="250" loading="lazy">
    <span class="project-card__body">
      <span class="project-card__title">Puzzle Game</span>
      <span class="project-card__creator">by Jason</span>
      <span class="project-card__meta">Software Development · Game Design</span>
    </span>
  </a>
  <span class="project-card__likes"><svg aria-hidden="true">...</svg>120</span>
  <button class="project-card__save" type="button" aria-pressed="false" aria-label="Save Puzzle Game">
    <svg aria-hidden="true">...</svg>
  </button>
</li>
```
Cards sit in `<ul class="project-grid">`. The save button is a sibling of the link, never inside it, because a button inside a link is invalid and breaks keyboard use.

| Class | Purpose |
|---|---|
| `project-grid` | List holding the cards. CSS grid, responsive columns. |
| `project-card` | The card box. Border, radius, hover. `position: relative`. |
| `project-card__link` | The link to the project page. Stretched over the whole card so a click anywhere opens the page. |
| `project-card__image` | Thumbnail, fixed ratio, `object-fit: cover`. |
| `project-card__title` | Clamp to 2 lines. |
| `project-card__creator` | "by Name". Hidden if missing. |
| `project-card__meta` | Major and category. |
| `project-card__likes` | Heart icon plus count. Display only. 0 if missing. |
| `project-card__save` | Bookmark button, top right of the image. 44px target, sits above the link. |

**Bookmarks (decided):** the bookmark button saves or removes the project id in LocalStorage (key `makerHubBookmarks`, an array of ids). It does not open the page. Clicking it toggles `aria-pressed`, the icon fills when saved, and the card is not navigated. Bookmarks only exist in this browser. Needs supervisor approval, because favorites are on the out-of-scope list.

**States:** default; hover (lift, off under `prefers-reduced-motion`); focus (3px outline on the link and on the bookmark button, never removed); bookmark off and on; long title (2 lines then ellipsis); missing thumbnail (show the Maker Hub logo as the placeholder, via `onerror` or when `thumbnail` is empty); loading (6 skeleton cards); LocalStorage blocked (hide the bookmark button, the cards still work).
**Card size (decided):** fixed card height. Image area has a fixed ratio, the title clamps to 2 lines and the creator to 1 line, so every card in a row is the same height.
**Accessibility:** the card is a real link, so Tab and Enter work; `alt=""` because the title is beside it; the bookmark button has an `aria-label` that names the project and `aria-pressed` for its on/off state; the heart is `aria-hidden` and the count is read as text; contrast 4.5:1 or higher.

---

## 2. Project page

**Used on:** `project.html?id=proj-001`, reached by clicking a card. There is no modal (decided).
**Data inputs:** `title`, `creator`, `major`, `category`, `date`, `description`, `tools`, `thumbnail`, `images`, `projectUrl`, `likes`. The `id` comes from the address.

```html
<main class="project-page">
  <a class="project-page__back" href="index.html#gallery">Back to gallery</a>
  <article>
    <div class="project-page__images">
      <img class="project-page__image" src="..." alt="Puzzle Game, image 1 of 3">
    </div>
    <h1 class="project-page__title">Puzzle Game</h1>
    <span class="project-page__likes">120</span>
    <button class="project-page__save" type="button" aria-pressed="false">Save</button>
    <p class="project-page__meta">by Jason · Software Development · Game Design · Jul 26, 2026</p>
    <p class="project-page__description">...</p>
    <ul class="project-page__tools"><li class="project-page__tool">Unity</li></ul>
    <a class="project-page__link" href="..." target="_blank" rel="noopener">View project</a>
  </article>
</main>
```

| Class | Purpose |
|---|---|
| `project-page__back` | Link back to the Gallery. |
| `project-page__images` | Thumbnail plus `images`. Arrows between this project's images only if there is more than one. |
| `project-page__title`, `__meta`, `__description` | Text. No clamp on the title. |
| `project-page__likes` | Same demo count as the card. |
| `project-page__save` | Same bookmark toggle as the card. Text button: "Save" and "Saved". |
| `project-page__tools` | Tag chips from `tools`. Section hidden if empty. |
| `project-page__link` | Opens `projectUrl` in a new tab. |

**Behavior (project.js):** read `id` from `?id=`, call `loadProjects()`, find the matching project, fill the page, and set the page title to the project title. Use the browser's Back button to return, which restores the Gallery position and filters if the Gallery keeps its state in the address (stretch goal).

**States:** no extra images (thumbnail only, no arrows); one image; many images; long description; empty `tools` (hide the section); missing `projectUrl` (hide the link); loading; **unknown or missing `id`** ("We couldn't find that project" with a link back to the Gallery); fetch failure (the same error message as the Gallery).
**Accessibility:** one `<h1>`; real alt text on images; `<title>` changes per project; back link first in the page; visible focus on every control.

**No Previous/Next between projects (decided).**

---

## 3. Search and filter bar

**Used on:** Gallery (search also in the header)
**Data inputs:** `title`, `creator`, `major`, `category`, `tools`, `description`, `date`, `likes`, `recommended`

```html
<form class="filter-bar" role="search" onsubmit="return false">
  <div class="filter-bar__field">
    <label for="search-input">Search</label>
    <input id="search-input" class="filter-bar__input" type="search">
  </div>
  <div class="filter-bar__field">
    <label for="major-select">Major</label>
    <select id="major-select" class="filter-bar__select">...</select>
  </div>
  <div class="filter-bar__field">
    <label for="category-select">Category</label>
    <select id="category-select" class="filter-bar__select">...</select>
  </div>
  <div class="filter-bar__field">
    <label for="sort-select">Sort by</label>
    <select id="sort-select" class="filter-bar__select">...</select>
  </div>
  <button class="filter-bar__reset" type="button">Reset</button>
</form>
<p class="results-count" aria-live="polite">Showing 6 of 10 projects</p>
```

**Classes:** `filter-bar`, `filter-bar__field`, `filter-bar__input`, `filter-bar__select`, `filter-bar__reset`, `results-count`.
**Behavior:** every change re-runs `filterProjects` then `sortProjects` and redraws the grid (see `js-module-layout.md`). Filters combine with AND. Options for Major come from the data.
**States:** default; no results (empty state with a "Clear filters" button); filter active (Reset visible); error (see below).
**Edge cases:** blank or space-only search; special characters; zero results; missing `tools`.
**Accessibility:** every control has a visible `<label>`; the results count is `aria-live="polite"` so screen readers announce changes; works with keyboard only.
**Category filter (decided):** a Category dropdown sits next to Major. Options come from the data. It combines with Major and search using AND.

---

## 4. Submission form (demo)

**Used on:** Submission page (one page, all fields at once; decided)
**Data inputs:** writes `title`, `creator`, `major`, `category`, `description`, `tools`, `projectUrl` (and a thumbnail name only)

```html
<form class="submit-form" novalidate>
  <div class="submit-form__field">
    <label for="f-title">Project title</label>
    <input id="f-title" class="submit-form__input" type="text" required aria-describedby="f-title-error">
    <p class="submit-form__error" id="f-title-error" hidden>Enter a project title.</p>
  </div>
  <!-- same pattern: creator, major, category, description, tools, projectUrl -->
  <button class="submit-form__submit" type="submit">Submit project</button>
</form>
```

**Classes:** `submit-form`, `submit-form__field`, `submit-form__input`, `submit-form__error`, `submit-form__submit`, `submit-success`.
**Behavior (form.js):** validate on submit, show every error, move focus to the first invalid field. On success, save to LocalStorage, show the success screen, and make the project appear in the Gallery.
**States:** default; field error; success; saving failed (LocalStorage full or blocked, show a message).
**Edge cases:** very long text; invalid URL; duplicate title; whitespace-only values; storage quota. Real file upload is out of scope, so store only a file name or a small preview.
**Accessibility:** each input has a `<label>`; errors are linked with `aria-describedby`; color is never the only error signal; a visible "Demo only, nothing is uploaded" note at the top.
**Creator (decided):** Creator is a required text field. It is missing in the wireframe, so Shakira needs to add it.

---

## 5. Comments (project page)

**Used on:** the project page, below the description
**Data inputs:** `comments` (`id`, `author`, `text`, `date`) from the JSON, plus comments saved in this browser (LocalStorage `makerHubComments`). Needs `auth.js` for the signed-in name.

```html
<section class="comments" aria-labelledby="comments-title">
  <h2 id="comments-title">Comments (3)</h2>
  <p class="comments__note">Demo: comments are only saved in this browser.</p>
  <ul class="comments__list">
    <li class="comment">
      <span class="comment__author">Aaliyah</span>
      <time class="comment__date" datetime="2026-08-02">Aug 2, 2026</time>
      <p class="comment__text">Level 12 took me ten minutes and I loved it.</p>
    </li>
  </ul>
  <form class="comment-form">
    <label for="comment-input">Add a comment</label>
    <textarea id="comment-input" class="comment-form__input" maxlength="500" rows="3"></textarea>
    <p class="comment-form__count">0 of 500</p>
    <p class="comment-form__error" id="comment-error" hidden>Write a comment before posting.</p>
    <button class="comment-form__submit" type="submit">Post comment</button>
  </form>
</section>
```

| Class | Purpose |
|---|---|
| `comments` | The whole section. |
| `comments__list`, `comment` | The list and one comment, oldest first. |
| `comment__author`, `comment__date`, `comment__text` | Parts of a comment. |
| `comment-form`, `comment-form__input`, `comment-form__submit`, `comment-form__error` | The form. |

**Behavior (comments.js):** load the sample comments from the project, add the ones saved in the browser, sort oldest first, draw the list. On submit: trim the text, reject it if empty or over 500 characters, add `{id, author, text, date}` where `author` is the signed-in name, save to LocalStorage, and redraw.
**Signed out:** show "Log in to comment" with a link, and hide the form. Reading is always allowed.
**Safety:** always set comment text with `textContent`, never `innerHTML`, so `<script>` or HTML in a comment is shown as plain text.
**States:** no comments ("No comments yet. Be the first."); one comment; many comments; a very long word (wraps); the 500-character maximum; empty submit (error, focus returns to the textarea); LocalStorage blocked (show a message and keep the sample comments).
**Accessibility:** the textarea has a visible label; the error is linked with `aria-describedby`; the count is `aria-live="polite"`; a new comment is announced.
**Honest label:** comments are not shared between visitors in this demo. Say so on the page.

---

## 6. Demo login and sign up

**Used on:** header buttons, plus a small dialog or page
**Data inputs:** none from the JSON. The signed-in name is stored in LocalStorage (`makerHubUser`).
**Demo only, no real accounts.** There is no server, so nothing is verified and nothing is shared.

| Class | Purpose |
|---|---|
| `auth-buttons` | "Log in" and "Sign up" in the header. |
| `auth-form` | The form (display name, optional email). |
| `auth-form__note` | The "Demo only" label. |
| `user-menu` | Signed-in state: "Hi, Name" and a Log out button. |

**Behavior (auth.js):** `signUp(name, email)` and `logIn(name)` save the display name; `logOut()` clears it; `getUser()` returns the name or `null`. The header redraws on every change. Comments use the name as the author.
**Rules:** do not add a password field. A fake password box invites people to type a real one. If the design shows one, label it clearly and never store it.
**States:** signed out; signed in; empty name (error); LocalStorage blocked (say login is unavailable); log out.
**Accessibility:** labelled fields; the dialog traps focus and closes with Esc if it is a dialog (a page needs none of that).
**Open:** log in and sign up do the same thing here. One form with two titles is enough.

---

## 7. Light and dark theme

**Used on:** every page; a toggle button in the header
**Data inputs:** none. The choice is saved in LocalStorage (`makerHubTheme`: `light` or `dark`).

**How it works**
- All colors are CSS variables in `css/variables.css`. The light values are on `:root`. The dark values are on `:root[data-theme="dark"]`.
- First visit: follow the visitor's system setting (`prefers-color-scheme`). After they press the toggle: use their choice.
- `theme.js` sets `data-theme` on `<html>` as early as possible, in a small script in the `<head>`, so the page does not flash the wrong theme.

| Class or id | Purpose |
|---|---|
| `theme-toggle` | Button in the header. `aria-pressed` shows whether dark is on, label "Dark mode". |

**Colors to define for both themes:** background, surface (cards), text, muted text, border, link, focus ring, brand red, and the sample colors for category badges.
**Contrast risk:** the official red (#C4262E) works as a fill with white text on a light page, but it is too dark to read as text on a dark background. Use a lighter red for text and links in the dark theme, and keep #C4262E for large fills. Check every pair at 4.5:1 for text.
**Brand:** the brand guide shows the logo on light backgrounds only. Use the official logo files and ask Marketing and Communications if a dark version is allowed.
**States:** light; dark; follows system; saved choice; LocalStorage blocked (follow the system, the toggle still works for this visit).
**Accessibility:** the toggle is a real `<button>`; focus rings stay visible in both themes; `prefers-reduced-motion` stops any theme transition.

---

## Decisions (from the supervisor and team)
1. Likes stay on the card and the project page. The supervisor approved them. They are display-only demo counts.
2. Cards have a fixed height.
3. A missing thumbnail shows the Maker Hub logo.
4. No modal. A card opens its own page (`project.html?id=...`). No Previous/Next buttons.
5. The submission form is one page, not four steps.
6. A Category filter is added next to Major in the Gallery.
7. The Featured row shows projects where `recommended` is true.
8. Creator is a required field in the submission form.
9. The card has a bookmark button that saves the project id in the browser (LocalStorage). Clicking the rest of the card opens the project page.
10. Projects have a `comments` field. Visitors can add comments, saved only in their browser (demo).
11. Demo login and sign up in the header (no real accounts, no passwords).
12. Light and dark theme with a header toggle.

## Still open
1. Shakira: update the wireframes with the Category dropdown (Gallery) and the Creator field (Submission form).
2. Are the project-page tags the same as `tools`? (Assumed yes.)
3. Supervisor: are bookmarks OK? Favorites are on the out-of-scope list.
4. Where do people see their saved projects?
5. Supervisor: comments and accounts are on the out-of-scope list (social features, authentication). Are they approved as demos?
6. Shakira: the wireframes need the comments section, the login and sign-up screens, the signed-in header and a dark theme.
7. Marketing and Communications: is a dark theme and a dark-background logo allowed?
8. Do cards show a comment count? Options: a "Saved only" checkbox in the filter bar, or a Saved page.

---

## Review notes (Week 4 walkthrough, 2026-10-28)
Attendees: Sanskar, Shakira, Aman

| Component | Matches Figma? | Change or risk | Said by | Done? |
|---|---|---|---|---|
| Project card | | | | |
| Project page | | | | |
| Search and filter bar | | | | |
| Comments | | | | |
| Login and sign up | | | | |
| Light and dark theme | | | | |
| Submission form | | | | |
| Empty and error states | | | | |
| Mobile layout | | | | |

Open questions:
- Are the detail-page tags the same as `tools`?
- Where is the latest prototype?

Action items (who, what, by when):
-
