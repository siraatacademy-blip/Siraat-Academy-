/* ===== SIRAAT ACADEMY — script.js ===== */

/* ──────────────────────────────────────
   1. NAVBAR — mobile toggle + scroll effect + active link
   ────────────────────────────────────── */
(function initNavbar() {
  const navbar    = document.querySelector('.navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  // Mobile toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const isOpen = navLinks.classList.contains('open');
      hamburger.setAttribute('aria-expanded', isOpen);
      hamburger.querySelectorAll('span').forEach((s, i) => {
        s.style.transform =
          isOpen && i === 0 ? 'translateY(7px) rotate(45deg)' :
          isOpen && i === 1 ? 'opacity:0' :
          isOpen && i === 2 ? 'translateY(-7px) rotate(-45deg)' : '';
        s.style.opacity = isOpen && i === 1 ? '0' : '1';
      });
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.querySelectorAll('span').forEach(s => {
          s.style.transform = '';
          s.style.opacity   = '1';
        });
      });
    });

    // Close menu on outside click
    document.addEventListener('click', e => {
      if (!navbar.contains(e.target)) {
        navLinks.classList.remove('open');
      }
    });
  }

  // Scroll: add shadow + slight background shift
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        navbar.style.boxShadow = '0 4px 24px rgba(0,0,0,0.25)';
        navbar.style.borderBottomColor = 'rgba(201,168,76,0.35)';
      } else {
        navbar.style.boxShadow = 'none';
        navbar.style.borderBottomColor = 'rgba(201,168,76,0.2)';
      }
    });
  }

  // Auto-highlight active page link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
})();


/* ──────────────────────────────────────
   2. SCROLL ANIMATIONS — fade-in on scroll
   ────────────────────────────────────── */
(function initScrollAnimations() {
  const style = document.createElement('style');
  style.textContent = `
    .sa-fade { opacity: 0; transform: translateY(28px); transition: opacity 0.6s ease, transform 0.6s ease; }
    .sa-fade.sa-visible { opacity: 1; transform: translateY(0); }
    .sa-fade-left  { opacity: 0; transform: translateX(-30px); transition: opacity 0.6s ease, transform 0.6s ease; }
    .sa-fade-left.sa-visible { opacity: 1; transform: translateX(0); }
    .sa-fade-right { opacity: 0; transform: translateX(30px); transition: opacity 0.6s ease, transform 0.6s ease; }
    .sa-fade-right.sa-visible { opacity: 1; transform: translateX(0); }
    .sa-scale { opacity: 0; transform: scale(0.92); transition: opacity 0.55s ease, transform 0.55s ease; }
    .sa-scale.sa-visible { opacity: 1; transform: scale(1); }
  `;
  document.head.appendChild(style);

  // Add animation classes to elements
  const targets = [
    { selector: '.feature-card',      cls: 'sa-fade',  delay: true },
    { selector: '.course-card',        cls: 'sa-scale', delay: true },
    { selector: '.testimonial-card',   cls: 'sa-fade',  delay: true },
    { selector: '.pricing-card',       cls: 'sa-scale', delay: true },
    { selector: '.value-item',         cls: 'sa-fade-left', delay: true },
    { selector: '.contact-info-card',  cls: 'sa-fade-left', delay: false },
    { selector: '.contact-form-card',  cls: 'sa-fade-right', delay: false },
    { selector: '.hero-text',          cls: 'sa-fade-left', delay: false },
    { selector: '.hero-card',          cls: 'sa-fade-right', delay: false },
    { selector: '.cta-banner',         cls: 'sa-scale', delay: false },
    { selector: '.section-label',      cls: 'sa-fade',  delay: false },
    { selector: '.about-visual',       cls: 'sa-fade-right', delay: false },
  ];

  targets.forEach(({ selector, cls, delay }) => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add(cls);
      if (delay) el.style.transitionDelay = `${i * 0.08}s`;
    });
  });

  const allAnimated = document.querySelectorAll('.sa-fade, .sa-fade-left, .sa-fade-right, .sa-scale');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('sa-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  allAnimated.forEach(el => observer.observe(el));
})();


