/**
 * HERQUACORE Motion Engine
 * Lightweight, high-performance IntersectionObserver animation driver
 */
document.addEventListener('DOMContentLoaded', () => {
  // Clear any previous dark theme state
  localStorage.removeItem('vr_theme_preference');
  document.documentElement.classList.remove('dark');

  // Page load fade-in
  document.body.classList.add('page-loaded');

  // Scroll reveal observer
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('motion-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.motion-reveal, .motion-scale').forEach(el => {
    revealObserver.observe(el);
  });

  // Smooth parallax on hero images if present
  const heroImg = document.querySelector('.hero-zoom');
  if (heroImg) {
    window.addEventListener('scroll', () => {
      const scrollY = window.pageYOffset;
      if (scrollY < window.innerHeight) {
        heroImg.style.transform = `scale(1.04) translateY(${scrollY * 0.2}px)`;
      }
    }, { passive: true });
  }

  // Header scroll behavior:
  // - When at the very top (scrollY <= 50): transparent
  // - Once scrolled down (scrollY > 50): solid maroon background, with white Inquire button
  const header = document.getElementById('siteHeader');
  if (header) {
    const updateHeaderState = () => {
      if (window.scrollY > 50) {
        header.classList.remove('header-transparent');
        header.classList.add('header-scrolled');
      } else {
        header.classList.remove('header-scrolled');
        header.classList.add('header-transparent');
      }
    };

    window.addEventListener('scroll', updateHeaderState, { passive: true });
    updateHeaderState(); // Check initial position
  }

  // Dynamic Image Crossfade Slider on Homepage Gallery Cards
  const galleryCards = document.querySelectorAll('.gallery-card');
  galleryCards.forEach((card, cardIndex) => {
    const slides = card.querySelectorAll('.slide-img');
    const dots = card.querySelectorAll('.slide-dot');
    if (slides.length <= 1) return;

    let currentIndex = 0;
    let autoInterval = null;

    const showSlide = (nextIndex) => {
      slides[currentIndex].classList.remove('active');
      slides[currentIndex].style.opacity = '0';
      dots[currentIndex].classList.remove('bg-white');
      dots[currentIndex].classList.add('bg-white/40');

      currentIndex = nextIndex;

      slides[currentIndex].classList.add('active');
      slides[currentIndex].style.opacity = '1';
      dots[currentIndex].classList.add('bg-white');
      dots[currentIndex].classList.remove('bg-white/40');
    };

    // Staggered autoplay so cards don't all flip at the exact same millisecond
    const startCycle = () => {
      autoInterval = setInterval(() => {
        const next = (currentIndex + 1) % slides.length;
        showSlide(next);
      }, 3400 + (cardIndex * 800)); // Organic offset
    };

    const stopCycle = () => {
      if (autoInterval) clearInterval(autoInterval);
    };

    // Start auto cycle
    startCycle();

    // Fast-cycle / interactive advance on hover
    card.addEventListener('mouseenter', () => {
      stopCycle();
      const next = (currentIndex + 1) % slides.length;
      showSlide(next);
    });

    card.addEventListener('mouseleave', () => {
      startCycle();
    });
  });

  // Hero Living Image Sequence (Ken Burns Crossfade Loop)
  const heroSlides = document.querySelectorAll('.hero-slider-wrap .hero-slide');
  if (heroSlides.length > 1) {
    let heroIndex = 0;
    setInterval(() => {
      heroSlides[heroIndex].classList.remove('active');
      heroSlides[heroIndex].style.opacity = '0';

      heroIndex = (heroIndex + 1) % heroSlides.length;

      heroSlides[heroIndex].classList.add('active');
      heroSlides[heroIndex].style.opacity = '1';
    }, 6000); // Crossfades gracefully every 6 seconds
  }
});
