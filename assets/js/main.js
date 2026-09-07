/*=========================================
  MILESTONE CAREERS
  MAIN JAVASCRIPT
=========================================*/

const header = document.getElementById("header");
const menuBtn = document.getElementById("menuBtn");
const navbar = document.getElementById("navbar");

/*=========================================
  Sticky Header
=========================================*/

function updateHeader() {
    if (window.scrollY > 40) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
}

window.addEventListener("scroll", updateHeader);
updateHeader();

/*=========================================
  Mobile Menu Toggle
=========================================*/

menuBtn.addEventListener("click", () => {

    navbar.classList.toggle("active");

    const icon = menuBtn.querySelector("i");

    if (navbar.classList.contains("active")) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-xmark");
    } else {
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
    }

});

/*=========================================
  Close Menu When Link Clicked
=========================================*/

document.querySelectorAll(".nav-links a").forEach(link => {

    link.addEventListener("click", () => {

        navbar.classList.remove("active");

        const icon = menuBtn.querySelector("i");

        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");

    });

});

/*=========================================
  Active Navigation
=========================================*/

const navLinks = document.querySelectorAll(".nav-links a");

navLinks.forEach(link => {

    link.addEventListener("click", function () {

        navLinks.forEach(item => item.classList.remove("active"));

        this.classList.add("active");

    });

});

/*=========================================
  Smooth Scroll
=========================================*/

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function (e) {

        const target = document.querySelector(this.getAttribute("href"));

        if (!target) return;

        e.preventDefault();

        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });

});

/*=========================================
  Page Loaded
=========================================*/

window.addEventListener("load", () => {

    document.body.classList.add("loaded");

    console.log("✅ Milestone Careers Loaded Successfully");

});
