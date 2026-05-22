function initAll() {
  if (window.__brandhyve_initialized) return;
  window.__brandhyve_initialized = true;

  initCursorSpotlights();
  initCardTilt();
  initLiveDashboard();
  initRoutingSimulator();
  initPricingSwitcher();
  initScrollStats();
  initFaqAccordions();
  initContactForm();
  initIntegrationsScroll();
}

if (document.readyState === 'interactive' || document.readyState === 'complete') {
  initAll();
} else {
  document.addEventListener('DOMContentLoaded', initAll);
}

document.addEventListener('astro:page-load', () => {
  window.__brandhyve_initialized = false;
  initAll();
});

// 1. Cursor-Tracking Gradient Spotlights
function initCursorSpotlights() {
  const cards = document.querySelectorAll('.spotlight-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--x', `${x}px`);
      card.style.setProperty('--y', `${y}px`);
    });
  });
}

// 2. Live Review Request Dashboard Mockup
function initLiveDashboard() {
  const form = document.getElementById('mock-invite-form');
  const invitesContainer = document.getElementById('mock-invites-list');
  const statsReviewsCount = document.getElementById('mock-stat-reviews');
  const statsResponseRate = document.getElementById('mock-stat-response');
  const toast = document.getElementById('mock-toast');

  if (!form || !invitesContainer) return;

  let invitesCount = 3;
  let reviewsCount = 142;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('mock-cust-name');
    const contactInput = document.getElementById('mock-cust-contact');
    const channelSelect = document.getElementById('mock-channel');

    const name = nameInput.value.trim() || 'John Doe';
    const contact = contactInput.value.trim() || 'john@example.com';
    const channel = channelSelect.value;

    if (!name || !contact) return;

    // Clear inputs
    nameInput.value = '';
    contactInput.value = '';

    // Show sending toast
    showToast(`Sending ${channel === 'sms' ? 'Text message' : 'Email'} request to ${name}...`);

    // Add row to mock table
    const row = document.createElement('div');
    row.className = 'dashboard-row pending-row';
    row.innerHTML = `
      <span class="cust-name">${name}</span>
      <span class="cust-contact">${contact}</span>
      <span class="cust-channel channel-${channel}">${channel.toUpperCase()}</span>
      <span class="cust-status status-sent">Sending...</span>
    `;

    // Prepend row
    invitesContainer.insertBefore(row, invitesContainer.firstChild);

    // Simulate review completion after 3.5 seconds
    setTimeout(() => {
      row.querySelector('.cust-status').textContent = 'Completed';
      row.querySelector('.cust-status').className = 'cust-status status-completed';
      row.classList.remove('pending-row');
      
      // Update statistics
      reviewsCount++;
      if (statsReviewsCount) {
        animateNumber(statsReviewsCount, reviewsCount - 1, reviewsCount, 1000);
      }
      
      // Update rating response rate
      if (statsResponseRate) {
        statsResponseRate.textContent = '84.2%';
      }

      showToast(`Success! ${name} just left a 5-star Google review!`);
      triggerSparkles(row);
    }, 3500);
  });

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('visible');
    setTimeout(() => {
      toast.classList.remove('visible');
    }, 3000);
  }

  function triggerSparkles(element) {
    const rect = element.getBoundingClientRect();
    for (let i = 0; i < 8; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';
      sparkle.style.left = `${Math.random() * 80 + 10}%`;
      sparkle.style.top = `${Math.random() * 80 + 10}%`;
      sparkle.style.animation = `sparkleAnim ${Math.random() * 0.6 + 0.4}s ease forwards`;
      element.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 1000);
    }
  }
}

