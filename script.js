const root = document.documentElement;
const hero = document.querySelector(".spill-hero");
const nav = document.getElementById("siteNav");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");

/* ---------------------------------------------------------
   Cup -> Coffee Spill
   ---------------------------------------------------------
   The hero is 190vh tall. During that scroll distance,
   --spill-progress moves from 0 to 1.
--------------------------------------------------------- */

let ticking = false;

function updateSpill(){
  if(!hero) return;

  const rect = hero.getBoundingClientRect();
  const heroDistance = Math.max(720, hero.offsetHeight - window.innerHeight);

  const passed = Math.max(
    0,
    Math.min(
      heroDistance,
      -rect.top
    )
  );

  let progress = passed / heroDistance;

  /*
    Keep the first 8% calm so the visitor sees the cup,
    then accelerate the pour.
  */
  progress = Math.max(0, Math.min(1, (progress - 0.08) / 0.92));

  root.style.setProperty(
    "--spill-progress",
    progress.toFixed(4)
  );

  /*
    Once the cup has poured most of the coffee,
    the nav becomes coffee-toned too.
  */
  nav?.classList.toggle("scrolled", progress > 0.18);

  ticking = false;
}

function onScroll(){
  if(!ticking){
    requestAnimationFrame(updateSpill);
    ticking = true;
  }
}

window.addEventListener("scroll", onScroll, {passive:true});
window.addEventListener("resize", updateSpill);
updateSpill();

/* ---------------------------------------------------------
   Mobile menu
--------------------------------------------------------- */

navToggle?.addEventListener("click", () => {
  navMenu.classList.toggle("open");
});

document.querySelectorAll(".nav-menu a").forEach(link => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
  });
});

/* ---------------------------------------------------------
   Section reveal animations
--------------------------------------------------------- */

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {threshold:0.12}
);

document.querySelectorAll(".reveal").forEach(el => {
  revealObserver.observe(el);
});

/* ---------------------------------------------------------
   Menu filters
--------------------------------------------------------- */

const filterButtons = document.querySelectorAll(".menu-tabs button");
const menuItems = document.querySelectorAll(".menu-item");

filterButtons.forEach(button => {
  button.addEventListener("click", () => {

    filterButtons.forEach(item => item.classList.remove("active"));
    button.classList.add("active");

    const filter = button.dataset.filter;

    menuItems.forEach(item => {
      const shouldHide =
        filter !== "all" &&
        item.dataset.cat !== filter;

      item.classList.toggle("is-hidden", shouldHide);
    });
  });
});