/* ──────────────────────────────────────
   3. COUNTER ANIMATION — stat numbers
   ────────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number, [data-count]');
  if (!counters.length) return;

  function animateCounter(el) {
    const raw    = el.textContent.trim();
    const suffix = raw.replace(/[0-9]/g, '');          // e.g. '+', '%'
    const target = parseInt(raw.replace(/\D/g, ''), 10);
    if (isNaN(target)) return;

    const duration = 1600;
    const step     = 16;
    const steps    = duration / step;
    let   current  = 0;

    const timer = setInterval(() => {
      current += target / steps;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current) + suffix;
    }, step);
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();


/* ──────────────────────────────────────
   4. CONTACT FORM — validation + WhatsApp redirect
   ────────────────────────────────────── */
(function initContactForm() {
  const formWrap   = document.getElementById('contactForm');
  const successBox = document.getElementById('formSuccess');
  const submitBtn  = document.querySelector('#contactForm .btn-green');
  if (!formWrap) return;

  // Field error helper
  function showError(fieldId, msg) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    field.style.borderColor = '#e53e3e';
    let err = field.parentElement.querySelector('.field-error');
    if (!err) {
      err = document.createElement('span');
      err.className = 'field-error';
      err.style.cssText = 'color:#e53e3e;font-size:0.78rem;display:block;margin-top:4px;';
      field.parentElement.appendChild(err);
    }
    err.textContent = msg;
  }

  function clearErrors() {
    document.querySelectorAll('.field-error').forEach(e => e.remove());
    document.querySelectorAll('#contactForm input, #contactForm select, #contactForm textarea')
      .forEach(f => f.style.borderColor = '');
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Real-time clear on input
  document.querySelectorAll('#contactForm input, #contactForm select, #contactForm textarea')
    .forEach(f => f.addEventListener('input', () => {
      f.style.borderColor = '';
      const err = f.parentElement.querySelector('.field-error');
      if (err) err.remove();
    }));

  window.handleSubmit = function () {
    clearErrors();

    const firstName = document.getElementById('firstName')?.value.trim();
    const email     = document.getElementById('email')?.value.trim();
    const phone     = document.getElementById('phone')?.value.trim();
    const course    = document.getElementById('course')?.value;
    const age       = document.getElementById('age')?.value;
    const message   = document.getElementById('message')?.value.trim();

    let valid = true;

    if (!firstName) {
      showError('firstName', 'Please enter your first name.');
      valid = false;
    }
    if (!email) {
      showError('email', 'Please enter your email address.');
      valid = false;
    } else if (!validateEmail(email)) {
      showError('email', 'Please enter a valid email address.');
      valid = false;
    }

    if (!valid) return;

    // Build a pre-filled WhatsApp message
    const wa = [
      `Assalamu Alaikum! I found Siraat Academy online and I'd like to enquire.`,
      `*Name:* ${firstName}`,
      email  ? `*Email:* ${email}`   : '',
      phone  ? `*Phone:* ${phone}`   : '',
      course ? `*Course:* ${course}` : '',
      age    ? `*Age Group:* ${age}` : '',
      message ? `*Message:* ${message}` : '',
    ].filter(Boolean).join('\n');

    const waURL = `https://wa.me/918303786873?text=${encodeURIComponent(wa)}`;

    // Show success state
    if (submitBtn) {
      submitBtn.textContent = '✅ Sent! Opening WhatsApp…';
      submitBtn.disabled = true;
    }

    setTimeout(() => {
      formWrap.style.display  = 'none';
      if (successBox) successBox.style.display = 'block';
      window.open(waURL, '_blank');
    }, 600);
  };
})();


/* ──────────────────────────────────────
   5. SMOOTH SCROLL — for anchor links
   ────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* ──────────────────────────────────────
   6. WHATSAPP FLOAT — hide on scroll up, show on scroll down
   ────────────────────────────────────── */
