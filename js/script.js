/**
 * Wedding invitation interactivity.
 * Reads all content from `weddingConfig` (js/config.js).
 */
(function () {
  "use strict";

  const cfg = window.weddingConfig || {};
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.addEventListener("DOMContentLoaded", () => {
    renderCoupleNames();
    renderImages();
    initNav();
    initPetals();
    initCountdown();
    initScrollReveal();
    renderGallery();
    renderEventCards();
    renderTimeline();
    renderVenue();
    initRsvpForm();
    initMusic();
    initWelcome();
  });

  function initWelcome() {
    const welcome = document.getElementById("welcome");
    const openButton = document.getElementById("welcomeOpen");
    if (!welcome || !openButton) return;

    document.body.classList.add("welcome-is-open");
    openButton.addEventListener("click", () => {
      const audio = document.getElementById("bgMusic");
      if (audio && cfg.music?.enabled !== false) {
        audio.play().catch(() => {});
      }
      welcome.classList.add("is-closing");
      document.body.classList.remove("welcome-is-open");
      window.setTimeout(() => {
        welcome.hidden = true;
        document.getElementById("hero")?.focus({ preventScroll: true });
      }, 550);
    });
  }

  function renderCoupleNames() {
    const couple = cfg.couple || {};
    const bride = couple.bride || couple.brideFull;
    const groom = couple.groom || couple.groomFull;
    if (!bride || !groom) return;

    const fullNames = `${groom} & ${bride}`;
    const brideInitial = (couple.brideFull || bride).trim().charAt(0).toUpperCase();
    const groomInitial = (couple.groomFull || groom).trim().charAt(0).toUpperCase();
    const heroNames = document.querySelectorAll(".hero__name");
    if (heroNames[0]) heroNames[0].textContent = groom;
    if (heroNames[1]) heroNames[1].textContent = bride;

    const welcomeNames = document.getElementById("welcomeNames");
    if (welcomeNames) welcomeNames.textContent = fullNames;

    const initials = document.getElementById("coupleInitials");
    if (initials) {
      initials.textContent = `${groomInitial} & ${brideInitial}`;
      initials.setAttribute("aria-label", fullNames);
    }

    document.querySelectorAll(".closing__names, .site-footer p:first-child").forEach((el) => {
      el.textContent = fullNames;
    });

    document.title = `${fullNames} — Wedding Invitation`;
    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute(
        "content",
        `Together with their families, ${fullNames} invite you to celebrate their wedding.`
      );
    }

    const heroDate = document.querySelector(".hero__date");
    if (heroDate && cfg.wedding) {
      const date = cfg.wedding.date || "";
      const location = cfg.wedding.address || "";
      heroDate.textContent = [date, location].filter(Boolean).join(" · ");
      const welcomeDate = document.getElementById("welcomeDate");
      if (welcomeDate) welcomeDate.textContent = date;
    }
  }

  function renderImages() {
    const images = cfg.images || {};
    const heroImage = document.querySelector(".hero__photo");
    const closingImage = document.querySelector(".closing__bg img");
    const couple = cfg.couple || {};
    const fullNames = [couple.groomFull || couple.groom, couple.brideFull || couple.bride]
      .filter(Boolean)
      .join(" and ");

    if (heroImage && images.hero) {
      heroImage.src = images.hero;
      heroImage.alt = `${fullNames || "The couple"} sharing a close embrace at golden hour`;
    }
    if (closingImage && images.closing) closingImage.src = images.closing;
  }

  function renderGallery() {
    const track = document.getElementById("galleryTrack");
    if (!track || !Array.isArray(cfg.gallery) || !cfg.gallery.length) return;

    cfg.gallery.forEach((item, index) => {
      const slide = document.createElement("article");
      slide.className = "gallery__slide";
      slide.dataset.index = String(index);
      slide.innerHTML = `<img src="${item.image}" alt="${item.alt}" loading="${index < 3 ? "eager" : "lazy"}" decoding="async">`;
      track.appendChild(slide);
    });

    initGallery();
  }

  function renderEventCards() {
    const container = document.getElementById("eventCards");
    if (!container) return;

    [cfg.wedding, cfg.reception].filter(Boolean).forEach((event, index) => {
      const card = document.createElement("article");
      card.className = `event-card event-card--${index === 0 ? "ceremony" : "reception"} reveal fade-up`;
      card.style.transitionDelay = `${index * 140}ms`;
      card.innerHTML = `
        <p class="event-card__label">${event.label || "Event"}</p>
        <p class="event-card__date">${event.date || ""}</p>
        <p class="event-card__time">${event.time || ""}</p>
        <h3 class="event-card__venue">${event.venue || ""}</h3>
        <p class="event-card__address">${event.address || ""}</p>
        <a class="event-card__link" href="${event.mapsUrl || "#"}" target="_blank" rel="noopener">View location <span aria-hidden="true">&#8594;</span></a>
      `;
      container.appendChild(card);
    });

    initScrollReveal();
  }

  function renderVenue() {
    const venue = cfg.venueSection || {};
    const directions = document.getElementById("venueDirections");
    const map = document.getElementById("venueMap");

    if (directions) directions.href = venue.directionsUrl || venue.mapsUrl || cfg.wedding?.mapsUrl || "#";
    if (!map || !venue.address) return;

    // Google Maps blocks direct iframe embeds on local static pages. OpenStreetMap
    // provides a public embed while the directions link retains the exact venue URL.
    map.src = "https://www.openstreetmap.org/export/embed.html?bbox=83.282%2C17.685%2C83.322%2C17.725&layer=mapnik&marker=17.704%2C83.302";
  }

  function initGallery() {
    const track = document.getElementById("galleryTrack");
    if (!track) return;

    const itemCount = cfg.gallery.length;
    let current = 0;
    let autoplay;
    const slides = track.querySelectorAll(".gallery__slide");
    let isAnimating = false;
    let pointerStart = 0;
    let pointerStartTime = 0;
    let isDragging = false;
    let dragDistance = 0;

    const getOffset = (slideIndex) => {
      let offset = slideIndex - current;
      if (offset > itemCount / 2) offset -= itemCount;
      if (offset < -itemCount / 2) offset += itemCount;
      return offset;
    };

    const updateSlideState = () => {
      slides.forEach((slide, slideIndex) => {
        const offset = getOffset(slideIndex);
        slide.className = "gallery__slide";
        slide.classList.add(
          offset === 0 ? "is-center" :
          offset === -1 ? "is-left" :
          offset === 1 ? "is-right" :
          offset < 0 ? "is-far-left" : "is-far-right"
        );
        slide.setAttribute("aria-hidden", String(Math.abs(offset) > 2));
      });
    };

    const moveTo = (index) => {
      if (isAnimating) return;
      current = (index + itemCount) % itemCount;
      isAnimating = true;
      updateSlideState();
      window.setTimeout(() => { isAnimating = false; }, 650);
    };

    window.showGallerySlide = (index) => moveTo(index);

    const setDragProgress = (distance) => {
      const direction = distance < 0 ? 1 : -1;
      const progress = Math.min(Math.abs(distance) / Math.max(track.parentElement.clientWidth * 0.28, 1), 1);
      const active = slides[current];
      const neighborIndex = (current + direction + itemCount) % itemCount;
      const neighbor = slides[neighborIndex];
      const viewportWidth = track.parentElement.clientWidth;
      const centerWidth = Math.min(viewportWidth * 0.62, 820);
      const centerHeight = Math.min(viewportWidth * 0.34, 440);
      const sideWidth = Math.min(viewportWidth * 0.07, 100);
      const sideHeight = Math.min(viewportWidth * 0.32, 430);
      const sideX = viewportWidth * 0.31 + 20;
      const signedSideX = direction === 1 ? -sideX : sideX;
      const neighborStartX = direction === 1 ? sideX : -sideX;

      track.classList.add("is-dragging");
      active.style.width = `${centerWidth + (sideWidth - centerWidth) * progress}px`;
      active.style.height = `${centerHeight + (sideHeight - centerHeight) * progress}px`;
      active.style.transform = `translate(-50%, -50%) translateX(${distance + (signedSideX - distance) * progress}px) scale(${1 - 0.18 * progress})`;
      neighbor.style.width = `${sideWidth + (centerWidth - sideWidth) * progress}px`;
      neighbor.style.height = `${sideHeight + (centerHeight - sideHeight) * progress}px`;
      neighbor.style.transform = `translate(-50%, -50%) translateX(${neighborStartX + (0 - neighborStartX) * progress}px) scale(${0.82 + 0.18 * progress})`;
    };

    const clearDragStyles = () => {
      slides.forEach((slide) => {
        slide.style.width = "";
        slide.style.height = "";
        slide.style.transform = "";
      });
      track.classList.remove("is-dragging");
    };

    const startAutoplay = () => {
      if (prefersReducedMotion) return;
      clearInterval(autoplay);
      autoplay = setInterval(() => moveTo(current + 1), 4500);
    };
    const stopAutoplay = () => clearInterval(autoplay);

    const carousel = document.getElementById("galleryCarousel");
    carousel.addEventListener("mouseenter", stopAutoplay);
    carousel.addEventListener("mouseleave", startAutoplay);
    carousel.addEventListener("focusin", stopAutoplay);
    carousel.addEventListener("focusout", startAutoplay);

    carousel.addEventListener("pointerdown", (event) => {
      if (isAnimating) return;
      pointerStart = event.clientX;
      pointerStartTime = performance.now();
      isDragging = true;
      dragDistance = 0;
      carousel.classList.add("is-dragging");
      carousel.setPointerCapture(event.pointerId);
      stopAutoplay();
    });
    carousel.addEventListener("pointermove", (event) => {
      if (!isDragging) return;
      dragDistance = event.clientX - pointerStart;
      setDragProgress(dragDistance);
    });
    carousel.addEventListener("pointerup", (event) => {
      if (!isDragging) return;
      dragDistance = event.clientX - pointerStart;
      const elapsed = Math.max(performance.now() - pointerStartTime, 1);
      const velocity = Math.abs(dragDistance) / elapsed;
      const threshold = Math.max(track.parentElement.clientWidth * 0.24, 45);
      const shouldAdvance = Math.abs(dragDistance) > threshold || velocity > 0.65;
      isDragging = false;
      carousel.classList.remove("is-dragging");
      if (shouldAdvance) {
        clearDragStyles();
        moveTo(current + (dragDistance < 0 ? 1 : -1));
      } else {
        clearDragStyles();
        updateSlideState();
      }
      startAutoplay();
    });
    carousel.addEventListener("pointercancel", () => {
      if (!isDragging) return;
      isDragging = false;
      carousel.classList.remove("is-dragging");
      clearDragStyles();
      updateSlideState();
      startAutoplay();
    });

    updateSlideState();
    startAutoplay();
  }

  /* ------------------------------------------------------------------
   * Navigation: scrolled state + mobile menu
   * ------------------------------------------------------------------ */
  function initNav() {
    const nav = document.getElementById("siteNav");
    const toggle = document.getElementById("navToggle");
    const menu = document.getElementById("navMenu");
    if (!nav) return;

    const onScroll = () => {
      nav.classList.toggle("is-scrolled", window.scrollY > 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    if (toggle && menu) {
      toggle.addEventListener("click", () => {
        const isOpen = menu.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(isOpen));
        toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
      });

      menu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
          menu.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
        });
      });
    }
  }

  /* ------------------------------------------------------------------
   * Hero petals: a few soft floating petals, decorative only
   * ------------------------------------------------------------------ */
  function initPetals() {
    if (prefersReducedMotion) return;
    const container = document.getElementById("heroPetals");
    if (!container) return;

    const count = window.innerWidth < 640 ? 5 : 10;
    for (let i = 0; i < count; i++) {
      const petal = document.createElement("span");
      petal.className = "petal";
      petal.style.left = Math.random() * 100 + "%";
      petal.style.animationDuration = 14 + Math.random() * 10 + "s";
      petal.style.animationDelay = Math.random() * 12 + "s";
      petal.style.opacity = (0.3 + Math.random() * 0.35).toFixed(2);
      petal.style.transform = `scale(${(0.6 + Math.random() * 0.7).toFixed(2)})`;
      container.appendChild(petal);
    }
  }

  /* ------------------------------------------------------------------
   * Countdown
   * ------------------------------------------------------------------ */
  function initCountdown() {
    const targetDate = new Date(cfg.weddingDateISO);
    if (isNaN(targetDate.getTime())) return;

    const els = {
      days: document.getElementById("cd-days"),
      hours: document.getElementById("cd-hours"),
      minutes: document.getElementById("cd-minutes"),
      seconds: document.getElementById("cd-seconds")
    };
    const countdownEl = document.getElementById("countdown");
    const afterEl = document.getElementById("celebrationBegun");
    const liveLink = document.getElementById("liveStreamLink");
    if (liveLink && cfg.liveStreamUrl) liveLink.href = cfg.liveStreamUrl;
    let timer;

    function tick() {
      const now = new Date();
      const diff = targetDate - now;

      if (diff <= 0) {
        if (countdownEl) countdownEl.hidden = true;
        if (afterEl) afterEl.hidden = false;
        clearInterval(timer);
        return;
      }

      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      if (els.days) els.days.textContent = String(days).padStart(2, "0");
      if (els.hours) els.hours.textContent = String(hours).padStart(2, "0");
      if (els.minutes) els.minutes.textContent = String(minutes).padStart(2, "0");
      if (els.seconds) els.seconds.textContent = String(seconds).padStart(2, "0");
    }

    tick();
    timer = setInterval(tick, 1000);
  }

  /* ------------------------------------------------------------------
   * Scroll-triggered reveal animations (Intersection Observer)
   * ------------------------------------------------------------------ */
  function initScrollReveal() {
    const items = document.querySelectorAll(".reveal");

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );

    items.forEach((el) => observer.observe(el));
  }

  function renderTimeline() {
    const list = document.getElementById("timelineList");
    if (!list || !Array.isArray(cfg.timeline)) return;

    const fragment = document.createDocumentFragment();
    cfg.timeline.forEach((item, index) => {
      const li = document.createElement("li");
      li.className = "timeline-item reveal fade-up";
      li.style.transitionDelay = `${index * 120}ms`;
      li.innerHTML = `
        <p class="timeline-item__time">${item.time}</p>
        <p class="timeline-item__title">${item.title}</p>
        <p class="timeline-item__desc">${item.description || ""}</p>
      `;
      fragment.appendChild(li);
    });
    list.appendChild(fragment);
    initScrollReveal();
  }

  function initRsvpForm() {
    const form = document.getElementById("rsvpForm");
    const success = document.getElementById("rsvpSuccess");
    const errorEl = document.getElementById("rsvpError");
    if (!form) return;

    const endpoint = (cfg.rsvp && cfg.rsvp.formEndpoint) || form.getAttribute("action");
    if (endpoint) form.setAttribute("action", endpoint);

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (errorEl) errorEl.hidden = true;
      const submitButton = form.querySelector(".rsvp__submit");
      if (submitButton) submitButton.disabled = true;

      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" }
        });
        if (!response.ok) throw new Error("Form service returned an error");
        form.hidden = true;
        if (success) {
          success.hidden = false;
          success.focus();
        }
      } catch (error) {
        if (errorEl) errorEl.hidden = false;
      } finally {
        if (submitButton) submitButton.disabled = false;
      }
    });
  }


  /* ------------------------------------------------------------------
   * Background music: explicit opt-in only, remembered for the tab session
   * ------------------------------------------------------------------ */
  function initMusic() {
    const musicCfg = cfg.music || {};
    const button = document.getElementById("musicToggle");
    const audio = document.getElementById("bgMusic");
    if (!button || !audio) return;

    if (!musicCfg.enabled) {
      button.style.display = "none";
      return;
    }

    if (musicCfg.source) audio.src = musicCfg.source;

    const STORAGE_KEY = "wedding_music_playing";
    let isPlaying = false;

    const setState = (playing) => {
      isPlaying = playing;
      button.setAttribute("aria-pressed", String(playing));
      button.setAttribute("aria-label", playing ? "Pause background music" : "Play background music");
      try {
        sessionStorage.setItem(STORAGE_KEY, playing ? "1" : "0");
      } catch (err) {
        /* sessionStorage may be unavailable; playback still works */
      }
    };

    audio.addEventListener("play", () => setState(true));
    audio.addEventListener("pause", () => setState(false));
    audio.addEventListener("ended", () => setState(false));

    button.addEventListener("click", () => {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play().catch(() => setState(false));
      }
    });

    // Resume only if the visitor already opted in earlier this session —
    // never autoplay with sound on first load.
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") {
        audio.play().catch(() => setState(false));
      }
    } catch (err) {
      /* ignore */
    }
  }
})();
