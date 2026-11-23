// Header search on pages without a gallery: Enter shows the results on the Collections page.
(function () {
  const search = document.getElementById("site-search");
  if (!search) return;
  search.addEventListener("keydown", function (event) {
    const text = search.value.trim();
    if (event.key === "Enter" && text) window.location.href = "collections.html?q=" + encodeURIComponent(text);
  });
})();
