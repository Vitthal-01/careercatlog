/*=====================================================
Career Catalog v2
popup.js
Premium WhatsApp Booking Popup
======================================================*/

"use strict";

/*=========================================
CONFIG
=========================================*/

// Replace with your WhatsApp number
const WHATSAPP_NUMBER = "919876543210";

// Default message
const MESSAGE =
`Hi Career Catalog,

I want to book the ₹99 Career Guidance Call.

Please guide me further.`;

/*=========================================
Elements
=========================================*/

const popup = document.getElementById("bookingPopup");

const openButtons = document.querySelectorAll(
".popup-trigger,#bookCallBtn"
);

const closeButtons = document.querySelectorAll(
".close-popup,.closePopup"
);

const whatsappButton = document.getElementById("popupWhatsapp");

/*=========================================
Functions
=========================================*/

function openPopup(){

if(!popup) return;

popup.classList.add("active");

document.body.style.overflow="hidden";

}

function closePopup(){

if(!popup) return;

popup.classList.remove("active");

document.body.style.overflow="";

}

/*=========================================
Open Popup
=========================================*/

openButtons.forEach(button=>{

button.addEventListener("click",openPopup);

});

/*=========================================
Close Popup
=========================================*/

closeButtons.forEach(button=>{

button.addEventListener("click",closePopup);

});

/*=========================================
Close on Outside Click
=========================================*/

if(popup){

popup.addEventListener("click",(e)=>{

if(e.target===popup){

closePopup();

}

});

}

/*=========================================
ESC Key
=========================================*/

document.addEventListener("keydown",(e)=>{

if(e.key==="Escape"){

closePopup();

}

});

/*=========================================
WhatsApp Booking
=========================================*/

if(whatsappButton){

whatsappButton.addEventListener("click",()=>{

const url=`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(MESSAGE)}`;

window.open(url,"_blank");

});

}

/*=========================================
Floating WhatsApp Button
=========================================*/

const floating=document.getElementById("floatingWhatsapp");

if(floating){

floating.addEventListener("click",(e)=>{

e.preventDefault();

const url=`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(MESSAGE)}`;

window.open(url,"_blank");

});

}

/*=========================================
Sticky Mobile Button
=========================================*/

const sticky=document.querySelector(".mobile-sticky-booking button");

if(sticky){

sticky.addEventListener("click",openPopup);

}

/*=========================================
Auto Popup
=========================================*/

// Show after 5 seconds if user hasn't opened it

let popupShown=false;

setTimeout(()=>{

if(!popupShown){

openPopup();

popupShown=true;

}

},5000);

/*=========================================
Exit Intent Popup (Desktop)
=========================================*/

document.addEventListener("mouseout",(e)=>{

if(e.clientY<=0 && !popupShown){

openPopup();

popupShown=true;

}

});

/*=========================================
Career Compass Skip
=========================================*/

// If user ignores Career Compass for 8 sec

const compass=document.getElementById("careerCompass");

if(compass){

setTimeout(()=>{

const selected=compass.querySelector("input:checked");

if(!selected && !popupShown){

openPopup();

popupShown=true;

}

},8000);

}

/*=========================================
Prevent Multiple Popups
=========================================*/

window.addEventListener("beforeunload",()=>{

sessionStorage.setItem("popupShown","true");

});

if(sessionStorage.getItem("popupShown")){

popupShown=true;

}

/*=========================================
End
=========================================*/
