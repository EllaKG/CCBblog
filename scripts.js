// Simple interactivity for the CIS Project (scripts.js)
document.addEventListener('DOMContentLoaded', () => {
  const refreshIcons = () => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  };

  const makeAvatar = (name, bg = '#ffd1ec', fg = '#0b1f5a') => {
    const initials = name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();

    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>
      <rect width='100%' height='100%' fill='${bg}'/>
      <circle cx='100' cy='76' r='34' fill='${fg}' fill-opacity='0.22'/>
      <rect x='32' y='122' width='136' height='58' rx='29' fill='${fg}' fill-opacity='0.18'/>
      <text x='50%' y='56%' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='64' font-weight='700' fill='${fg}'>${initials}</text>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  };

  // theme toggle with saved preference
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('siteTheme');
  const preferredTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
  const initialTheme = savedTheme || preferredTheme;

  const applyTheme = (theme) => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('siteTheme', theme);
    if (themeToggle) {
      themeToggle.value = theme;
    }
  };

  applyTheme(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener('change', (e) => {
      applyTheme(e.target.value);
    });
  }

  const riderProfiles = {
    'Ella Grier': { role: 'All-rounder', favoriteRace: 'Redlands Bicycle Classic', hometown: 'Goochland, VA', photo: 'assets/media/00331-DSCF1012-1.jpg', photoPosition: 'center 24%' },
    'Sabrina Hayes': { role: 'Sprinter', favoriteRace: 'Tulsa Tough', hometown: 'Warrenton, VA', photo: 'assets/media/00336-DSCF1022-1.jpg', photoPosition: 'center 24%' },
    'Jorja Bond': { role: 'All-rounder', favoriteRace: 'Tour de Bloom', hometown: 'Boulder, CO', photo: 'assets/media/00298-DSCF0926-1.jpg', photoPosition: 'center 24%' },
    'Kat Rusche': { role: 'Time Trial Specialist', favoriteRace: 'Redlands', hometown: 'Boston, MA', photo: 'assets/images/00289-DSCF0907-1.jpg', photoPosition: 'center 24%' },
    'Kat Sarkisov': { role: 'GC Contender', favoriteRace: 'Tulsa Tough', hometown: 'Maryland', photo: 'assets/media/00325-DSCF0993-1.jpg', photoPosition: 'center 24%' },
    'Alyssa Sarkisov': { role: 'Breakaway Specialist', favoriteRace: 'Road Nationals', hometown: 'Maryland', photo: 'assets/images/00278-DSCF0885-1.jpg', photoPosition: 'center 24%' },
    'Bridget Ciambotti': { role: 'Puncheur', favoriteRace: 'Armed Forces', hometown: 'Charlottesville, VA', photo: 'assets/media/00311-DSCF0963-1.jpg', photoPosition: 'center 24%' },
    'Lizzy Gunsalus': { role: 'CX Specialist', favoriteRace: 'Pan Ams', hometown: 'Boston, MA', photo: 'assets/media/00307-DSCF0948-1.jpg', photoPosition: 'center 24%' },
    'Lyllie Sonnemann': { role: 'Domestique', favoriteRace: 'Sea Otter', hometown: 'Madison, WA', photo: 'assets/media/00346-DSCF1046-1.jpg', photoPosition: 'center 24%' },
    'Lily Edwards': { role: 'Climber', favoriteRace: 'Redlands', hometown: 'D.C., VA', photo: 'assets/media/00319-DSCF0979-1.jpg', photoPosition: 'center 24%' },
    'Ella Brennaman': { role: 'Leadout', favoriteRace: 'Redlands Bicycle Classic', hometown: 'Ashville, NC', photo: 'assets/images/00272-DSCF0861-1.jpg', photoPosition: 'center 22%' }
  };

  const heading = document.querySelector('h1');
  if (heading) {
    heading.style.cursor = 'pointer';
    heading.addEventListener('click', () => {
      heading.textContent = heading.textContent === 'Welcome to the CIS Project' ? 'Thanks for visiting!' : 'Welcome to the CIS Project';
    });
  }

  // create a simple menu bar dynamically
  // (Now handled by React - removed to avoid duplicate menus)

  // function to add live updates to the blog
  // (Now handled by React - removed to avoid conflicts)

  // add bike animation above roster
  const rosterH2 = document.getElementById('roster');
  if (rosterH2) {
    const bikeDiv = document.createElement('div');
    bikeDiv.className = 'bike-animation';
    bikeDiv.innerHTML = '<i data-lucide="bike" class="icon" aria-hidden="true"></i>';
    rosterH2.parentNode.insertBefore(bikeDiv, rosterH2);
    refreshIcons();

    // add click listener for confetti
    bikeDiv.addEventListener('click', () => {
      confetti();
    });
  }

  // add click animation for profile photo
  const profileImg = document.querySelector('.profile-photo');
  if (profileImg) {
    profileImg.addEventListener('click', () => {
      profileImg.classList.add('photo-spin');
      setTimeout(() => profileImg.classList.remove('photo-spin'), 1000);
    });
  }

  // rider profile modal
  const riderModal = document.getElementById('rider-modal');
  const riderModalClose = document.getElementById('rider-modal-close');
  const riderModalTitle = document.getElementById('rider-modal-title');
  const riderModalBody = document.getElementById('rider-modal-body');
  const rosterItems = document.querySelectorAll('.roster-list li');

  const openRiderModal = (name) => {
    const profile = riderProfiles[name] || {
      role: 'Team Rider',
      favoriteRace: 'Upcoming Events',
      hometown: 'United States',
      photo: makeAvatar(name)
    };
    if (!riderModal || !riderModalBody || !riderModalTitle) {
      return;
    }

    riderModalTitle.textContent = 'Rider Profile';
    riderModalBody.innerHTML = `
      <div class="rider-profile-header">
        <img class="rider-profile-photo" src="${profile.photo}" alt="Profile photo of ${name}" style="object-position:${profile.photoPosition || 'center'};">
        <div>
          <p class="rider-profile-name">${name}</p>
        </div>
      </div>
      <p><strong>Role:</strong> ${profile.role}</p>
      <p><strong>Favorite Race:</strong> ${profile.favoriteRace}</p>
      <p><strong>Hometown:</strong> ${profile.hometown}</p>
    `;
    riderModal.hidden = false;
    riderModal.setAttribute('aria-hidden', 'false');
  };

  const closeRiderModal = () => {
    if (!riderModal) {
      return;
    }
    riderModal.hidden = true;
    riderModal.setAttribute('aria-hidden', 'true');
  };

  rosterItems.forEach((item) => {
    const riderName = item.textContent.trim();
    const riderProfile = riderProfiles[riderName] || {
      role: 'Team Rider',
      favoriteRace: 'Upcoming Events',
      hometown: 'United States',
      photo: makeAvatar(riderName),
      photoPosition: 'center'
    };
    const riderPhoto = riderProfile.photo || makeAvatar(riderName);

    if (!item.querySelector('.roster-thumb')) {
      item.innerHTML = `
        <img class="roster-thumb" src="${riderPhoto}" alt="${riderName} profile photo" style="object-position:${riderProfile.photoPosition || 'center'};">
        <span class="roster-name">${riderName}</span>
        <span class="roster-meta">${riderProfile.role}</span>
      `;
    }

    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', `Open profile for ${riderName}`);

    item.addEventListener('click', () => {
      openRiderModal(riderName);
    });

    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openRiderModal(riderName);
      }
    });
  });

  if (riderModalClose) {
    riderModalClose.addEventListener('click', closeRiderModal);
  }

  if (riderModal) {
    riderModal.addEventListener('click', (e) => {
      if (e.target === riderModal) {
        closeRiderModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeRiderModal();
    }
  });

  // schedule filters + countdown
  const monthFilter = document.getElementById('schedule-month-filter');
  const locationFilter = document.getElementById('schedule-location-filter');
  const resetFiltersBtn = document.getElementById('schedule-reset-filters');
  const countdownEl = document.getElementById('race-countdown');
  const scheduleRows = Array.from(document.querySelectorAll('.schedule-table tbody tr'));

  const parseDate = (dateStr) => {
    const [month, day, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day, 9, 0, 0);
  };

  const updateRaceStatuses = () => {
    if (scheduleRows.length === 0) {
      return;
    }

    const now = new Date();

    scheduleRows.forEach((row) => {
      const dateText = row.cells[0]?.textContent.trim();
      const statusPill = row.cells[3]?.querySelector('.race-status');

      if (!dateText || !statusPill) {
        return;
      }

      const raceDate = parseDate(dateText);
      const isComplete = raceDate < now;

      statusPill.classList.toggle('status-complete', isComplete);
      statusPill.classList.toggle('status-upcoming', !isComplete);
      statusPill.innerHTML = isComplete
        ? '<i data-lucide="check-circle-2" class="icon icon-inline" aria-hidden="true"></i> Complete'
        : '<i data-lucide="clock-3" class="icon icon-inline" aria-hidden="true"></i> Upcoming';
    });

    refreshIcons();
  };

  if (locationFilter && scheduleRows.length > 0) {
    const locations = [...new Set(scheduleRows.map((row) => row.cells[2]?.textContent.trim()).filter(Boolean))].sort();
    locations.forEach((location) => {
      const option = document.createElement('option');
      option.value = location;
      option.textContent = location;
      locationFilter.appendChild(option);
    });
  }

  const updateCountdown = () => {
    if (!countdownEl || scheduleRows.length === 0) {
      return;
    }

    const now = new Date();
    const upcoming = scheduleRows
      .map((row) => ({ row, date: parseDate(row.cells[0].textContent.trim()), event: row.cells[1].textContent.trim() }))
      .filter((item) => item.date >= now)
      .sort((a, b) => a.date - b.date)[0];

    if (!upcoming) {
      countdownEl.textContent = 'Season complete. See you next year!';
      return;
    }

    const diffMs = upcoming.date - now;
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
    countdownEl.textContent = `Next race (${upcoming.event}) in ${days}d ${hours}h`;
  };

  const applyScheduleFilters = () => {
    if (!monthFilter || !locationFilter) {
      return;
    }

    const monthValue = monthFilter.value;
    const locationValue = locationFilter.value;

    scheduleRows.forEach((row) => {
      const dateText = row.cells[0]?.textContent.trim();
      const locationText = row.cells[2]?.textContent.trim();
      const month = parseDate(dateText).getMonth() + 1;

      const monthMatch = monthValue === 'all' || Number(monthValue) === month;
      const locationMatch = locationValue === 'all' || locationValue === locationText;

      row.style.display = monthMatch && locationMatch ? '' : 'none';
    });
  };

  if (monthFilter) {
    monthFilter.addEventListener('change', applyScheduleFilters);
  }

  if (locationFilter) {
    locationFilter.addEventListener('change', applyScheduleFilters);
  }

  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', () => {
      if (monthFilter) monthFilter.value = 'all';
      if (locationFilter) locationFilter.value = 'all';
      applyScheduleFilters();
    });
  }

  updateRaceStatuses();
  updateCountdown();
  setInterval(() => {
    updateRaceStatuses();
    updateCountdown();
  }, 60000);

  // interactive race map
  const raceMapEl = document.getElementById('race-map');
  if (raceMapEl && window.L) {
    const raceMap = L.map('race-map').setView([39.8, -98.5], 4);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 10,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(raceMap);

    const raceCoordinates = {
      Redlands: [34.0556, -117.1825],
      'Sea Otter': [36.5850, -121.7547],
      'Collegiate Road Nationals': [44.5133, -88.0133],
      'Tour de Bloom': [47.4235, -120.3103],
      'Armed Forces': [38.9072, -77.0369],
      'Tulsa Tough': [36.1540, -95.9928],
      'Professional Road Nationals': [38.3498, -81.6326]
    };

    const markerPoints = [];
    scheduleRows.forEach((row) => {
      const date = row.cells[0]?.textContent.trim();
      const event = row.cells[1]?.textContent.trim();
      const location = row.cells[2]?.textContent.trim();
      const coords = raceCoordinates[event];

      if (!coords) {
        return;
      }

      const marker = L.marker(coords).addTo(raceMap);
      marker.bindTooltip(`${event} · ${date}`, { direction: 'top', offset: [0, -8] });
      marker.bindPopup(`<strong>${event}</strong><br>${date}<br>${location}`);
      markerPoints.push(coords);
    });

    if (markerPoints.length > 0) {
      raceMap.fitBounds(markerPoints, { padding: [28, 28] });
    }

    setTimeout(() => raceMap.invalidateSize(), 250);
  }

  // swipeable media carousel
  const carousel = document.querySelector('.media-carousel');
  if (carousel) {
    const track = carousel.querySelector('.carousel-track');
    const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
    const prevBtn = carousel.querySelector('.carousel-btn.prev');
    const nextBtn = carousel.querySelector('.carousel-btn.next');
    const dotsWrap = document.querySelector('.carousel-dots');
    let currentIndex = 0;
    let startX = 0;
    let deltaX = 0;

    if (dotsWrap) {
      slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = `carousel-dot${index === 0 ? ' active' : ''}`;
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        dot.addEventListener('click', () => goToSlide(index));
        dotsWrap.appendChild(dot);
      });
    }

    const pauseInactiveVideos = () => {
      slides.forEach((slide, index) => {
        const video = slide.querySelector('video');
        if (video && index !== currentIndex) {
          video.pause();
        }
      });
    };

    const updateDots = () => {
      if (!dotsWrap) return;
      dotsWrap.querySelectorAll('.carousel-dot').forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
    };

    function goToSlide(index) {
      currentIndex = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      slides.forEach((slide, idx) => slide.classList.toggle('is-active', idx === currentIndex));
      updateDots();
      pauseInactiveVideos();
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

    track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      deltaX = 0;
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
      deltaX = e.touches[0].clientX - startX;
    }, { passive: true });

    track.addEventListener('touchend', () => {
      if (Math.abs(deltaX) > 45) {
        if (deltaX < 0) goToSlide(currentIndex + 1);
        else goToSlide(currentIndex - 1);
      }
      deltaX = 0;
    });

    goToSlide(0);

    // --- Lightbox for full-size images ---
    const lightbox      = document.getElementById('lightbox');
    const lightboxImg   = document.getElementById('lightbox-img');
    const lightboxCap   = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev  = document.getElementById('lightbox-prev');
    const lightboxNext  = document.getElementById('lightbox-next');

    // Collect only image slides for lightbox navigation
    const imageSlides = slides.filter(s => s.dataset.type === 'image');

    let lbIndex = 0;

    function openLightbox(slideIndex) {
      lbIndex = imageSlides.indexOf(slides[slideIndex]);
      if (lbIndex < 0) return; // video slide, no lightbox
      const img = imageSlides[lbIndex].querySelector('img');
      const cap = imageSlides[lbIndex].querySelector('figcaption');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxCap.textContent = cap ? cap.textContent : '';
      lightbox.hidden = false;
      lightboxClose.focus();
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.hidden = true;
      lightboxImg.src = '';
      document.body.style.overflow = '';
    }

    function navigateLightbox(dir) {
      lbIndex = (lbIndex + dir + imageSlides.length) % imageSlides.length;
      const img = imageSlides[lbIndex].querySelector('img');
      const cap = imageSlides[lbIndex].querySelector('figcaption');
      lightboxImg.style.animation = 'none';
      requestAnimationFrame(() => {
        lightboxImg.style.animation = '';
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCap.textContent = cap ? cap.textContent : '';
      });
    }

    // Add expand button + click handler to each image slide
    slides.forEach((slide, idx) => {
      if (slide.dataset.type !== 'image') return;
      const img = slide.querySelector('img');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'carousel-expand-btn';
      btn.setAttribute('aria-label', 'View full size');
      btn.innerHTML = '⛶';
      slide.appendChild(btn);
      btn.addEventListener('click', (e) => { e.stopPropagation(); openLightbox(idx); });
      img.addEventListener('click', () => openLightbox(idx));
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev)  lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    if (lightboxNext)  lightboxNext.addEventListener('click', () => navigateLightbox(1));

    // Close on backdrop click
    if (lightbox) {
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
      });
    }

    // Keyboard: Escape closes, arrow keys navigate
    document.addEventListener('keydown', (e) => {
      if (lightbox && !lightbox.hidden) {
        if (e.key === 'Escape')      closeLightbox();
        if (e.key === 'ArrowRight')  navigateLightbox(1);
        if (e.key === 'ArrowLeft')   navigateLightbox(-1);
      }
    });
  }

  // rider type quiz/game
  const quizSection = document.getElementById('quiz');
  const quizForm = document.getElementById('rider-quiz-form');
  const quizResult = document.getElementById('quiz-result');
  const quizResultText = document.getElementById('quiz-result-text');
  const quizShareBtn = document.getElementById('quiz-share');
  const quizResetBtn = document.getElementById('quiz-reset');
  const quizShareStatus = document.getElementById('quiz-share-status');
  let latestQuizResult = '';

  if (quizSection) {
    quizSection.hidden = false;
    quizSection.style.display = 'block';
  }

  const riderTypeCopy = {
    sprinter: {
      label: 'Sprinter',
      desc: 'Explosive and fearless — you shine in high-speed finishes.'
    },
    climber: {
      label: 'Climber',
      desc: 'Strong on long efforts — you thrive when the road tilts up.'
    },
    tt: {
      label: 'Time Trial Specialist',
      desc: 'Focused and efficient — your power is precision.'
    },
    domestique: {
      label: 'Domestique',
      desc: 'Team-first and reliable — you make everyone around you better.'
    },
    allrounder: {
      label: 'All-rounder',
      desc: 'Versatile and tactical — you adapt to any race situation.'
    }
  };

  const scoreQuiz = (answers) => {
    const scores = { sprinter: 0, climber: 0, tt: 0, domestique: 0, allrounder: 0 };
    answers.forEach((answer) => {
      if (scores[answer] !== undefined) {
        scores[answer] += 1;
      }
    });

    return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
  };

  if (quizForm && quizResult && quizResultText) {
    quizForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(quizForm);
      const answers = ['q1', 'q2', 'q3'].map((q) => formData.get(q));

      if (answers.some((value) => !value)) {
        quizResult.hidden = false;
        quizResultText.textContent = 'Please answer all 3 questions to see your rider type.';
        latestQuizResult = '';
        return;
      }

      const resultKey = scoreQuiz(answers);
      const result = riderTypeCopy[resultKey] || riderTypeCopy.allrounder;
      latestQuizResult = `I got ${result.label} in the CCB Women’s Cycling rider quiz!`;
      quizResult.hidden = false;
      quizResultText.textContent = `You are a ${result.label}. ${result.desc}`;
      if (quizShareStatus) {
        quizShareStatus.textContent = '';
      }
    });
  }

  if (quizShareBtn) {
    quizShareBtn.addEventListener('click', async () => {
      if (!latestQuizResult) {
        if (quizShareStatus) quizShareStatus.textContent = 'Complete the quiz first.';
        return;
      }

      const sharePayload = {
        title: 'My CCB Rider Type',
        text: latestQuizResult,
        url: `${window.location.origin}${window.location.pathname}#quiz`
      };

      try {
        if (navigator.share) {
          await navigator.share(sharePayload);
          if (quizShareStatus) quizShareStatus.textContent = 'Shared!';
          return;
        }

        await navigator.clipboard.writeText(`${latestQuizResult} ${sharePayload.url}`);
        if (quizShareStatus) quizShareStatus.textContent = 'Result copied to clipboard.';
      } catch {
        if (quizShareStatus) quizShareStatus.textContent = 'Could not share right now.';
      }
    });
  }

  if (quizResetBtn && quizForm && quizResult && quizShareStatus) {
    quizResetBtn.addEventListener('click', () => {
      quizForm.reset();
      quizResult.hidden = true;
      quizShareStatus.textContent = '';
      latestQuizResult = '';
    });
  }

  console.log('CIS Project: scripts.js loaded');

  // simple contact form validation
  const form = document.getElementById('contact-form');
  const contactStatus = document.getElementById('contact-status');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      let valid = true;

      // grab fields
      const name = form.querySelector('#name');
      const email = form.querySelector('#email');
      const subject = form.querySelector('#subject');
      const message = form.querySelector('#message');

      // clear any existing errors
      form.querySelectorAll('.error').forEach(el => el.textContent = '');
      if (contactStatus) {
        contactStatus.hidden = true;
        contactStatus.textContent = '';
        contactStatus.classList.remove('is-error', 'is-success');
      }

      if (name && name.value.trim() === '') {
        showError(name, 'Name is required');
        valid = false;
      }

      if (email && !/^\S+@\S+\.\S+$/.test(email.value)) {
        showError(email, 'Please enter a valid email address');
        valid = false;
      }

      if (message && message.value.trim() === '') {
        showError(message, 'Message cannot be empty');
        valid = false;
      }

      if (!valid) {
        return;
      }

      const submitButton = form.querySelector('button[type="submit"]');

      try {
        if (submitButton) {
          submitButton.disabled = true;
          submitButton.textContent = 'Saving...';
        }

        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: name ? name.value.trim() : '',
            email: email ? email.value.trim() : '',
            subject: subject ? subject.value.trim() : '',
            message: message ? message.value.trim() : ''
          })
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Could not save your message right now.');
        }

        form.reset();
        if (contactStatus) {
          contactStatus.textContent = result.message || 'Your message was saved.';
          contactStatus.hidden = false;
          contactStatus.classList.add('is-success');
        }
      } catch (error) {
        if (contactStatus) {
          contactStatus.textContent = error.message || 'Could not save your message right now.';
          contactStatus.hidden = false;
          contactStatus.classList.add('is-error');
        }
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = 'Send';
        }
      }
    });

    // add input listener to name field
    const nameInput = form.querySelector('#name');
    if (nameInput) {
      nameInput.addEventListener('input', (e) => {
        console.log('User typed:', e.target.value);
      });
    }

    // add click listener to submit button
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.addEventListener('click', () => {
        if (contactStatus) {
          contactStatus.hidden = true;
        }
      });
    }
  }

  refreshIcons();
});
// helper to display an error message next to a form field
function showError(input, msg) {
  let error = input.nextElementSibling;
  if (!error || !error.classList.contains('error')) {
    error = document.createElement('span');
    error.className = 'error';
    error.style.color = '#7a0018';
    error.style.fontWeight = '700';
    input.parentNode.insertBefore(error, input.nextSibling);
  }
  error.textContent = `⚠ ${msg}`;
}