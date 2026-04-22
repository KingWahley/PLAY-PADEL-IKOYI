document.addEventListener('DOMContentLoaded', () => {

  // --- NAVIGATION & ACTIVE LINK LOGIC ---
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const body = document.body;
  const navLinks = document.querySelectorAll('.nav-links a');

  // Normalize path for active link highlighting
  const getNormalizedPath = (path) => {
    return path.replace(/\.html$/, '').replace(/\/$/, '').split('/').pop() || 'index';
  };

  const normalizedCurrentPath = getNormalizedPath(window.location.pathname);

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href === '#') return;
    const normalizedHref = getNormalizedPath(href);
    if (normalizedCurrentPath === normalizedHref) {
      link.classList.add('active');
    }
  });

  // --- HAMBURGER MENU TOGGLE ---
  // Safety check: only runs if hamburger exists on the page
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
      body.classList.toggle('no-scroll');
    });
  }

  // Close menu when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (hamburger && navMenu) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        body.classList.remove('no-scroll');
      }
    });
  });

  // --- WAIVER FORM LOGIC ---
  // This 'if' check prevents the script from crashing on pages without the form
  const submitBtn = document.getElementById("submitBtn");
  
  if (submitBtn) {
    submitBtn.addEventListener("click", function () {
      const checkbox = document.getElementById("accept");
      const signature = document.getElementById("signature");

      if (checkbox && !checkbox.checked) {
        alert("Please accept the terms");
        return;
      }

      if (signature && !signature.value.trim()) {
        alert("Please provide your signature");
        return;
      }

      alert("Waiver signed successfully!");
    });
  }

  // --- NTERSECTION OBSERVER (THE TRIGGER ENGINE) ---
  const observerOptions = { 
    threshold: 0.2 // Trigger when 20% of the element is visible
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add the active class to trigger CSS animations
        entry.target.classList.add('reveal-active');
      }
    });
  }, observerOptions);

  // Tell the observer to watch everything with the 'reveal-on-scroll' class
  document.querySelectorAll('.reveal-on-scroll').forEach(el => {
    observer.observe(el);
  });

  document.querySelectorAll('.reveal-instant').forEach((el, index) => {
    // We add a tiny timeout so the browser has a frame to catch the opacity: 0
    setTimeout(() => {
        el.classList.add('reveal-active');
    }, 100); 
  });

  // --- HOMEPAGE EXPERIENCE SLIDER ---
  const padelSlider = document.querySelector('[data-slider]');

  if (padelSlider) {
    const track = padelSlider.querySelector('[data-slider-track]');
    const prevButton = padelSlider.querySelector('[data-slider-prev]');
    const nextButton = padelSlider.querySelector('[data-slider-next]');

    if (track && prevButton && nextButton) {
      const getStepSize = () => {
        const firstCard = track.querySelector('.card');
        if (!firstCard) return track.clientWidth;

        const cardWidth = firstCard.getBoundingClientRect().width;
        const trackStyles = window.getComputedStyle(track);
        const gap = parseFloat(trackStyles.columnGap || trackStyles.gap || '0');
        return cardWidth + gap;
      };

      const updateSliderButtons = () => {
        const maxScrollLeft = track.scrollWidth - track.clientWidth;
        prevButton.disabled = track.scrollLeft <= 8;
        nextButton.disabled = track.scrollLeft >= maxScrollLeft - 8;
      };

      const scrollTrack = (direction) => {
        track.scrollBy({
          left: getStepSize() * direction,
          behavior: 'smooth'
        });
      };

      prevButton.addEventListener('click', () => scrollTrack(-1));
      nextButton.addEventListener('click', () => scrollTrack(1));

      track.addEventListener('scroll', updateSliderButtons, { passive: true });
      window.addEventListener('resize', updateSliderButtons);

      updateSliderButtons();
    }
  }


  // --- FAQ ACCORDION LOGIC ---
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      
      // Close all other open FAQ items (Optional Accordion behavior)
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
      });
      
      // 2. If it wasn't open, open it
      if (!isOpen) {
        item.classList.add('active');
      }
    });
  });
});
