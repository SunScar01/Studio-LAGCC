// Project detail page: project.html?id=proj-001
// Needs auth.js, data.js, bookmarks.js and comments.js loaded first.
(function () {
  const MAX_COMMENT = 500;
  const $ = function (id) { return document.getElementById(id); };
  let project = null;
  let comments = [];

  function formatMonth(iso) {
    const date = new Date(iso + "T00:00:00");
    return isNaN(date) ? "" : date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }

  function formatShort(iso) {
    const date = new Date(iso + "T00:00:00");
    return isNaN(date) ? "" : date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  }

  function say(message) {
    const status = $("project-status");
    status.textContent = "";
    setTimeout(function () { status.textContent = message; }, 50);   // a changed text is what gets announced
  }

  function dot(name) {
    const span = document.createElement("span");
    span.className = "avatar-dot";
    span.textContent = name.charAt(0).toUpperCase();
    span.setAttribute("aria-hidden", "true");
    return span;
  }

  function renderHeader() {
    document.title = project.title + " | LAGCC STUDIO";
    $("crumb-title").textContent = project.title;
    $("project-major").textContent = project.major;
    $("project-title").textContent = project.title;
    $("like-count").textContent = project.likes;

    const team = project.team && project.team.length ? project.team : [{ name: project.creator, role: project.role || "" }];
    const creator = $("creator-link");
    creator.textContent = project.creator;
    creator.href = "profile.html?name=" + encodeURIComponent(project.creator);
    const others = team.length - 1;
    $("teammate-count").textContent = others > 0 ? " and " + others + (others === 1 ? " teammate" : " teammates") : "";
    team.slice(0, 3).forEach(function (member) { $("avatar-stack").appendChild(dot(member.name)); });

    $("view-project").href = project.projectUrl || "#";
    $("view-project").hidden = !project.projectUrl;

    $("fact-role").textContent = project.role || "Not listed";
    $("fact-duration").textContent = project.duration || "Not listed";
    $("fact-tools").textContent = project.tools && project.tools.length ? project.tools.join(", ") : "Not listed";
    $("fact-date").textContent = formatMonth(project.date);
    $("project-about").textContent = project.description || "";

    $("team-count").textContent = team.length + (team.length === 1 ? " person made this project" : " people made this project");
    const list = $("team-list");
    team.forEach(function (member) {
      const item = document.createElement("li");
      const text = document.createElement("div");
      const name = document.createElement("strong");
      const role = document.createElement("span");
      name.textContent = member.name;
      role.textContent = member.role;
      text.appendChild(name);
      text.appendChild(role);
      item.appendChild(dot(member.name));
      item.appendChild(text);
      list.appendChild(item);
    });
  }

  function renderImages() {
    const main = $("project-image");
    const all = [project.thumbnail].concat(project.images || []);
    main.onerror = function () { main.onerror = null; main.src = "assets/images/no-image.svg"; };
    main.src = all[0];
    main.alt = project.title + " (image 1 of " + all.length + ")";
    if (all.length < 2) return;

    const strip = $("project-thumbs");
    strip.hidden = false;
    all.forEach(function (src, index) {
      const item = document.createElement("li");
      const button = document.createElement("button");
      const image = document.createElement("img");
      button.type = "button";
      button.setAttribute("aria-label", "Show image " + (index + 1) + " of " + all.length);
      button.setAttribute("aria-pressed", index === 0 ? "true" : "false");
      image.src = src;
      image.alt = "";
      image.onerror = function () {                  // missing file: drop this thumbnail instead of showing a blank one
        item.remove();
        if (strip.children.length < 2) strip.hidden = true;
      };
      button.appendChild(image);
      button.addEventListener("click", function () {
        main.src = src;
        main.alt = project.title + " (image " + (index + 1) + " of " + all.length + ")";
        strip.querySelectorAll("button").forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
        button.setAttribute("aria-pressed", "true");
      });
      item.appendChild(button);
      strip.appendChild(item);
    });
  }

  function setupActions() {
    const save = $("save-button");
    function paintSave() {
      const saved = isBookmarked(project.id);
      save.setAttribute("aria-pressed", String(saved));
      save.textContent = saved ? "Saved" : "Save";
    }
    paintSave();
    save.addEventListener("click", function () {
      toggleBookmark(project.id);
      paintSave();
      say(isBookmarked(project.id) ? "Saved to your profile" : "Removed from saved");
    });

    $("share-button").addEventListener("click", async function () {
      const url = window.location.href;
      try {
        await navigator.clipboard.writeText(url);
        say("Link copied");
        const button = $("share-button");
        button.textContent = "Link copied";
        setTimeout(function () { button.textContent = "Share"; }, 2000);
      } catch (error) {
        window.prompt("Copy this link", url);       // clipboard blocked (for example on plain http)
      }
    });
  }

  function renderComments() {
    const list = $("comment-list");
    list.textContent = "";
    $("comments-total").textContent = comments.length;
    $("comment-pill").textContent = comments.length + (comments.length === 1 ? " comment" : " comments");
    comments.forEach(function (comment) {
      const item = document.createElement("li");
      const body = document.createElement("div");
      const head = document.createElement("p");
      const name = document.createElement("strong");
      const when = document.createElement("span");
      const text = document.createElement("p");
      name.textContent = comment.author;
      when.textContent = formatShort(comment.date);
      text.textContent = comment.text;               // never innerHTML: comments are user text
      head.className = "comment-list__head";
      head.appendChild(name);
      head.appendChild(when);
      body.appendChild(head);
      body.appendChild(text);
      item.appendChild(dot(comment.author));
      item.appendChild(body);
      list.appendChild(item);
    });
  }

  function setupCommentForm() {
    const user = getUser();
    $("comment-login").hidden = Boolean(user);
    $("comment-form").hidden = !user;
    if (!user) return;

    const name = user.name || user.email.split("@")[0];
    $("comment-me").textContent = name.charAt(0).toUpperCase();
    const field = $("comment-text");
    const post = $("comment-post");
    field.addEventListener("input", function () {
      $("comment-count").textContent = field.value.length + "/" + MAX_COMMENT;
      post.disabled = field.value.trim() === "";
    });
    $("comment-form").addEventListener("submit", function (event) {
      event.preventDefault();
      const text = field.value.trim();
      if (!text) return;
      const saved = addComment(project.id, name, text);
      if (!saved) { say("Could not save your comment in this browser"); return; }
      comments = [saved].concat(comments);
      field.value = "";
      $("comment-count").textContent = "0/" + MAX_COMMENT;
      post.disabled = true;
      renderComments();
      say("Comment posted");
    });
  }

  async function init() {
    const id = new URLSearchParams(window.location.search).get("id");
    try {
      const projects = await loadProjects();
      project = projects.find(function (p) { return p.id === id; });
    } catch (error) {
      console.error(error);
    }
    if (!project) {
      $("project-missing").hidden = false;
      return;
    }
    comments = getSavedComments(project.id).slice().reverse().concat(project.comments || []);   // newest first
    renderHeader();
    renderImages();
    setupActions();
    renderComments();
    setupCommentForm();
    $("project-page").hidden = false;
    if (window.location.hash === "#comments") $("comments").scrollIntoView();
  }

  init();
})();
