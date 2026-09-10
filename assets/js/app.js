/*=====================================================
Career Catalog v2
app.js
Premium Production Version
======================================================*/

"use strict";

/*=====================================================
Selectors
======================================================*/

const header = document.querySelector(".header");
const progress = document.querySelector(".scroll-progress");
const backTop = document.querySelector(".back-top");
const mobileBtn = document.querySelector(".mobile-menu-button");
const nav = document.querySelector("nav");

const revealElements = document.querySelectorAll(
".feature-card,.career-card,.category-card,.roadmap-card,.certificate-card,.job-card,.insight-card,.audience-card,.intelligence-card"
);

/*=====================================================
Sticky Header
======================================================*/

window.addEventListener("scroll",()=>{

if(window.scrollY>40){

header.classList.add("sticky");

}else{

header.classList.remove("sticky");

}

});

/*=====================================================
Reading Progress
======================================================*/

window.addEventListener("scroll",()=>{

const totalHeight=document.documentElement.scrollHeight-window.innerHeight;

const progressWidth=(window.pageYOffset/totalHeight)*100;

if(progress){

progress.style.width=progressWidth+"%";

}

});

/*=====================================================
Back To Top
======================================================*/

if(backTop){

window.addEventListener("scroll",()=>{

if(window.scrollY>700){

backTop.classList.add("active");

}else{

backTop.classList.remove("active");

}

});

backTop.addEventListener("click",()=>{

window.scrollTo({

top:0,

behavior:"smooth"

});

});

}

/*=====================================================
Reveal Animation
======================================================*/

const observer=new IntersectionObserver(

(entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add("fade-up");

observer.unobserve(entry.target);

}

});

},

{

threshold:.12

}

);

revealElements.forEach(el=>observer.observe(el));

/*=====================================================
Counter Animation
======================================================*/

document.querySelectorAll(".score").forEach(counter=>{

const value=parseInt(counter.innerText);

if(isNaN(value)) return;

let count=0;

const update=()=>{

count+=Math.ceil(value/40);

if(count>=value){

counter.innerText=value;

}else{

counter.innerText=count;

requestAnimationFrame(update);

}

}

update();

});

/*=====================================================
Career Search
======================================================*/

const search=document.querySelector("#careerSearch");

if(search){

search.addEventListener("keyup",()=>{

const keyword=search.value.toLowerCase();

document.querySelectorAll(".career-card").forEach(card=>{

const text=card.innerText.toLowerCase();

card.style.display=text.includes(keyword)?"block":"none";

});

});

}

/*=====================================================
Accordion
======================================================*/

document.querySelectorAll("details").forEach(detail=>{

detail.addEventListener("toggle",()=>{

if(detail.open){

document.querySelectorAll("details").forEach(other=>{

if(other!==detail){

other.removeAttribute("open");

}

});

}

});

});

/*=====================================================
Dark Mode
======================================================*/

const darkToggle=document.querySelector("#darkModeToggle");

if(darkToggle){

if(localStorage.getItem("theme")==="dark"){

document.body.classList.add("dark");

}

darkToggle.addEventListener("click",()=>{

document.body.classList.toggle("dark");

localStorage.setItem(

"theme",

document.body.classList.contains("dark")

?"dark"

:"light"

);

});

}

/*=====================================================
Smooth Anchor Links
======================================================*/

document.querySelectorAll('a[href^="#"]').forEach(anchor=>{

anchor.addEventListener("click",function(e){

const target=document.querySelector(this.getAttribute("href"));

if(target){

e.preventDefault();

target.scrollIntoView({

behavior:"smooth"

});

}

});

});

/*=====================================================
Career Cards Hover
======================================================*/

document.querySelectorAll(".career-card").forEach(card=>{

card.addEventListener("mouseenter",()=>{

card.style.transform="translateY(-12px)";

});

card.addEventListener("mouseleave",()=>{

card.style.transform="";

});

});

/*=====================================================
Category Cards Hover
======================================================*/

document.querySelectorAll(".category-card").forEach(card=>{

card.addEventListener("mouseenter",()=>{

card.classList.add("shadow-lg");

});

card.addEventListener("mouseleave",()=>{

card.classList.remove("shadow-lg");

});

});

/*=====================================================
Button Ripple
======================================================*/

document.querySelectorAll(".btn-primary").forEach(button=>{

button.addEventListener("click",function(e){

const circle=document.createElement("span");

const diameter=Math.max(

this.clientWidth,

this.clientHeight

);

circle.style.width=diameter+"px";

circle.style.height=diameter+"px";

circle.style.left=e.offsetX-diameter/2+"px";

circle.style.top=e.offsetY-diameter/2+"px";

circle.classList.add("ripple");

this.appendChild(circle);

setTimeout(()=>{

circle.remove();

},600);

});

});

/*=====================================================
Mobile Navigation
======================================================*/

if(mobileBtn){

mobileBtn.addEventListener("click",()=>{

nav.classList.toggle("show");

});

}

/*=====================================================
Lazy Images
======================================================*/

const lazyImages=document.querySelectorAll("img[data-src]");

const lazyObserver=new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

const img=entry.target;

img.src=img.dataset.src;

img.removeAttribute("data-src");

lazyObserver.unobserve(img);

}

});

});

lazyImages.forEach(img=>{

lazyObserver.observe(img);

});

/*=====================================================
Current Year
======================================================*/

const year=document.querySelector("#year");

if(year){

year.textContent=new Date().getFullYear();

}

/*=====================================================
Console Branding
======================================================*/

console.log(

"%cCareer Catalog",

"font-size:22px;font-weight:bold;color:#2563eb"

);

console.log(

"%cBuilt for Future Careers 🚀",

"font-size:14px;color:#64748b"

);

/*=====================================================
End
======================================================*/
