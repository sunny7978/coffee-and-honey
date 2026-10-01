const nav = document.getElementById("nav");


/* =========================
   NAVIGATION
========================= */

window.addEventListener("scroll", () => {
  if (nav) {
    nav.classList.toggle("scrolled", window.scrollY > 50);
  }
});


/* =========================
   MOBILE NAV
========================= */

const toggle = document.querySelector(".menu-toggle");
const links = document.querySelector(".nav-links");

if (toggle && links) {
  toggle.addEventListener("click", () => {
    links.classList.toggle("open");
  });

  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      links.classList.remove("open");
    });
  });
}


/* =========================
   SCROLL REVEALS
========================= */

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          entry.target.style.transitionDelay =
            `${Math.min((i % 4) * 70, 210)}ms`;

          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12
    }
  );

  revealElements.forEach((el) => observer.observe(el));
} else {
  revealElements.forEach((el) => {
    el.classList.add("visible");
  });
}


/* =========================
   MENU TRANSITION
========================= */

const transition =
  document.getElementById("menuTransition");

const transitionVideo =
  document.getElementById("menuTransitionVideo");


/* =========================
   VIDEO FILES
========================= */

const transitionVideos = {
  coffee: "assets/coffee-transition.mp4",
  burger: "assets/burger-transition.mp4"
};


/* =========================
   TRANSITION STATE
========================= */

let activeCategory = null;
let isTransitioning = false;
let navigationStarted = false;

let safetyTimer = null;
let clickTimer = null;


/* =========================
   RESET VIDEO
========================= */

function resetTransitionVideo() {

  if (!transitionVideo) {
    return;
  }

  transitionVideo.onloadeddata = null;
  transitionVideo.oncanplay = null;
  transitionVideo.onerror = null;
  transitionVideo.onended = null;

  transitionVideo.pause();

  transitionVideo.removeAttribute("src");

  transitionVideo.load();

  transitionVideo.style.opacity = "0";
  transitionVideo.style.display = "none";
}


/* =========================
   GO TO SEPARATE MENU PAGE
========================= */

function goToSeparateMenu(category) {

  if (!category || navigationStarted) {
    return;
  }

  navigationStarted = true;

  clearTimeout(safetyTimer);

  window.location.href =
    `menu.html?category=${encodeURIComponent(category)}`;

}


/* =========================
   CLOSE TRANSITION
========================= */

function closeTransition() {

  if (!transition) {
    return;
  }

  transition.classList.remove("is-active");

  transition.setAttribute(
    "aria-hidden",
    "true"
  );

  resetTransitionVideo();

}


/* =========================
   FINISH TRANSITION
========================= */

function finishTransition() {

  if (!activeCategory) {
    return;
  }

  const category =
    activeCategory;

  isTransitioning = false;

  activeCategory = null;

  closeTransition();

  goToSeparateMenu(category);

}


/* =========================
   SKIP TRANSITION
========================= */

function skipTransition() {

  if (
    !isTransitioning ||
    !activeCategory
  ) {
    return;
  }

  finishTransition();

}


/* =========================
   OPEN CATEGORY
========================= */

