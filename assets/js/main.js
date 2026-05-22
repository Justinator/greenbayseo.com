console.log('%c Crafted by Insight Creative, Inc. Designed and Developed by Justin Parsons', 'background: #1d1d1d; color: white; padding: 5px 10px;')

const mobileMenu = document.querySelector('.header__mobile-nav');
const hamburger = document.querySelector('.hamburger');
const playButton = document.querySelectorAll('.video-play-button');
const playButtonLink = document.querySelector('.video-play-button__link');
const videoPopup = document.querySelector('.popup--video');
const videoPopupClose = videoPopup?.querySelector('.popup__close');
const popupVideo = videoPopup?.querySelector('.popup__video');
let lastTrigger = null;

// All event listeners
hamburger.addEventListener('click', toggleMobileMenu);

if (videoPopupClose) {
  videoPopupClose.addEventListener('click', closeVideoPopup);
}

// Close dialog when backdrop is clicked
document.addEventListener('click', (e) => {
  if (e.target === videoPopup) {
    closeVideoPopup();
  }
});

// Mobile menu functionality
function toggleMobileMenu() {
  if (mobileMenu.classList.contains('nav-open')) {
    this.setAttribute('aria-expanded', 'false');
    this.setAttribute('aria-label', 'open mobile menu');
    mobileMenu.classList.remove('nav-open');
    hamburger.classList.remove('is-active');
  } else {
    mobileMenu.classList.add('nav-open');
    hamburger.classList.add('is-active');
    this.setAttribute('aria-expanded', 'true');
    this.setAttribute('aria-label', 'close mobile menu');
  }
}

mobileMenu.addEventListener('click', (event) => {
  const dropdownToggle = event.target.closest('.toggle-mobile-dropdown');

  // If the clicked element is not a dropdown toggle, exit early
  if (!dropdownToggle) {
    return;
  }

  const dropdown = dropdownToggle.parentElement;

  if (dropdown.classList.contains('mobile-dropdown-open')) {
    dropdown.setAttribute('aria-expanded', 'false');
    dropdown.setAttribute('aria-label', 'open mobile dropdown menu');
    mobileMenu.classList.remove('has-dropdown-open');
    dropdown.classList.remove('mobile-dropdown-open');
  } else {
    mobileMenu.classList.add('has-dropdown-open');
    dropdown.classList.add('mobile-dropdown-open');
    dropdown.setAttribute('aria-expanded', 'true');
    dropdown.setAttribute('aria-label', 'close mobile dropdown menu');
  }
});

// Desktop dropdown menus
const hasSubMenu = document.querySelectorAll(".has-sub-menu")

hasSubMenu.forEach((link) => {
  // Helper function to set ARIA-expanded attribute
  function setAriaExpandedAttribute(element, value) {
    element.setAttribute("aria-expanded", value);
  };

  const subMenuToggle = document.querySelector(".sub-menu-toggle");
  const subMenuLinks = link.querySelectorAll(".header__sub-menu-link");

  function openSubMenu() {
    link.classList.add("has-sub-menu-open");
    subMenuToggle.classList.add("sub-menu-is-toggled");
    setAriaExpandedAttribute(subMenuToggle, "true");
  };

  function closeSubMenu() {
    link.classList.remove("has-sub-menu-open");
    subMenuToggle.classList.remove("sub-menu-is-toggled");
    setAriaExpandedAttribute(subMenuToggle, "false");
  };

  link.addEventListener("mouseover", openSubMenu);
  link.addEventListener("mouseout", closeSubMenu);

  // ensure that we open our sub menu when sub menu links are tabbed and focused rather than these remaining visually hidden
  subMenuLinks.forEach((subMenuLink) => {
    subMenuLink.addEventListener("focus", openSubMenu);
    subMenuLink.addEventListener("blur", closeSubMenu);
  });
});

// Hybrid fixed/sticky navigation
const siteHeader = document.querySelector(".header")

let scrollState = 0;

const scrollTop = () => window.scrollY;

