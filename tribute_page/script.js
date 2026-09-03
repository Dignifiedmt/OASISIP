(function() {
  'use strict';

  // DOM refs
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const themeToggle = document.getElementById('themeToggle');
  const backToTop = document.getElementById('backToTop');
  const navLinks = document.querySelectorAll('.nav-link');
  const timelineItems = document.querySelectorAll('.timeline-item');

  // Mobile nav toggle
  function toggleNav(expanded) {
    const isOpen = expanded !== undefined ? expanded : navMenu.classList.contains('open');
    if (isOpen) {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    } else {
      navMenu.classList.add('open');
      navToggle.setAttribute('aria-expanded', 'true');
    }
  }

  navToggle.addEventListener('click', function(e) {
    e.stopPropagation();
    toggleNav();
  });

  navLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      if (window.innerWidth <= 768) {
        toggleNav(true);
      }
    });
  });

  document.addEventListener('click', function(e) {
    if (window.innerWidth <= 768) {
      const isNavClick = navMenu.contains(e.target) || navToggle.contains(e.target);
      if (!isNavClick && navMenu.classList.contains('open')) {
        toggleNav(true);
      }
    }
  });

  // Theme system
  function getPreferredTheme() {
    const stored = localStorage.getItem('theme');
    if (stored) return stored;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  const initialTheme = getPreferredTheme();
  setTheme(initialTheme);

  themeToggle.addEventListener('click', function() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
  });

  if (window.matchMedia) {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener('change', function(e) {
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  // Scroll spy
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    let currentId = '';
    const scrollY = window.scrollY + 120;

    sections.forEach(function(section) {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(function(link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + currentId) {
        link.classList.add('active');
      }
    });
  }

  // Scroll reveal
  function revealTimeline() {
    const windowHeight = window.innerHeight;
    timelineItems.forEach(function(item) {
      const rect = item.getBoundingClientRect();
      if (rect.top < windowHeight - 120) {
        item.classList.add('visible');
      }
    });
  }

  // Back to top
  function handleBackToTop() {
    if (window.scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  backToTop.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Throttle
  function throttle(fn, delay) {
    let lastCall = 0;
    return function(...args) {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        fn.apply(this, args);
      }
    };
  }

  const onScroll = throttle(function() {
    updateActiveNav();
    revealTimeline();
    handleBackToTop();
  }, 80);

  window.addEventListener('scroll', onScroll, { passive: true });

  // Initial load
  setTimeout(function() {
    revealTimeline();
    updateActiveNav();
    handleBackToTop();
  }, 200);

  window.addEventListener('resize', function() {
    revealTimeline();
  }, { passive: true });

  // Keyboard: close nav with Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      toggleNav(true);
      navToggle.focus();
    }
  });

  // Reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReducedMotion.matches) {
    timelineItems.forEach(function(item) {
      item.classList.add('visible');
    });
  }

  // ============================================================
  // GALLERY SLIDER
  // ============================================================
  const slider = document.getElementById('gallerySlider');
  const prevBtn = document.getElementById('galleryPrev');
  const nextBtn = document.getElementById('galleryNext');
  const dotsContainer = document.getElementById('galleryDots');
  const slides = slider.querySelectorAll('.gallery-slide');
  let currentIndex = 0;
  const totalSlides = slides.length;
  let autoSlideInterval;

  // Create dots
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('span');
    dot.className = 'gallery-dot' + (i === 0 ? ' active' : '');
    dot.dataset.index = i;
    dot.addEventListener('click', function() {
      goToSlide(parseInt(this.dataset.index));
    });
    dotsContainer.appendChild(dot);
  }

  const dots = dotsContainer.querySelectorAll('.gallery-dot');

  function goToSlide(index) {
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;
    currentIndex = index;
    slider.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
    dots.forEach(function(dot, i) {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  prevBtn.addEventListener('click', function() {
    prevSlide();
    resetAutoSlide();
  });

  nextBtn.addEventListener('click', function() {
    nextSlide();
    resetAutoSlide();
  });

  // Auto-slide
  function startAutoSlide() {
    if (autoSlideInterval) clearInterval(autoSlideInterval);
    if (prefersReducedMotion.matches) return;
    autoSlideInterval = setInterval(nextSlide, 5000);
  }

  function resetAutoSlide() {
    startAutoSlide();
  }

  // Pause on hover/touch
  const wrapper = document.querySelector('.gallery-slider-wrapper');
  wrapper.addEventListener('mouseenter', function() {
    if (autoSlideInterval) clearInterval(autoSlideInterval);
  });
  wrapper.addEventListener('mouseleave', function() {
    startAutoSlide();
  });

  // Keyboard support for gallery
  document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') {
      prevSlide();
      resetAutoSlide();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
      resetAutoSlide();
    }
  });

  // Touch/swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;
  slider.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  slider.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      resetAutoSlide();
    }
  }, { passive: true });

  // Start auto-slide
  startAutoSlide();

  // Ensure first slide is active
  goToSlide(0);

})();