function openMenuCategory(category) {

  if (
    !transition ||
    !transitionVideo ||
    !transitionVideos[category]
  ) {
    return;
  }


  /* Prevent duplicate transition */

  if (isTransitioning) {
    return;
  }


  activeCategory =
    category;

  isTransitioning =
    true;

  navigationStarted =
    false;


  clearTimeout(
    safetyTimer
  );


  /* =========================
     SHOW FULLSCREEN OVERLAY
  ========================= */

  transition.classList.add(
    "is-active"
  );

  transition.setAttribute(
    "aria-hidden",
    "false"
  );


  /*
   * IMPORTANT:
   *
   * The fallback is NEVER shown.
   * Only the actual selected MP4
   * is displayed.
   */

  const fallback =
    document.getElementById(
      "menuTransitionFallback"
    );

  if (fallback) {

    fallback.style.display =
      "none";

    fallback.setAttribute(
      "aria-hidden",
      "true"
    );

  }


  /* =========================
     PREPARE VIDEO
  ========================= */

  transitionVideo.pause();

  transitionVideo.removeAttribute(
    "src"
  );

  transitionVideo.load();

  transitionVideo.style.display =
    "block";

  transitionVideo.style.opacity =
    "0";


  /*
   * Load the correct video
   *
   * Coffee:
   * assets/coffee-transition.mp4
   *
   * Burger:
   * assets/burger-transition.mp4
   */

  transitionVideo.src =
    transitionVideos[category];

  transitionVideo.load();


  /* =========================
     VIDEO READY
  ========================= */

  transitionVideo.onloadeddata =
    () => {

      if (
        !isTransitioning ||
        !activeCategory ||
        activeCategory !== category
      ) {
        return;
      }


      /*
       * Fade the real video in.
       */

      requestAnimationFrame(() => {

        transitionVideo.style.opacity =
          "1";

      });


      /*
       * Start video.
       */

      const playPromise =
        transitionVideo.play();


      if (playPromise) {

        playPromise.catch(() => {

          /*
           * Video is muted so autoplay
           * should normally be allowed.
           */

        });

      }

    };


  /* =========================
     VIDEO ENDED
  ========================= */

  transitionVideo.onended =
    () => {

      if (
        isTransitioning &&
        activeCategory === category
      ) {

        finishTransition();

      }

    };


  /* =========================
     VIDEO ERROR
  ========================= */

  transitionVideo.onerror =
    () => {

      /*
       * Do NOT show the fallback.
       *
       * If the video file cannot load,
       * go directly to the appropriate
       * separate menu page.
       */

      if (
        isTransitioning &&
        activeCategory === category
      ) {

        finishTransition();

      }

    };


  /* =========================
     SAFETY TIMEOUT
  ========================= */

  safetyTimer =
    setTimeout(() => {

      if (
        isTransitioning &&
        activeCategory === category &&
        transitionVideo.readyState < 2
      ) {

        finishTransition();

      }

    }, 10000);

}


/* =========================
   COFFEE / BURGER CARDS
========================= */

document
  .querySelectorAll(
    "[data-menu-category]"
  )
  .forEach((card) => {

    const category =
      card.dataset.menuCategory;


    /* =========================
       SINGLE CLICK
    ========================= */

    card.addEventListener(
      "click",
      () => {

        clearTimeout(
          clickTimer
        );


        /*
         * Small delay allows
         * double-click detection.
         */

        clickTimer =
          setTimeout(() => {

            openMenuCategory(
              category
            );

          }, 240);

      }
    );


    /* =========================
       DOUBLE CLICK
    ========================= */

    card.addEventListener(
      "dblclick",
      (event) => {

        event.preventDefault();

        clearTimeout(
          clickTimer
        );


        /*
         * If animation has not started,
         * start it first.
         */

        if (!isTransitioning) {

          openMenuCategory(
            category
          );

        }


        /*
         * Immediately skip animation.
         */

        setTimeout(() => {

          if (
            isTransitioning &&
            activeCategory === category
          ) {

            skipTransition();

          }

        }, 40);

      }
    );

  });


/* =========================
   DOUBLE CLICK ON VIDEO
========================= */

if (transition) {

  transition.addEventListener(
    "dblclick",
    (event) => {

      event.preventDefault();

      skipTransition();

    }
  );

}


/* =========================
   ESC = SKIP
========================= */

document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "Escape" &&
      isTransitioning
    ) {

      skipTransition();

    }

  }
);


/* =========================
   CURSOR GLOW
========================= */

const glow =
  document.querySelector(
    ".cursor-glow"
  );

if (glow) {

  window.addEventListener(
    "pointermove",
    (event) => {

      glow.animate(
        {
          left:
            `${event.clientX}px`,

          top:
            `${event.clientY}px`
        },
        {
          duration: 500,
          fill: "forwards"
        }
      );

    }
  );

}