const scrollDetect = (collapse, expand) => {
  const currentScroll = scrollTop();
  if (currentScroll > scrollState) {
    collapse();
  } else {
    expand();
  }
  scrollState = scrollTop();
};

function collapseNav() {
  siteHeader.classList.remove("expand");
  siteHeader.classList.add("collapse");
}

function expandNav() {
  siteHeader.classList.remove("collapse");
  siteHeader.classList.add("expand");
}

let ticking = false;

window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      scrollDetect(collapseNav, expandNav);
      ticking = false;
    });

    ticking = true;
  }
});

// Video popup functionality
function openVideoPopup(src, title) {
  if (!src || !videoPopup) return;

  // load video and show
  popupVideo.setAttribute('src', src);
  popupVideo.setAttribute('title', title || 'Video');

  videoPopup.showModal();
}

function closeVideoPopup() {
  if (!videoPopup) return;

  // stop playback and hide
  popupVideo.removeAttribute('src');
  popupVideo.removeAttribute('title');

  videoPopup.close();

  // return focus to the trigger if we have it
  if (lastTrigger && typeof lastTrigger.focus === 'function') {
    lastTrigger.focus();
  }
}

// Event delegation: catch clicks from any .video-play-button
document.addEventListener('click', (e) => {
  const trigger = e.target.closest('.video-play-button__link');
  if (!trigger) return;

  // prevent link navigation
  e.preventDefault();

  const src =
    trigger.dataset.src ||
    trigger.getAttribute('href');
  const title =
    trigger.dataset.title ||
    trigger.getAttribute('aria-label') ||
    trigger.textContent.trim();

  lastTrigger = trigger;
  openVideoPopup(src, title);
});

// Native <dialog> handles Escape key automatically, but we might need 
// to ensure the video stops if it's closed via Escape.
if (videoPopup) {
  videoPopup.addEventListener('cancel', () => {
    closeVideoPopup();
  });
}

// Initialize Photoswipe gallery
document.addEventListener('DOMContentLoaded', () => {
  const galleryImages = document.querySelectorAll('.pswp-gallery__image');

  galleryImages.forEach(img => {
    if (img.complete) {
      updateDimensions(img);
    } else {
      img.addEventListener('load', () => updateDimensions(img));
    }
  });

  function updateDimensions(img) {
    const link = img.closest('a.pswp-gallery__image-link');
    if (link) {
      link.setAttribute('data-pswp-width', img.naturalWidth);
      link.setAttribute('data-pswp-height', img.naturalHeight);
    }
  }
});

// Testimonials slider initialization and functionality
var testimonialSwiper = new Swiper(".testimonial__swiper", {
  spaceBetween: 16,
  slidesPerView: 1,
  grabCursor: true,
  keyboard: {
    enabled: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  pagination: {
    el: ".swiper-pagination",
    dynamicBullets: true,
    clickable: true,
  },
  a11y: {
    prevSlideMessage: "Previous slide",
    nextSlideMessage: "Next slide",
  },
});

const popup = document.querySelector('.site-popup');
const closePopupBtn = document.querySelector('.site-popup__close');
const popupBody = document.querySelector('.site-popup__body');

// Initialize popup logic
document.addEventListener('DOMContentLoaded', showHidePopup);

// Add event listeners if elements exist
if (popup && closePopupBtn) {
  closePopupBtn.addEventListener('click', closePopup);
}

if (popupBody) {
  popupBody.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link) {
      closePopup();
    }
  });
}

// Show or hide the popup
function showHidePopup() {
  if (!popup) return;
  if (sessionStorage.getItem("overlayPreference") !== 'hide') {
    popup.showModal();
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  }
}

// Close the popup
function closePopup() {
  if (!popup) return;
  popup.close();
  sessionStorage.setItem("overlayPreference", 'hide');
  document.documentElement.style.overflow = 'auto'
  document.body.style.overflow = 'auto'
}

// Handle Escape key to close popup if open
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && popup && popup.open) {
    closePopup();
  }
});