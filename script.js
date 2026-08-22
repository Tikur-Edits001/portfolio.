/* ============================================================
   PORTFOLIO DATA
   To add a new project later, just add another object to this
   array — the grid and lightbox handle the rest automatically.
   ============================================================ */
const PROJECTS = [
  {
    id: "p1",
    title: "Anime Edit — Project 1",
    description: "Anime-focused edit built around pacing, impact frames, and sound design.",
    category: "Anime Edit",
    type: "youtube",
    youtubeId: "xHzsfhahkvY"
  },
  {
    id: "p2",
    title: "Anime Edit — Project 2",
    description: "Motion-graphics-driven anime edit with dynamic transitions.",
    category: "Motion Graphics",
    type: "youtube",
    youtubeId: "zLXJgqWEJvE"
  },
  {
    id: "p3",
    title: "Anime Edit — Project 3",
    description: "Story-driven anime edit focused on visual presentation.",
    category: "Anime Edit",
    type: "youtube",
    youtubeId: "0AjgIGeKEk0"
  },
  {
    id: "p4",
    title: "Instagram Reel",
    description: "Short-form anime edit made for Instagram Reels.",
    category: "Short Form",
    type: "instagram",
    instagramUrl: "https://www.instagram.com/reel/DbYgEUvvZWv/"
  }
];

/* ============================================================
   RENDER PORTFOLIO CARDS
   NOTE: variable names deliberately avoid matching any element
   id (e.g. use "gridEl" not "portfolioGrid") — browsers expose
   elements with an id as implicit globals, and redeclaring that
   same name with const/let throws in some engines and silently
   kills the whole script.
   ============================================================ */
const gridEl = document.getElementById("portfolioGrid");

function youtubeThumb(id){
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

function renderCards(){
  gridEl.innerHTML = PROJECTS.map(project => {
    const thumb = project.type === "youtube"
      ? youtubeThumb(project.youtubeId)
      : "assets/hero-poster.jpg"; // fallback thumb for the instagram card

    return `
      <article class="p-card reveal" data-id="${project.id}" tabindex="0" role="button"
                aria-label="Play ${project.title}">
        <div class="p-thumb">
          <img src="${thumb}" alt="${project.title} thumbnail" loading="lazy">
          <div class="p-play"><span>▶</span></div>
        </div>
        <div class="p-body">
          <span class="p-cat">${project.category}</span>
          <h3 class="p-title">${project.title}</h3>
          <p class="p-desc">${project.description}</p>
        </div>
      </article>
    `;
  }).join("");
}
renderCards();

/* ============================================================
   LIGHTBOX
   ============================================================ */
const lightboxEl = document.getElementById("lightbox");
const lightboxMediaEl = document.getElementById("lightboxMedia");
const lightboxCloseBtn = document.getElementById("lightboxClose");
const lightboxBackdropEl = document.getElementById("lightboxBackdrop");

let instagramScriptLoaded = false;

function loadInstagramEmbedScript(callback){
  if (instagramScriptLoaded){ callback(); return; }
  const scriptTag = document.createElement("script");
  scriptTag.src = "https://www.instagram.com/embed.js";
  scriptTag.async = true;
  scriptTag.onload = () => { instagramScriptLoaded = true; callback(); };
  document.body.appendChild(scriptTag);
}

function openLightbox(project){
  lightboxMediaEl.classList.remove("is-instagram");
  lightboxMediaEl.innerHTML = "";

  if (project.type === "youtube"){
    lightboxMediaEl.innerHTML = `
      <iframe
        src="https://www.youtube.com/embed/${project.youtubeId}?autoplay=1&rel=0"
        title="${project.title}"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen>
      </iframe>`;
  } else if (project.type === "instagram"){
    lightboxMediaEl.classList.add("is-instagram");
    lightboxMediaEl.innerHTML = `
      <blockquote class="instagram-media"
        data-instgrm-permalink="${project.instagramUrl}"
        data-instgrm-version="14"
        style="margin:0; width:100%; max-width:540px;">
      </blockquote>`;
    loadInstagramEmbedScript(() => {
      if (window.instgrm){ window.instgrm.Embeds.process(); }
    });
  }

  lightboxEl.classList.add("is-open");
  document.body.style.overflow = "hidden";
}

function closeLightbox(){
  lightboxEl.classList.remove("is-open");
  lightboxMediaEl.innerHTML = ""; // stop playback
  document.body.style.overflow = "";
}

gridEl.addEventListener("click", (e) => {
  const card = e.target.closest(".p-card");
  if (!card) return;
  const project = PROJECTS.find(p => p.id === card.dataset.id);
  if (project) openLightbox(project);
});

gridEl.addEventListener("keydown", (e) => {
  if (e.key !== "Enter" && e.key !== " ") return;
  const card = e.target.closest(".p-card");
  if (!card) return;
  e.preventDefault();
  const project = PROJECTS.find(p => p.id === card.dataset.id);
  if (project) openLightbox(project);
});

lightboxCloseBtn.addEventListener("click", closeLightbox);
lightboxBackdropEl.addEventListener("click", closeLightbox);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && lightboxEl.classList.contains("is-open")) closeLightbox();
});

/* ============================================================
   NAV: scroll state + mobile toggle + close on link click
   ============================================================ */
const navbarEl = document.getElementById("navbar");
const navToggleBtn = document.getElementById("navToggle");
const navLinksEl = document.getElementById("navLinks");

function onScroll(){
  navbarEl.classList.toggle("is-scrolled", window.scrollY > 40);
}
onScroll();
window.addEventListener("scroll", onScroll, { passive:true });

navToggleBtn.addEventListener("click", () => {
  const isOpen = navLinksEl.classList.toggle("is-open");
  navToggleBtn.setAttribute("aria-expanded", String(isOpen));
});

navLinksEl.querySelectorAll("[data-nav]").forEach(link => {
  link.addEventListener("click", () => {
    navLinksEl.classList.remove("is-open");
    navToggleBtn.setAttribute("aria-expanded", "false");
  });
});

/* ============================================================
   SCROLL REVEAL
   Only hide-then-reveal elements once we've confirmed
   IntersectionObserver exists — otherwise leave everything
   fully visible (progressive enhancement, no broken pages).
   ============================================================ */
if ("IntersectionObserver" in window){
  document.documentElement.classList.add("js-ready");

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll(".reveal, .p-card").forEach(el => revealObserver.observe(el));
}
