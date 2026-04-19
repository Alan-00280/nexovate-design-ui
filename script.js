/**
 * Wireframe Interpretation - Interactive Script
 * Handles mobile navigation and hover effects
 */

// ──────────────────────────────────────────────────────
// Mobile Navigation
// ──────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function () {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navLeft = document.getElementById('navLeft');

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', function () {
      hamburgerBtn.classList.toggle('active');
      navLeft.classList.toggle('active');
    });
  }

  // Close mobile menu when clicking on a link
  if (navLeft) {
    const navLinks = navLeft.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', function () {
        hamburgerBtn.classList.remove('active');
        navLeft.classList.remove('active');
      });
    });
  }

  // Close mobile menu when clicking outside
  document.addEventListener('click', function (event) {
    const header = document.querySelector('.site-header');
    if (header && !header.contains(event.target)) {
      if (hamburgerBtn) {
        hamburgerBtn.classList.remove('active');
        navLeft.classList.remove('active');
      }
    }
  });
});

// ──────────────────────────────────────────────────────
// Hover Effects on Interactive Elements
// ──────────────────────────────────────────────────────

const interactiveElements = {
  buttons: document.querySelectorAll('.btn, .btn-outline'),
  links: document.querySelectorAll('a:not(.brand)'),
  cards: document.querySelectorAll('.posts-card, .summary-card'),
  footerLinks: document.querySelectorAll('.footer-column a'),
};

// Utility function to add hover effects
function addHoverEffect(elements, config = {}) {
  const defaults = {
    scale: 1.05,
    shadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
    duration: '0.3s',
  };

  const settings = { ...defaults, ...config };

  elements.forEach(element => {
    element.addEventListener('mouseenter', function () {
      this.style.transition = `all ${settings.duration} ease`;
      this.style.transform = `scale(${settings.scale})`;
      this.style.boxShadow = settings.shadow;
    });

    element.addEventListener('mouseleave', function () {
      this.style.transform = 'scale(1)';
      this.style.boxShadow = 'none';
    });
  });
}

// Apply hover effects to different element types
addHoverEffect(interactiveElements.buttons, {
  scale: 1.02,
  shadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
});

addHoverEffect(interactiveElements.cards, {
  scale: 1.03,
  shadow: '0 16px 32px rgba(0, 0, 0, 0.1)',
});

// ──────────────────────────────────────────────────────
// Navigation Links Hover Effect
// ──────────────────────────────────────────────────────

document.querySelectorAll('.nav-left a').forEach(link => {
  link.addEventListener('mouseenter', function () {
    this.style.transition = 'color 0.2s ease';
    this.style.color = '#555';
  });

  link.addEventListener('mouseleave', function () {
    this.style.color = '#000';
  });
});

// ──────────────────────────────────────────────────────
// Smooth Scroll for Internal Links
// ──────────────────────────────────────────────────────

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    
    // Only prevent default for internal anchor links
    if (href.length > 1) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }
  });
});

// ──────────────────────────────────────────────────────
// Responsive Adjustments
// ──────────────────────────────────────────────────────

window.addEventListener('resize', function () {
  // Close mobile menu on desktop resize
  if (window.innerWidth > 720) {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navLeft = document.getElementById('navLeft');
    if (hamburgerBtn) {
      hamburgerBtn.classList.remove('active');
      navLeft.classList.remove('active');
    }
  }
});

// ──────────────────────────────────────────────────────
// Intersection Observer for Scroll Animations
// ──────────────────────────────────────────────────────

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px',
};

const observer = new IntersectionObserver(function (entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Apply fade-in animation to sections
document.querySelectorAll('section').forEach(section => {
  section.style.opacity = '0';
  section.style.transform = 'translateY(20px)';
  section.style.transition = 'all 0.6s ease';
  observer.observe(section);
});

// ──────────────────────────────────────────────────────
// Posts Carousel Auto-Play with Dots
// ──────────────────────────────────────────────────────

function initializePostsCarousel() {
  const postsGrid = document.getElementById('postsGrid');
  const postsDots = document.getElementById('postsDots');
  const postsCards = postsGrid.querySelectorAll('.posts-card');
  
  if (!postsGrid || !postsDots || postsCards.length === 0) return;

  let currentSlide = 0;
  let autoPlayInterval;
  let isMobile = window.innerWidth <= 890;

  // Create dots
  postsCards.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.className = `posts-dot ${index === 0 ? 'active' : ''}`;
    dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
    dot.addEventListener('click', () => goToSlide(index));
    postsDots.appendChild(dot);
  });

  const dots = postsDots.querySelectorAll('.posts-dot');

  // Function to go to specific slide
  function goToSlide(slideIndex) {
    currentSlide = slideIndex;
    const cardWidth = postsCards[0].offsetWidth;
    postsGrid.scrollLeft = cardWidth * slideIndex;
    updateDots();
    // Reset auto-play timer
    if (isMobile) {
      clearInterval(autoPlayInterval);
      startAutoPlay();
    }
  }

  // Function to go to next slide
  function nextSlide() {
    if (currentSlide < postsCards.length - 1) {
      goToSlide(currentSlide + 1);
    } else {
      goToSlide(0); // Loop back to first
    }
  }

  // Function to update active dot
  function updateDots() {
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentSlide);
    });
  }

  // Auto-play function
  function startAutoPlay() {
    if (!isMobile) return;
    autoPlayInterval = setInterval(() => {
      nextSlide();
    }, 4000); // Change slide every 4 seconds
  }

  // Update slide on manual scroll
  postsGrid.addEventListener('scroll', () => {
    const cardWidth = postsCards[0].offsetWidth + 16;
    const newSlide = Math.round(postsGrid.scrollLeft / cardWidth);
    if (newSlide !== currentSlide && newSlide < postsCards.length) {
      currentSlide = newSlide;
      updateDots();
      // Reset auto-play when user scrolls manually
      if (isMobile) {
        clearInterval(autoPlayInterval);
        startAutoPlay();
      }
    }
  });

  // Hide dots and stop auto-play on desktop
  function handleResize() {
    const wasOnMobile = isMobile;
    isMobile = window.innerWidth <= 720;

    if (isMobile && !wasOnMobile) {
      // Switched to mobile
      postsDots.style.display = 'flex';
      startAutoPlay();
    } else if (!isMobile && wasOnMobile) {
      // Switched to desktop
      postsDots.style.display = 'none';
      clearInterval(autoPlayInterval);
    }
  }

  window.addEventListener('resize', handleResize);

  // Initial setup
  if (!isMobile) {
    postsDots.style.display = 'none';
  } else {
    startAutoPlay();
  }
}

// Initialize carousel when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePostsCarousel);
} else {
  initializePostsCarousel();
}

console.log('✓ Interactive script loaded successfully');
