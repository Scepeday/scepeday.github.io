// Theme toggle + active nav + back-to-top (shared by home + blog pages)
(() => {
  const root = document.documentElement;

  // Theme
  const themeBtn = document.getElementById("themeBtn");
  const themeIcon = document.getElementById("themeIcon");

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);

    // Moon for light / Sun for dark
    if (themeIcon) {
      themeIcon.innerHTML = theme === "dark"
        ? '<path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" fill="none" stroke="currentColor" stroke-width="2"/>'
        : '<path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z" fill="none" stroke="currentColor" stroke-width="2"/>';
    }
  }

  const saved = localStorage.getItem("theme");
  if (saved === "dark" || saved === "light") setTheme(saved);

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") || "light";
      setTheme(current === "dark" ? "light" : "dark");
    });
  }

  // Mobile nav toggle
  const menuBtn = document.getElementById("menuBtn");
  const navPanel = document.getElementById("navPanel");
  const topbar = document.querySelector(".topbar");
  if (menuBtn && navPanel && topbar) {
    const closeMenu = () => {
      topbar.classList.remove("is-open");
      menuBtn.setAttribute("aria-expanded", "false");
    };

    menuBtn.addEventListener("click", () => {
      const isOpen = topbar.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", String(isOpen));
    });

    navPanel.addEventListener("click", (event) => {
      const link = event.target.closest("a");
      if (link) closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 640) closeMenu();
    });
  }

  // Footer year
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  // Active nav on scroll (only if page has sections)
  const navLinks = [...document.querySelectorAll(".nav-link")].filter(a => a.getAttribute("href")?.startsWith("#"));
  if (navLinks.length) {
    const sections = navLinks.map(a => document.querySelector(a.getAttribute("href"))).filter(Boolean);
    const io = new IntersectionObserver((entries) => {
      const visible = entries.filter(entry => entry.isIntersecting);
      if (!visible.length) return;
      const topEntry = visible.reduce((best, entry) =>
        entry.intersectionRatio > best.intersectionRatio ? entry : best
      );
      navLinks.forEach(a => a.classList.remove("is-active"));
      const active = navLinks.find(a => a.getAttribute("href") === `#${topEntry.target.id}`);
      if (active) active.classList.add("is-active");
    }, { threshold: [0.25, 0.5, 0.75] });
    sections.forEach(s => io.observe(s));
  }

  // Back to top
  const toTop = document.getElementById("toTop");
  const onScroll = () => {
    const y = window.scrollY || document.documentElement.scrollTop;
    if (toTop) toTop.classList.toggle("is-visible", y > 600);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  // Page transition for full-page navigations
  const frame = document.querySelector(".frame");
  const isSameOrigin = (href) => {
    try {
      return new URL(href, window.location.href).origin === window.location.origin;
    } catch {
      return false;
    }
  };

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link || !frame) return;
    if (event.defaultPrevented) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (link.target && link.target !== "_self") return;

    const href = link.getAttribute("href") || "";
    if (!href || href.startsWith("#")) return;
    if (href.startsWith("mailto:") || href.startsWith("tel:")) return;
    if (!isSameOrigin(href)) return;

    const url = new URL(href, window.location.href);
    if (url.pathname === window.location.pathname && url.hash) return;

    event.preventDefault();
    frame.classList.add("is-leaving");
    window.setTimeout(() => {
      window.location.href = url.href;
    }, 180);
  });
})();
