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
