const nav=document.getElementById("nav");
window.addEventListener("scroll",()=>nav.classList.toggle("scrolled",scrollY>50));

const toggle=document.querySelector(".menu-toggle"), links=document.querySelector(".nav-links");
toggle.addEventListener("click",()=>links.classList.toggle("open"));
document.querySelectorAll(".nav-links a").forEach(a=>a.addEventListener("click",()=>links.classList.remove("open")));

const observer=new IntersectionObserver(entries=>{
  entries.forEach((entry,i)=>{
    if(entry.isIntersecting){
      entry.target.style.transitionDelay=`${Math.min(i%4*70,210)}ms`;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
},{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

const buttons=document.querySelectorAll(".tabs button"), items=document.querySelectorAll(".menu-item");
buttons.forEach(btn=>{
  btn.addEventListener("click",()=>{
    buttons.forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    const filter=btn.dataset.filter;
    items.forEach(item=>{
      item.classList.toggle("hidden",filter!=="all" && item.dataset.cat!==filter);
    });
  });
});

const glow=document.querySelector(".cursor-glow");
window.addEventListener("pointermove",e=>{
  glow.animate({left:`${e.clientX}px`,top:`${e.clientY}px`},{duration:500,fill:"forwards"});
});

// Coffee cup -> coffee spill scroll choreography.
// The first ~85% of one viewport scroll is the animation timeline.
const root = document.documentElement;
const heroSection = document.querySelector(".hero");

function updateCoffeeScene(){
  if(!heroSection) return;

  const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
  const timeline = Math.max(window.innerHeight * 0.95, 620);

  // Animation begins just before the hero finishes, so the transition
  // feels attached to the hero rather than appearing after a blank gap.
  const start = Math.max(0, heroBottom - window.innerHeight * 0.72);
  const progress = Math.max(
    0,
    Math.min(1, (window.scrollY - start) / timeline)
  );

  root.style.setProperty("--coffee-progress", progress.toFixed(3));
}

window.addEventListener("scroll", updateCoffeeScene, {passive:true});
window.addEventListener("resize", updateCoffeeScene);
updateCoffeeScene();