// 3. Smart Feedback Routing Simulator
function initRoutingSimulator() {
  const stars = document.querySelectorAll('.simulator-star');
  const screenInitial = document.getElementById('route-screen-initial');
  const screenPositive = document.getElementById('route-screen-positive');
  const screenNegative = document.getElementById('route-screen-negative');
  const resetBtns = document.querySelectorAll('.route-reset-btn');

  // Interactive screen steps
  const posKeywordsStep = document.getElementById('pos-step-keywords');
  const posResultStep = document.getElementById('pos-step-result');
  const negFormStep = document.getElementById('neg-step-form');
  const negResultStep = document.getElementById('neg-step-result');

  // Interactive controls
  const keywordPills = document.querySelectorAll('.keyword-pill');
  const customKeywordInput = document.getElementById('custom-keyword-input');
  const generateBtn = document.getElementById('generate-review-btn');
  const generatedText = document.getElementById('generated-review-text');
  const copyBtn = document.getElementById('copy-review-btn');
  
  const negativeTextarea = document.getElementById('negative-feedback-text');
  const submitEscalationBtn = document.getElementById('submit-escalation-btn');

  if (!stars.length || !screenInitial) return;

  // Active review state
  let currentGeneratedReview = "";

  // Reset all steps to initial state
  function resetAllSteps() {
    // Clear inputs
    if (customKeywordInput) customKeywordInput.value = "";
    if (negativeTextarea) negativeTextarea.value = "";
    
    // Reset pills selection
    keywordPills.forEach(pill => pill.classList.remove('selected'));
    
    // Reset screen visibilities
    if (posKeywordsStep) posKeywordsStep.classList.remove('hidden');
    if (posResultStep) posResultStep.classList.add('hidden');
    if (negFormStep) negFormStep.classList.remove('hidden');
    if (negResultStep) negResultStep.classList.add('hidden');

    if (copyBtn) copyBtn.textContent = "Copy Review";
    currentGeneratedReview = "";
  }

  // Bind keyword pill clicks
  keywordPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      pill.classList.toggle('selected');
    });
  });

  // Bind review generation
  if (generateBtn && generatedText) {
    generateBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      const selectedPills = Array.from(document.querySelectorAll('.keyword-pill.selected')).map(p => p.dataset.keyword);
      const customVal = customKeywordInput ? customKeywordInput.value.trim() : "";
      
      const keywords = [...selectedPills];
      if (customVal) {
        keywords.push(...customVal.split(/[\s,]+/).filter(Boolean));
      }

      if (keywords.length === 0) {
        currentGeneratedReview = "I had an outstanding experience! The service was incredibly efficient and friendly. The team is highly professional and recommended.";
      } else {
        const joinedKeywords = keywords.map(kw => kw.toLowerCase());
        if (joinedKeywords.length === 1) {
          currentGeneratedReview = `I had an outstanding experience! The service was extremely ${joinedKeywords[0]}. Highly professional and recommended!`;
        } else if (joinedKeywords.length === 2) {
          currentGeneratedReview = `I had an outstanding experience! The team was incredibly ${joinedKeywords[0]} and ${joinedKeywords[1]}. Very satisfied with the service!`;
        } else {
          const last = joinedKeywords.pop();
          currentGeneratedReview = `Highly recommend this service! They were exceptionally ${joinedKeywords.join(', ')}, and ${last}. Will definitely use them again.`;
        }
      }

      generatedText.textContent = currentGeneratedReview;
      posKeywordsStep.classList.add('hidden');
      posResultStep.classList.remove('hidden');
    });
  }

  // Bind copy button
  if (copyBtn) {
    copyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (!currentGeneratedReview) return;
      
      navigator.clipboard.writeText(currentGeneratedReview).then(() => {
        copyBtn.textContent = "Copied!";
        setTimeout(() => {
          copyBtn.textContent = "Copy Review";
        }, 2000);
      }).catch(err => {
        console.error("Clipboard copy failed: ", err);
      });
    });
  }

  // Bind negative support escalation submit
  if (submitEscalationBtn && negFormStep && negResultStep) {
    submitEscalationBtn.addEventListener('click', (e) => {
      e.preventDefault();
      negFormStep.classList.add('hidden');
      negResultStep.classList.remove('hidden');
    });
  }

  stars.forEach(star => {
    // Hover effects
    star.addEventListener('mouseenter', () => {
      const rating = parseInt(star.dataset.rating);
      highlightStars(rating);
    });

    star.addEventListener('mouseleave', () => {
      const activeStar = document.querySelector('.simulator-star.selected');
      if (activeStar) {
        highlightStars(parseInt(activeStar.dataset.rating));
      } else {
        highlightStars(0);
      }
    });

    // Selection
    star.addEventListener('click', () => {
      const rating = parseInt(star.dataset.rating);
      
      stars.forEach(s => s.classList.remove('selected'));
      star.classList.add('selected');
      highlightStars(rating);
      resetAllSteps();

      // Route based on rating
      setTimeout(() => {
        screenInitial.classList.add('hidden');
        if (rating >= 4) {
          screenPositive.classList.remove('hidden');
          screenNegative.classList.add('hidden');
        } else {
          screenNegative.classList.remove('hidden');
          screenPositive.classList.add('hidden');
        }
      }, 300);
    });
  });

  resetBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      stars.forEach(s => s.classList.remove('selected'));
      highlightStars(0);
      resetAllSteps();
      screenInitial.classList.remove('hidden');
      screenPositive.classList.add('hidden');
      screenNegative.classList.add('hidden');
    });
  });

  function highlightStars(rating) {
    stars.forEach(s => {
      const starRating = parseInt(s.dataset.rating);
      if (starRating <= rating) {
        s.classList.add('active');
      } else {
        s.classList.remove('active');
      }
    });
  }
}

