/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

// any CSS you import will output into a single css file (app.css in this case)
import "./styles/app.scss";

// // code for parallax left top right
var scene = document.getElementById("scene");
var parallaxInstance = new Parallax(scene);

// import Atropos library
import Atropos from "atropos";

// // code for scroll to top on devices who have a width <= 768px 
function smoothScrollTo(target, duration) {
  const targetElement = document.querySelector(target);
  if (!targetElement) return;

  const start = window.scrollY;
  const startTime = performance.now();

  function scrollAnimation(currentTime) {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1);

    window.scrollTo(
      0,
      start + (targetElement.getBoundingClientRect().top - start) * progress
    );

    if (progress < 1) {
      requestAnimationFrame(scrollAnimation);
    }
  }

  requestAnimationFrame(scrollAnimation);
}
if (window.localStorage.getItem('previousHash') !== undefined) {
  document.querySelector('#fullpage').classList.remove('scroll-smooth');
  window.location.hash = window.localStorage.getItem('previousHash');
  document.querySelector('#fullpage').classList.add('scroll-smooth');

}
var previousWidth = 999999999;
window.addEventListener("resize", (event) => {
  
  var width = window.innerWidth;
  if (width < previousWidth && width < 768) {
    previousWidth = width;
  }
  if(width > previousWidth && width >= 768 ){
    var hash = window.location.hash
    if (hash != '#home') {
      var defaultUrl = window.location.toString();
      var url = defaultUrl.split("/#")[0];
      window.localStorage.setItem('previousHash', hash);
      window.location = url;
    }
    previousWidth = 999999999;
  }
  if (width <= 768) {
    document.getElementsByClassName("homeSectionMobile")[0].id = "home";
    document
      .querySelector("#menuBurgerHomeHref")
      .addEventListener("click", function (e) {
            e.preventDefault();
            const targetElementId = this.getAttribute("href");
            $("html, body").addClass("scroll-smooth")
            smoothScrollTo(targetElementId, 1000);
      });
  } else {
    document.getElementsByClassName("homeSectionMobile")[0].id = "";
  }
});
document.addEventListener("DOMContentLoaded", (e) => { 
    var width = window.innerWidth;
    if (width <= 768) {
      document.getElementsByClassName("homeSectionMobile")[0].id = "home";
      document
        .querySelector("#menuBurgerHomeHref")
        .addEventListener("click", function (e) {
          e.preventDefault();
          const targetElementId = this.getAttribute("href");
          $("html, body").addClass("scroll-smooth");
          smoothScrollTo(targetElementId, 1000);
        });
    } else {
      document.getElementsByClassName("homeSectionMobile")[0].id = "";
    }
});



// Menu burger open function
$(".menu").click(function () {
  $(this).toggleClass("open");
  $(".overlay").toggleClass("showOverlay");
  spanMenuOverlayActiveChange();
});

$(document).keyup(function(e) {
    if ((e.key === "Escape" || e.key === "Enter" ) && $(".menu").hasClass("open")) {
    closeOverlay();}
});

function closeOverlay() {
    if ( $(".menu").hasClass("open")) {
        $(".overlay").toggleClass("showOverlay");
        $(".menu").toggleClass("open");
}};

var touchScreen = false;
if ('ontouchstart' in window) {
  var touchScreen = true;
}

if (touchScreen) {
  // Initialize
  
} else {
  // Initialize
  document.querySelectorAll(".atropos-works").forEach((element) => {
    Atropos({
      el: element,
      activeOffset: 40,
      duration: 800,
      // shadow
      shadow: true,
      shadowScale: 1,
      shadowOffset: 80,
      // rest of parameters
    });
  });
}


document.querySelectorAll(".atropos-section-1").forEach((element) => {
  Atropos({
    el: element,
    duration: 500,
    shadow: false,
    rotateXInvert: false,
    rotateYInvert: false,
    activeOffset: 40,
    rotateXMax: 10,
    rotateYMax: 10,
    // rest of parameters
  });
});

// SIDEBAR SCRIPT

// Using an observer to detect when the user scrolls the page and which sections is being seen
const sections = document.querySelectorAll("section");
const sidebarSpans = document.querySelectorAll("#sidebar span");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        sidebarSpans.forEach((span) => {
          if (
            entry.target.id ===
            span.parentElement.getAttribute("href").substring(1)
          ) {
            span.parentElement.classList.add("active");
            history.pushState(
              null,
              null,
              span.parentElement.getAttribute("href")
            );
          } else {
            span.parentElement.classList.remove("active");
          }
        });
      } else {
      }
    });
  },
  {
    threshold: 0.9,
  }
);

sections.forEach((element) => {
  observer.observe(element);
});


function spanMenuOverlayActiveChange() {
    var overlay = document.querySelector(".overlay");
    var overlayMenuSpans = overlay.querySelectorAll("span");

    overlayMenuSpans.forEach((span) => {
        span.addEventListener("click", (event) => {closeOverlay();});
        if (span.parentElement.getAttribute("href") === window.location.hash) {
            span.classList.add("active");
        } else {
            span.classList.remove("active");
        }
    });
};

addEventListener("hashchange", (event) => {
    spanMenuOverlayActiveChange();
});


document.getElementById('year').innerText = new Date().getFullYear();

document.addEventListener("scroll", function() {
  var scrollY = window.scrollY;
  if (scrollY > 20) {
    document.querySelector("footer").classList.remove("hide");
  }else{
    document.querySelector("footer").classList.add("hide");
  }
});