(function initWhatsappFloat() {
  const btn = document.querySelector('.whatsapp-float');
  if (!btn) return;
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < 300) {
      btn.style.opacity   = '1';
      btn.style.transform = 'translateY(0)';
    } else if (y > lastY) {
      // scrolling down — hide
      btn.style.opacity   = '0';
      btn.style.transform = 'translateY(20px)';
    } else {
      // scrolling up — show
      btn.style.opacity   = '1';
      btn.style.transform = 'translateY(0)';
    }
    btn.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    lastY = y;
  });
})();


/* ──────────────────────────────────────
   7. COURSE CARD HOVER — subtle tilt effect
   ────────────────────────────────────── */
(function initCardTilt() {
  document.querySelectorAll('.course-card, .feature-card, .pricing-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect  = card.getBoundingClientRect();
      const x     = e.clientX - rect.left;
      const y     = e.clientY - rect.top;
      const midX  = rect.width  / 2;
      const midY  = rect.height / 2;
      const rotX  = ((y - midY) / midY) * -4;
      const rotY  = ((x - midX) / midX) *  4;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();


/* ──────────────────────────────────────
   8. FAQ ACCORDION — courses page
   ────────────────────────────────────── */
(function initFAQ() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer   = item.querySelector('.faq-answer');
    if (!question || !answer) return;

    answer.style.maxHeight  = '0';
    answer.style.overflow   = 'hidden';
    answer.style.transition = 'max-height 0.35s ease, padding 0.35s ease';

    question.style.cursor = 'pointer';
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-answer').style.maxHeight = '0';
      });
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
})();


/* ──────────────────────────────────────
   9. BACK TO TOP BUTTON — auto inject
   ────────────────────────────────────── */
(function initBackToTop() {
  const btn = document.createElement('button');
  btn.innerHTML    = '↑';
  btn.title        = 'Back to top';
  btn.style.cssText = `
    position: fixed; bottom: 90px; right: 28px; z-index: 199;
    width: 42px; height: 42px; border-radius: 50%;
    background: var(--green-700); color: #fff;
    border: none; font-size: 1.1rem; font-weight: 700;
    cursor: pointer; opacity: 0; transform: translateY(10px);
    transition: opacity 0.3s ease, transform 0.3s ease, background 0.2s ease;
    box-shadow: 0 4px 14px rgba(0,0,0,0.2);
  `;
  btn.addEventListener('mouseenter', () => btn.style.background = 'var(--green-600)');
  btn.addEventListener('mouseleave', () => btn.style.background = 'var(--green-700)');
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.style.opacity   = '1';
      btn.style.transform = 'translateY(0)';
    } else {
      btn.style.opacity   = '0';
      btn.style.transform = 'translateY(10px)';
    }
  });
})();


/* ──────────────────────────────────────
   10. PAGE LOADER — brief branded intro
   ────────────────────────────────────── */
(function initPageLoader() {
  const loader = document.createElement('div');
  loader.id = 'sa-loader';
  loader.style.cssText = `
    position: fixed; inset: 0; z-index: 9999;
    background: var(--green-900);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    transition: opacity 0.5s ease;
  `;
  loader.innerHTML = `
    <div style="font-family:'Playfair Display',serif; font-size:1.6rem; font-weight:700; color:#c9a84c; letter-spacing:0.04em;">Siraat Academy</div>
    <div style="font-size:0.65rem; letter-spacing:0.22em; text-transform:uppercase; color:rgba(255,255,255,0.35); margin-top:6px;">Quran &amp; Tajweed</div>
    <div style="margin-top:24px; width:40px; height:3px; background:rgba(201,168,76,0.2); border-radius:2px; overflow:hidden;">
      <div id="sa-loader-bar" style="height:100%; width:0%; background:#c9a84c; border-radius:2px; transition:width 0.6s ease;"></div>
    </div>
  `;
  document.body.prepend(loader);
  document.body.style.overflow = 'hidden';

  requestAnimationFrame(() => {
    setTimeout(() => {
      const bar = document.getElementById('sa-loader-bar');
      if (bar) bar.style.width = '100%';
    }, 50);
  });

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.style.opacity = '0';
      document.body.style.overflow = '';
      setTimeout(() => loader.remove(), 500);
    }, 700);
  });
})();