// 4. Monthly/Yearly Pricing Switcher
function initPricingSwitcher() {
  const toggle = document.getElementById('billing-toggle');
  const prices = document.querySelectorAll('.pricing-val');
  const periods = document.querySelectorAll('.pricing-period');

  if (!toggle) return;

  toggle.addEventListener('change', () => {
    const isYearly = toggle.checked;

    prices.forEach(price => {
      const monthlyVal = price.dataset.monthly;
      const yearlyVal = price.dataset.yearly;
      
      animateNumber(price, parseInt(price.textContent), isYearly ? parseInt(yearlyVal) : parseInt(monthlyVal), 400);
    });

    periods.forEach(period => {
      period.textContent = isYearly ? '/mo, billed annually' : '/mo';
    });
  });
}

// 5. Scroll-Triggered Stat Counters
function initScrollStats() {
  const counters = document.querySelectorAll('.stat-counter');
  
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const limit = parseInt(target.dataset.limit);
        animateNumber(target, 0, limit, 1500, target.dataset.suffix || '');
        observer.unobserve(target);
      }
    });
  }, { threshold: 0.1 });

  counters.forEach(counter => observer.observe(counter));
}

// 6. Smooth FAQ Accordions
function initFaqAccordions() {
  const items = document.querySelectorAll('.faq-item');

  items.forEach(item => {
    const header = item.querySelector('.faq-header');
    const answer = item.querySelector('.faq-answer');

    if (!header || !answer) return;

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all other FAQs
      items.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('open')) {
          otherItem.classList.remove('open');
          otherItem.querySelector('.faq-answer').style.maxHeight = '0px';
        }
      });

      // Toggle current FAQ
      if (isOpen) {
        item.classList.remove('open');
        answer.style.maxHeight = '0px';
      } else {
        item.classList.add('open');
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      }
    });
  });
}

// Animation helper function for numbers
function animateNumber(element, start, end, duration, suffix = '') {
  let startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const value = Math.floor(progress * (end - start) + start);
    element.textContent = value + suffix;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  }

  window.requestAnimationFrame(step);
}

// 7. 3D Card Parallax Tilt Effect
function initCardTilt() {
  const cards = document.querySelectorAll('.spotlight-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const width = rect.width;
      const height = rect.height;
      
      // Calculate tilt angles (-10 to 10 degrees)
      const rotateX = ((y / height) - 0.5) * -15;
      const rotateY = ((x / width) - 0.5) * 15;
      
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
  });
}

