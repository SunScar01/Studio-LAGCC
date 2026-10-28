# Implementation Specs (Week 4)

Fields refer to `docs/data-schema.md`. Components match `docs/component-inventory.md`.

## Naming conventions
- **Files:** lowercase, one job each (`filter.js`, `modal.js`, `components.css`).
- **CSS classes:** kebab-case, BEM style. Block `project-card`, part `project-card__title`, variant `project-card--featured`, state `is-hidden`.
- **IDs:** only for things JS grabs once (`#search-input`). Style with classes.
- **JS:** camelCase for variables and functions (`renderCard`, verb first), UPPER_SNAKE for constants.
- **Data attributes:** `data-project-id`.
- **CSS variables:** in `css/variables.css`, by purpose: `--color-brand-red`, `--space-4`, `--font-heading`.
- **Comments:** explain why, not what.

---

## 1. Project card

**Used on:** Home (Featured), Gallery, Detail ("More Projects")
**Data inputs:** `id`, `title`, `creator`, `major`, `category`, `thumbnail`, `likes`

```html
<li class="project-card-item">
  <button class="project-card" type="button" data-project-id="proj-001">
    <img class="project-card__image" src="..." alt="" width="400" height="250" loading="lazy">
    <span class="project-card__body">
      <span class="project-card__title">Puzzle Game</span>
      <span class="project-card__creator">by Jason</span>
      <span class="project-card__footer">
        <span class="project-card__meta">Software Development · Game Design</span>
        <span class="project-card__likes"><svg aria-hidden="true">...</svg>120</span>
      </span>
    </span>
  </button>
</li>
```
Cards sit in `<ul class="project-grid">`.

| Class | Purpose |
|---|---|
| `project-grid` | List holding the cards. CSS grid, responsive columns. |
| `project-card` | The clickable button. Border, radius, hover. |
| `project-card__image` | Thumbnail, fixed ratio, `object-fit: cover`. |
| `project-card__title` | Clamp to 2 lines. |
| `project-card__creator` | "by Name". Hidden if missing. |
| `project-card__meta` | Major and category. |
| `project-card__likes` | Heart icon plus count. Display only. 0 if missing. |

**States:** default; hover (lift, off under `prefers-reduced-motion`); focus (3px outline, never removed); pressed (opens modal, focus returns to the card on close); long title (2 lines then ellipsis); missing thumbnail (show the Maker Hub logo as the placeholder, via `onerror` or when `thumbnail` is empty); loading (6 skeleton cards).
**Card size (decided):** fixed card height. Image area has a fixed ratio, the title clamps to 2 lines and the creator to 1 line, so every card in a row is the same height.
**Accessibility:** a `<button>` for keyboard access; `alt=""` because the title is beside it; the heart is `aria-hidden` and the count is read as text; contrast 4.5:1 or higher.

---

## 2. Project modal

**Used on:** Home, Gallery
**Data inputs:** `title`, `creator`, `major`, `category`, `date`, `description`, `tools`, `thumbnail`, `images`, `projectUrl`, `likes`

```html
<div class="modal-backdrop" data-modal-backdrop>
  <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <button class="modal__close" type="button" aria-label="Close project details">X</button>
    <div class="modal__images">
      <img class="modal__image" src="..." alt="Puzzle Game, image 1 of 3">
    </div>
    <div class="modal__body">
      <h2 class="modal__title" id="modal-title">Puzzle Game</h2>
      <span class="modal__likes">120</span>
      <p class="modal__meta">by Jason · Software Development · Game Design · Jul 26, 2026</p>
      <p class="modal__description">...</p>
      <ul class="modal__tools"><li class="modal__tool">Unity</li></ul>
      <a class="modal__link" href="..." target="_blank" rel="noopener">View project</a>
    </div>
  </div>
</div>
```

| Class | Purpose |
|---|---|
| `modal-backdrop` | Dark overlay. A click on it closes the modal. |
| `modal` | The dialog box. Max width, scrolls inside if tall. |
| `modal__close` | X button, top right, 44px target. |
| `modal__images` | Thumbnail plus `images`. Arrows between this project's images only if there is more than one (not between projects). |
| `modal__title`, `modal__meta`, `modal__description` | Text. No clamp on the title. |
| `modal__likes` | Same demo count as the card. |
| `modal__tools` | Tag chips from `tools`. Section hidden if empty. |
| `modal__link` | Opens `projectUrl` in a new tab. |

**Behavior (modal.js)**
- Open: fill the fields, show the modal, move focus to the close button, lock page scroll.
- Close: X button, Esc key, or a click on the backdrop. Hide the modal, unlock scroll, return focus to the card that opened it.
- Tab stays inside the modal while it is open.

**No Previous/Next between projects (decided).** The modal shows one project. To see another, close it and open a different card.

**States:** no extra images (thumbnail only, no arrows); one image; many images; long description (modal body scrolls); empty `tools` (hide the section); missing `projectUrl` (hide the link); opens on mobile (full width, close button stays visible).
**Accessibility:** `role="dialog"`, `aria-modal`, labelled by the title; real alt text on images; visible focus on every control; background content is not reachable while open.

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

## Decisions (from the supervisor and team)
1. Likes stay on the card and in the modal. The supervisor approved them. They are display-only demo counts.
2. Cards have a fixed height.
3. A missing thumbnail shows the Maker Hub logo.
4. No Previous/Next buttons between projects in the modal.
5. The submission form is one page, not four steps.
6. A Category filter is added next to Major in the Gallery.
7. The Featured row shows projects where `recommended` is true.
8. Creator is a required field in the submission form.

## Still open
1. Shakira: update the wireframes with the Category dropdown (Gallery) and the Creator field (Submission form).
2. Are the detail-page tags the same as `tools`? (Assumed yes.)

---

## Review notes (Week 4 walkthrough, 2026-10-28)
Attendees: Sanskar, Shakira, Aman

| Component | Matches Figma? | Change or risk | Said by | Done? |
|---|---|---|---|---|
| Project card | | | | |
| Project modal | | | | |
| Search and filter bar | | | | |
| Submission form | | | | |
| Empty and error states | | | | |
| Mobile layout | | | | |

Open questions:
- Are the detail-page tags the same as `tools`?
- Where is the latest prototype?

Action items (who, what, by when):
-
