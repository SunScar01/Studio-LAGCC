// Hero fade: as you scroll down, the hero content (badge, title, buttons, stats) fades out
// and drifts up a little more slowly than the page, like the Adobe Portfolio page.
(function () {
  const hero = document.getElementById("hero");
  if (!hero) return;
  const content = hero.querySelector(".container");

  // people who ask their system for less motion keep the hero as it is
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let waiting = false;

  function update() {
    waiting = false;
    const height = hero.offsetHeight;
    if (height === 0) return;                          // hero is hidden (error or empty state)

    const progress = Math.min(Math.max(window.scrollY / (height * 0.6), 0), 1);   // 0 at the top, 1 after 60% of the hero
    content.style.opacity = String(1 - progress);
    content.style.transform = "translateY(" + Math.round(window.scrollY * 0.25) + "px)";
  }

  function onScroll() {
    if (waiting) return;                               // at most one update per frame
    waiting = true;
    window.requestAnimationFrame(update);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();                                            // also right away, in case the page reloads half-scrolled
})();