// 8. Premium Contact Form Simulation
function initContactForm() {
  const form = document.getElementById('contact-form');
  const successScreen = document.getElementById('contact-success');
  const resetBtn = document.getElementById('success-reset-btn');

  if (!form || !successScreen) return;

  const submitBtn = form.querySelector('.submit-btn');
  const btnText = submitBtn.querySelector('.btn-text');
  const btnSpinner = submitBtn.querySelector('.btn-spinner');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Set loading state
    submitBtn.disabled = true;
    btnText.classList.add('hidden');
    btnSpinner.classList.remove('hidden');

    // Simulate server dispatch delay
    setTimeout(() => {
      // Toggle screens
      form.classList.add('hidden');
      successScreen.classList.remove('hidden');

      // Reset form fields
      form.reset();

      // Reset loading state for next time
      submitBtn.disabled = false;
      btnText.classList.remove('hidden');
      btnSpinner.classList.add('hidden');
    }, 1800);
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      successScreen.classList.add('hidden');
      form.classList.remove('hidden');
    });
  }
}

// 9. Integration Logos Scroll Physics Animation
function initIntegrationsScroll() {
  const container = document.getElementById('integrations-cloud');
  const section = document.getElementById('integrations');
  if (!container || !section) return;

  const bubbles = container.querySelectorAll('.integration-bubble');
  let viewportHeight = window.innerHeight;
  let isMobile = window.innerWidth < 768;

  window.addEventListener('resize', () => {
    viewportHeight = window.innerHeight;
    isMobile = window.innerWidth < 768;
  });

  function updatePositions() {
    const rect = section.getBoundingClientRect();

    // Skip calculations if section is completely out of view
    if (rect.top > viewportHeight || rect.bottom < 0) {
      return;
    }

    // Find section and viewport vertical center positions
    const sectionCenter = rect.top + rect.height / 2;
    const viewportCenter = viewportHeight / 2;
    const distanceFromCenter = sectionCenter - viewportCenter;

    // Normalize distance relative to viewport range
    const maxDistance = viewportHeight * 0.75;
    const normalizedDistance = Math.min(Math.max(distanceFromCenter / maxDistance, -1), 1);
    const progressAbs = Math.abs(normalizedDistance);

    bubbles.forEach(bubble => {
      // Fetch movement velocity vectors from DOM attributes
      const vx = parseFloat(bubble.dataset.vx || 0);
      const vy = parseFloat(bubble.dataset.vy || 0);

      // Scroll progress mapping: exponential curve for a bouncy eject feel
      const displacement = progressAbs * progressAbs * 130; 

      // Apply horizontal damping on mobile to avoid page overflow
      const scaleFactorX = isMobile ? 0.35 : 1.0;
      const tx = vx * displacement * scaleFactorX;
      
      // Vertical movement slides slightly with scroll direction
      const ty = vy * displacement + (normalizedDistance * 40);

      // Lens blur and opacity fade
      let blurVal = 0;
      if (progressAbs > 0.1) {
        blurVal = (progressAbs - 0.1) * 8.2;
      }
      
      let opacityVal = 1;
      if (progressAbs > 0.15) {
        opacityVal = Math.max(0, 1 - (progressAbs - 0.15) / 0.85);
      }

      // Bubble scaling factor
      const scaleVal = Math.max(0.68, 1 - progressAbs * 0.32);

      // Apply hardware-accelerated 3D transforms
      bubble.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${scaleVal})`;
      if (blurVal === 0) {
        bubble.style.filter = 'none';
      } else {
        bubble.style.filter = `blur(${blurVal}px)`;
      }
      bubble.style.opacity = opacityVal;
    });
  }

  // Passive listener for high-performance scroll handling
  window.addEventListener('scroll', () => {
    window.requestAnimationFrame(updatePositions);
  }, { passive: true });

  // Run initial state calculation
  updatePositions();
}

