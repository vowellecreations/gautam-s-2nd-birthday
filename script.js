/* ==========================================================
   VOWELLE — DIGITAL BIRTHDAY INVITATION
   Gautam Turns 2 — Luxury Children's Editorial Animation Script
   ========================================================== */

"use strict";

/* ----------------------------------------------------------
   1. EVENT CONFIGURATION
---------------------------------------------------------- */

const CONFIG = {
  birthdayDate: "2026-10-24T19:00:00+05:30",
  birthdayName: "Gautam",
  age: 2,

  musicFile: "assets/adento-trimmed.mp3",

  // WhatsApp RSVP number — country code + number, no + sign
  whatsappNumber: "916300458261",

  whatsappMessage:
    "Hi Gautam! I'd love to join your 2nd birthday celebration. 🎂✨"
};


/* ----------------------------------------------------------
   2. DOM REFERENCES
---------------------------------------------------------- */

const DOM = {
  intro: document.getElementById("intro"),
  introParticleCanvas: document.getElementById("introParticleCanvas"),
  luxuryEnvelope: document.getElementById("luxuryEnvelope"),
  envelopeFlap: document.getElementById("envelopeFlap"),
  envelopeSeal: document.getElementById("envelopeSeal"),
  invitationCard: document.getElementById("invitationCard"),
  openEnvelopeBtn: document.getElementById("openEnvelopeBtn"),
  envelopePromptWrap: document.getElementById("envelopePromptWrap"),
  cardFullscreenVeil: document.getElementById("cardFullscreenVeil"),
  heroContent: document.getElementById("heroContent"),

  musicButton: document.getElementById("musicToggle"),
  musicBars: document.getElementById("musicBars"),
  musicStatus: document.getElementById("musicStatus"),

  sparkleCanvas: document.getElementById("sparkleCanvas"),
  starTracker: document.getElementById("scrollStarTracker"),
  storyIdx: document.getElementById("currentSectionIdx"),

  addToCalendarBtn: document.getElementById("addToCalendarBtn"),

  cakeMilestone: document.getElementById("cakeMilestone"),
  candleStage: document.getElementById("cakeWishStage") || document.getElementById("candleStage"),
  candleElem: document.getElementById("birthdayCake") || document.getElementById("candleElem"),
  candleFlame: document.getElementById("cakeFlame") || document.getElementById("candleFlame"),
  giftBox: document.getElementById("giftBox"),
  surpriseRevealCard: document.getElementById("surpriseRevealCard"),

  countdownGrid: document.getElementById("countdownGrid"),
  countdownArrived: document.getElementById("countdownArrived"),
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds"),

  heroName: document.getElementById("heroName"),
  closingName: document.querySelector(".closing-name"),
  ageElements: document.querySelectorAll(".age, .big-number, .orbit div, .intro-age-symbol")
};


/* ----------------------------------------------------------
   3. STATE
---------------------------------------------------------- */

const state = {
  entered: false,
  musicPlaying: false,
  musicStarted: false,
  userWantsMusic: false,
  audio: null,
  countdownTimer: null,
  observer: null,
  reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches
};

let celebrationDate = new Date(CONFIG.birthdayDate).getTime();


/* ----------------------------------------------------------
   4. INITIALIZATION
---------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", init);

function init() {
  personalizeInvitation();
  setupIntroExperience();
  setupMusic();
  setupCountdown();
  setupScrollReveal();
  setupRevealBalloons();
  setupCandleInteraction();
  setupCalendar();
  setupFinalSurprise();
  setupStoryIndicator();
  setupScrollStarTracker();
  setupSparkleCanvas();
  setupSmoothAnchors();
  if (typeof FamilyLetterSection !== "undefined" && FamilyLetterSection.init) {
    FamilyLetterSection.init();
  }
  if (typeof PremiumRevealImage !== "undefined" && PremiumRevealImage.init) {
    PremiumRevealImage.init();
  }
}


/* ----------------------------------------------------------
   5. PERSONALIZATION & WHATSAPP
---------------------------------------------------------- */

function personalizeInvitation() {
  if (DOM.heroName) {
    DOM.heroName.textContent = CONFIG.birthdayName;
  }

  if (DOM.closingName) {
    DOM.closingName.innerHTML =
      `${escapeHTML(CONFIG.birthdayName)} <span>×</span> ${CONFIG.age}`;
  }

  if (DOM.ageElements) {
    DOM.ageElements.forEach((el) => {
      el.textContent = CONFIG.age;
    });
  }

  document.title =
    `${CONFIG.birthdayName} Turns ${CONFIG.age} | Vowelle`;

  updateWhatsAppLinks();
}

function updateWhatsAppLinks() {
  const links = document.querySelectorAll('a[href*="wa.me"]');
  const message = encodeURIComponent(CONFIG.whatsappMessage);
  const whatsappURL = `https://wa.me/${CONFIG.whatsappNumber}?text=${message}`;

  links.forEach((link) => {
    // Preserve general contacts if desired, but set RSVP button specifically
    if (link.classList.contains("primary-btn") || link.textContent.includes("THERE")) {
      link.href = whatsappURL;
    }
  });
}


/* ----------------------------------------------------------
   6. CINEMATIC FULL-SCREEN OPENING EXPERIENCE
   Modular Component Architecture (Reusable for Vowelle)
---------------------------------------------------------- */

/* ----------------------------------------------------------
   Component 1: GoldenParticles
   25–35 tiny champagne particles slowly appear (Requirement 3)
---------------------------------------------------------- */
const GoldenParticles = {
  canvas: null,
  ctx: null,
  particles: [],
  ripples: [],
  animId: null,
  active: false,
  width: 0,
  height: 0,
  mouse: { x: -999, y: -999, active: false },

  init(canvasElement) {
    if (!canvasElement || state.reducedMotion) return;
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext("2d");
    this.resize();

    window.addEventListener("resize", () => this.resize());

    // Desktop micro-interaction: subtle particle response
    window.addEventListener(
      "pointermove",
      (e) => {
        if (state.entered || e.pointerType === "touch") return;
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
        this.mouse.active = true;
      },
      { passive: true }
    );

    // Mobile micro-interaction: elegant single champagne ripple
    window.addEventListener(
      "touchstart",
      (e) => {
        if (state.entered || !e.touches.length) return;
        const touch = e.touches[0];
        this.addRipple(touch.clientX, touch.clientY);
      },
      { passive: true }
    );

    // 25–35 tiny champagne particles slowly appear (curated 30 particles)
    this.particles = Array.from({ length: 30 }, () => this.createParticle());
    this.active = true;
    this.render();
  },

  resize() {
    if (!this.canvas) return;
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  },

  createParticle() {
    const palette = [
      "217, 190, 123", // #D9BE7B (warm champagne)
      "197, 160, 90",  // #C5A05A (muted champagne gold)
      "243, 235, 221"  // #F3EBDD (soft ivory)
    ];
    return {
      x: Math.random() * (this.width || window.innerWidth),
      y: Math.random() * (this.height || window.innerHeight),
      radius: Math.random() * 0.9 + 0.7, // 0.7 to 1.6px: tiny and delicate
      color: palette[Math.floor(Math.random() * palette.length)],
      baseAlpha: Math.random() * 0.38 + 0.22,
      fadeProgress: 0, // slowly appears (step 3)
      fadeDelay: Math.random() * 50 + 15, // staggered reveal
      speedY: Math.random() * 0.2 + 0.08, // slow upward drift
      speedX: (Math.random() - 0.5) * 0.16,
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: Math.random() * 0.015 + 0.008,
      glowBoost: 0,
      glowTimer: Math.random() * 220 + 120
    };
  },

  addRipple(x, y) {
    if (this.ripples.length >= 2) return;
    this.ripples.push({
      x,
      y,
      radius: 4,
      maxRadius: 75,
      alpha: 0.55
    });
  },

  accelerateOutward() {
    // Exit transition: particles drift outward
    this.particles.forEach((p) => {
      const dx = p.x - this.width / 2;
      const dy = p.y - this.height / 2;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      p.speedX = (dx / dist) * (Math.random() * 2.6 + 1.2);
      p.speedY = (dy / dist) * (Math.random() * 2.6 + 1.2);
    });
  },

  render() {
    if (!this.active || state.entered) return;

    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Draw Subtle Ripples
    for (let r = this.ripples.length - 1; r >= 0; r--) {
      const rip = this.ripples[r];
      rip.radius += 1.8;
      rip.alpha -= 0.015;

      if (rip.alpha <= 0 || rip.radius >= rip.maxRadius) {
        this.ripples.splice(r, 1);
        continue;
      }

      this.ctx.beginPath();
      this.ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
      this.ctx.strokeStyle = `rgba(217, 190, 123, ${rip.alpha})`;
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
    }

    // 2. Draw Golden Particles
    this.particles.forEach((p) => {
      // Step 3: 25–35 tiny champagne particles slowly appear
      if (p.fadeDelay > 0) {
        p.fadeDelay--;
      } else if (p.fadeProgress < 1) {
        p.fadeProgress += 0.014;
      }

      const effectiveAlpha = Math.min(1, (p.baseAlpha + Math.sin(p.phase) * 0.1 + p.glowBoost) * p.fadeProgress);
      if (effectiveAlpha <= 0.005) return;

      p.glowTimer--;
      if (p.glowTimer <= 0) {
        p.glowBoost = 0.35;
        p.glowTimer = Math.random() * 300 + 160;
      }
      if (p.glowBoost > 0) {
        p.glowBoost -= 0.01;
      }

      p.y -= p.speedY;
      p.x += p.speedX + Math.sin(p.phase) * 0.2;
      p.phase += p.phaseSpeed;

      // Cursor proximity micro-reaction (desktop)
      if (this.mouse.active) {
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < 4900) {
          const dist = Math.sqrt(distSq) || 1;
          const force = (1 - dist / 70) * 0.35;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }
      }

      // Screen wrapping
      if (p.y < -15) {
        p.y = this.height + 15;
        p.x = Math.random() * this.width;
      }
      if (p.x < -15) p.x = this.width + 15;
      if (p.x > this.width + 15) p.x = -15;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${p.color}, ${effectiveAlpha})`;
      if (p.glowBoost > 0.08) {
        this.ctx.shadowColor = `rgba(${p.color}, 0.65)`;
        this.ctx.shadowBlur = 5;
      } else {
        this.ctx.shadowBlur = 0;
      }
      this.ctx.fill();
    });

    this.animId = requestAnimationFrame(() => this.render());
  },

  destroy() {
    this.active = false;
    if (this.animId) cancelAnimationFrame(this.animId);
  }
};


/* ----------------------------------------------------------
   Component 2: PhysicalEnvelope (Luxury Physical Envelope Opening)
   Choreographed 5-Step Sensory Sequence:
   1. Gold Seal lifts/releases (tactile response)
   2. Flap unfolds in 3D from crease fold
   3. Ivory card rises out of pocket
   4. Card moves forward toward viewer, envelope recedes
   5. Fullscreen paper expansion (Physical -> Digital transition)
   6. Seamless sequential hero reveal
---------------------------------------------------------- */
const PhysicalEnvelope = {
  envelope: null,
  flap: null,
  seal: null,
  card: null,
  promptWrap: null,
  btn: null,
  opening: false,
  opened: false,

  init() {
    this.envelope = DOM.luxuryEnvelope || document.getElementById("luxuryEnvelope");
    this.flap = DOM.envelopeFlap || document.getElementById("envelopeFlap");
    this.seal = DOM.envelopeSeal || document.getElementById("envelopeSeal");
    this.card = DOM.invitationCard || document.getElementById("invitationCard");
    this.promptWrap = DOM.envelopePromptWrap || document.getElementById("envelopePromptWrap");
    this.btn = DOM.openEnvelopeBtn || document.getElementById("openEnvelopeBtn");
    const introEl = DOM.intro || document.getElementById("intro");

    const onUserInteract = (e) => {
      if (this.opened || this.opening || state.entered) return;
      this.open();
    };

    const targets = [this.seal, this.btn, this.envelope, this.flap, this.promptWrap, introEl];
    targets.forEach((el) => {
      if (!el) return;
      el.addEventListener("click", onUserInteract);
      el.addEventListener("touchend", onUserInteract, { passive: true });
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") onUserInteract(e);
      });
    });
  },

  open() {
    if (this.opening || this.opened || state.entered) return;
    this.opening = true;

    // STEP 1 — GOLD SEAL (0ms): gently reacts and slightly lifts/releases
    if (this.envelope) {
      this.envelope.classList.add("step-seal-release");
    }
    if (this.promptWrap) {
      this.promptWrap.classList.add("prompt-hidden");
    }

    // Initialize user music intent on first physical interaction
    state.userWantsMusic = true;

    // STEP 2 — ENVELOPE FLAP (350ms): physically unfolds in 3D from top fold
    // Music begins with the flap opening — user gesture provides playback permission
    window.setTimeout(() => {
      if (this.envelope) {
        this.envelope.classList.add("step-flap-open");
      }
      startMusic();
    }, 350);

    // STEP 3 — INVITATION CARD (850ms): slowly slides upward from envelope pocket
    window.setTimeout(() => {
      if (this.envelope) {
        this.envelope.classList.add("step-card-rise");
      }
    }, 850);

    // STEP 4 — CARD COMES FORWARD (1750ms): moves toward viewer, envelope recedes
    window.setTimeout(() => {
      if (this.envelope) {
        this.envelope.classList.add("step-card-forward");
      }
    }, 1750);

    // STEP 5 — MAGICAL LIGHT & FULLSCREEN EXPANSION (2550ms): card expands full screen
    window.setTimeout(() => {
      if (DOM.intro) {
        DOM.intro.classList.add("veil-active");
      }
    }, 2550);

    // STEP 6 — TRANSITION INTO HERO (3450ms): physical paper transforms into digital world
    window.setTimeout(() => {
      state.entered = true;
      this.opened = true;

      if (DOM.intro) {
        DOM.intro.classList.add("intro-dissolving");
      }

      // Sequential Typography and Photograph Entrance in Hero
      const heroContent = DOM.heroContent || document.getElementById("heroContent") || document.querySelector(".hero-content");
      if (heroContent) {
        heroContent.classList.add("visible");
      }

      window.setTimeout(() => {
        if (DOM.intro) {
          DOM.intro.classList.add("intro-hidden");
        }
      }, 1400);
    }, 3450);
  }
};


/* ----------------------------------------------------------
   Intro Orchestrator Setup
---------------------------------------------------------- */
function setupIntroExperience() {
  if (window.location.hash || window.location.search.includes("skipIntro")) {
    if (DOM.intro) DOM.intro.style.display = "none";
    state.entered = true;
    const heroContent = DOM.heroContent || document.getElementById("heroContent") || document.querySelector(".hero-content");
    if (heroContent) heroContent.classList.add("visible");
    return;
  }

  GoldenParticles.init(DOM.introParticleCanvas || document.getElementById("introParticleCanvas"));
  PhysicalEnvelope.init();
}

// Export for external API / test harnesses
window.VowelleIntro = {
  GoldenParticles,
  PhysicalEnvelope,
  openEnvelope() {
    PhysicalEnvelope.open();
  },
  enter() {
    PhysicalEnvelope.open();
  }
};


/* ----------------------------------------------------------
   7. MINIMAL MUSIC CONTROL
   Rule 14:
   - Starts after user interaction (Tap to Enter).
   - Pauses when tab is hidden.
   - Remains paused on tab return until manually toggled!
---------------------------------------------------------- */

function setupMusic() {
  if (!DOM.musicButton) return;

  DOM.musicButton.addEventListener("click", () => {
    if (state.musicPlaying) {
      state.userWantsMusic = false;
      pauseMusic();
    } else {
      state.userWantsMusic = true;
      startMusic();
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && state.musicPlaying) {
      pauseMusic();
    }
  });

  window.addEventListener("pagehide", () => {
    if (state.audio) {
      state.audio.pause();
      state.musicPlaying = false;
      updateMusicUI();
    }
  });

  window.addEventListener("pageshow", (e) => {
    if (e.persisted && state.audio) {
      state.audio.pause();
      state.musicPlaying = false;
      updateMusicUI();
    }
  });
}

function createAudio() {
  if (state.audio) return state.audio;

  const audio = new Audio();
  audio.src = CONFIG.musicFile;
  audio.loop = true;
  audio.preload = "auto";
  audio.volume = 0;

  audio.addEventListener("play", () => {
    state.musicPlaying = true;
    updateMusicUI();
  });

  audio.addEventListener("pause", () => {
    state.musicPlaying = false;
    updateMusicUI();
  });

  audio.addEventListener("ended", () => {
    state.musicPlaying = false;
    updateMusicUI();
  });

  audio.addEventListener("error", () => {
    state.musicPlaying = false;
    updateMusicUI();
  });

  state.audio = audio;
  return audio;
}

function rampVolume(audio, from, to, duration) {
  if (!audio) return;
  const startTime = performance.now();
  const volumeRange = to - from;

  function step(timestamp) {
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    audio.volume = from + volumeRange * eased;

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

async function startMusic() {
  const audio = createAudio();
  const isFirstStart = !state.musicStarted;

  if (isFirstStart) {
    audio.volume = 0;
    state.musicStarted = true;
    updateMusicUI();
  }

  try {
    await audio.play();
    state.musicPlaying = true;
    updateMusicUI();

    if (isFirstStart || audio.volume < 0.01) {
      rampVolume(audio, 0, 0.6, 2000);
    }
  } catch (err) {
    state.musicPlaying = false;
    updateMusicUI();
  }
}

function pauseMusic() {
  if (!state.audio) return;
  state.audio.pause();
  state.musicPlaying = false;
  updateMusicUI();
}

function updateMusicUI() {
  if (!DOM.musicButton) return;

  const shouldShow = state.musicStarted;
  const isPlaying = state.musicPlaying;

  DOM.musicButton.classList.toggle("visible", shouldShow);
  DOM.musicButton.classList.toggle("playing", isPlaying);
  DOM.musicButton.setAttribute("aria-label", isPlaying ? "Pause music" : "Play music");
}





/* ----------------------------------------------------------
   10. CALENDAR IMPLEMENTATION
---------------------------------------------------------- */

function setupCalendar() {
  const calendarBtn = document.getElementById("addToCalendarBtn");
  if (!calendarBtn) return;

  // Calendar event data
  const calendarEvent = {
    title: "Gautam Turns Two",
    description: "Join us to celebrate Gautam turning two years old! 🎂✨\n\n" +
      "Two years of wonder, laughter, and beautiful memories.\n\n" +
      "Saturday, October 24, 2026\n" +
      "7:00 PM onwards\n\n" +
      "Location: The Garden House\n" +
      "Juhu Tara Road, Juhu, Mumbai, Maharashtra 400049\n" +
      "India\n\n" +
      "RSVP required - please confirm your attendance.\n\n" +
      "Looking forward to celebrating with you!",
    location: "The Garden House, Juhu Tara Road, Juhu, Mumbai, Maharashtra 400049, India",
    startDate: "2026-10-24T19:00:00+05:30",
    endDate: "2026-10-24T21:00:00+05:30", // 2 hours duration
    timezone: "Asia/Kolkata",
  };

  function createCalendarEvent() {
    if (calendarBtn.classList.contains("creating")) return;

    calendarBtn.classList.add("creating");
    calendarBtn.setAttribute("aria-label", "Creating calendar event...");

    // Try to create the calendar event
    const calendarUrl = generateCalendarUrl(calendarEvent);

    // Try different methods for calendar creation
    const result = tryCreateCalendar(calendarEvent, calendarUrl);

    // Always remove loading state
    calendarBtn.classList.remove("creating");
    calendarBtn.setAttribute("aria-label", "Add to calendar");

    // Show success notification
    showCalendarNotification(result.success ? "Added to calendar!" : "Calendar created (external link)");

    return result;
  }

  function toGoogleCalendarDate(isoString) {
    // Google Calendar requires UTC dates in YYYYMMDDTHHmmSSZ format
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString.replace(/[-:]/g, '');
    return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  }

  function generateCalendarUrl(event) {
    const startUTC = toGoogleCalendarDate(event.startDate);
    const endUTC = toGoogleCalendarDate(event.endDate);

    // Generate Google Calendar URL
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}&dates=${startUTC}/${endUTC}`;

    // Generate Outlook Calendar URL
    const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(event.title)}&location=${encodeURIComponent(event.location)}&startdt=${event.startDate}&enddt=${event.endDate}&body=${encodeURIComponent(event.description)}`;

    return { google: googleUrl, outlook: outlookUrl };
  }

  function tryCreateCalendar(event, calendarUrls) {
    // Open Google Calendar in a new tab — works reliably on all platforms
    window.open(calendarUrls.google, "_blank", "noopener,noreferrer");
    return { success: true, method: "google-web", url: calendarUrls.google };
  }

  function showCalendarNotification(message) {
    // Create a temporary notification element
    const notification = document.createElement("div");
    notification.className = "calendar-notification";
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(8, 8, 10, 0.9);
      color: var(--light);
      padding: 12px 24px;
      border-radius: 8px;
      border: 1px solid var(--gold);
      z-index: 10000;
      font-size: 14px;
      font-family: "DM Sans", sans-serif;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Fade in
    requestAnimationFrame(() => {
      notification.style.opacity = "1";
    });

    // Fade out and remove after 3 seconds
    setTimeout(() => {
      notification.style.opacity = "0";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 2700);
  }

  // Set up event listener for the calendar button
  calendarBtn.addEventListener("click", (e) => {
    e.preventDefault();
    createCalendarEvent();
  });
}

/* ----------------------------------------------------------
   11. CANDLE INTERACTION (Make a Wish for Gautam)
   ---------------------------------------------------------- */

function setupCandleInteraction() {
  const cakeOrCandleStage = DOM.candleStage || document.getElementById("cakeWishStage");
  const cakeOrCandleElem = DOM.candleElem || document.getElementById("birthdayCake");
  const flameElem = DOM.candleFlame || document.getElementById("cakeFlame");

  if (!cakeOrCandleElem || !cakeOrCandleStage) return;

  let blown = false;

  function blowCandle() {
    if (blown) return;
    blown = true;

    // Step 1: Element activates (bright/active state)
    cakeOrCandleElem.classList.add("active");
    cakeOrCandleElem.classList.add("blown-bright");
    if (flameElem) flameElem.classList.add("blown-bright");

    // Brief darkening ambient vignette
    document.body.classList.add("wish-vignette");

    window.setTimeout(() => {
      // Step 2 & 3: Flame gently disappears & smoke rises / cake settles
      cakeOrCandleElem.classList.remove("blown-bright");
      cakeOrCandleElem.classList.add("blown");
      cakeOrCandleElem.classList.add("wished");
      if (flameElem) {
        flameElem.classList.remove("blown-bright");
        flameElem.classList.add("blown");
      }

      // Step 4: Tiny champagne-gold sparkle burst
      createSparkleBurstAt(cakeOrCandleElem);

      window.setTimeout(() => {
        document.body.classList.remove("wish-vignette");
      }, 1600);

      // Step 5: Reveal "TWO YEARS. SO MANY LITTLE MOMENTS."
      window.setTimeout(() => {
        cakeOrCandleStage.classList.add("wished");
      }, 500);
    }, 320);
  }

  cakeOrCandleElem.addEventListener("click", blowCandle);
  cakeOrCandleElem.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      blowCandle();
    }
  });

  // Also bind to stage for easy mobile tap
  if (cakeOrCandleStage !== cakeOrCandleElem) {
    cakeOrCandleStage.addEventListener("click", (e) => {
      if (e.target !== cakeOrCandleElem && !cakeOrCandleElem.contains(e.target)) {
        blowCandle();
      }
    });
  }
}


function updateCountdown() {
  const now = new Date().getTime();
  const distance = celebrationDate - now;

  /* Celebration has arrived */
  if (distance <= 0) {
    if (DOM.days) DOM.days.textContent = "00";
    if (DOM.hours) DOM.hours.textContent = "00";
    if (DOM.minutes) DOM.minutes.textContent = "00";
    if (DOM.seconds) DOM.seconds.textContent = "00";

    if (DOM.countdownGrid) DOM.countdownGrid.style.display = "none";
    if (DOM.countdownArrived) DOM.countdownArrived.style.display = "block";
    return;
  }

  const days = Math.floor(
    distance / (1000 * 60 * 60 * 24)
  );

  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) /
    (1000 * 60 * 60)
  );

  const minutes = Math.floor(
    (distance % (1000 * 60 * 60)) /
    (1000 * 60)
  );

  const seconds = Math.floor(
    (distance % (1000 * 60)) /
    1000
  );

  setCountdownValue("days", days);
  setCountdownValue("hours", hours);
  setCountdownValue("minutes", minutes);
  setCountdownValue("seconds", seconds);
}

function setCountdownValue(id, value) {
  const element = document.getElementById(id);
  if (!element) return;

  const formatted = String(value).padStart(2, "0");

  if (element.textContent !== formatted) {
    element.textContent = formatted;
    element.classList.remove("tick");
    void element.offsetWidth; // Force reflow
    element.classList.add("tick");
  }
}

function setupCountdown() {
  updateCountdown();

  if (state.countdownTimer) {
    window.clearInterval(state.countdownTimer);
  }

  state.countdownTimer = window.setInterval(
    updateCountdown,
    1000
  );
}


/* ----------------------------------------------------------
   10. SCROLL REVEALS & STORYBOOK PAGES
---------------------------------------------------------- */

function setupScrollReveal() {
  const elements = document.querySelectorAll(".reveal");
  if (!elements.length) return;

  if (state.reducedMotion || !("IntersectionObserver" in window)) {
    elements.forEach((el) => el.classList.add("visible"));
    return;
  }

  state.observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");

        // If cake milestone enters, create brief gold puff
        if (entry.target.contains(DOM.cakeMilestone)) {
          window.setTimeout(() => {
            createSparkleBurstAt(DOM.cakeMilestone);
          }, 1400);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  elements.forEach((el) => state.observer.observe(el));
}


/* ----------------------------------------------------------
   10B. REVEAL SECTION FLOATING BALLOONS & PARTICLES
   Faster floating, refined editorial palette, scroll optimization
---------------------------------------------------------- */

function setupRevealBalloons() {
  const revealSection = document.getElementById("reveal");
  const balloonsLayer = document.getElementById("revealBalloons");
  if (!revealSection || !balloonsLayer) return;

  createBalloonDriftParticles();

  if (state.reducedMotion || !("IntersectionObserver" in window)) {
    balloonsLayer.classList.remove("paused");
    return;
  }

  // Active by default so already smoothly moving when entering viewport
  balloonsLayer.classList.remove("paused");

  const balloonObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // 15–20% visible: active
          balloonsLayer.classList.remove("paused");
        } else {
          // Pause when completely leaves viewport to conserve GPU
          balloonsLayer.classList.add("paused");
        }
      });
    },
    { threshold: 0.18 } // Exactly 15–20% of section
  );

  balloonObserver.observe(revealSection);
}

function createBalloonDriftParticles() {
  const container = document.getElementById("balloonParticles");
  if (!container || state.reducedMotion) return;
  container.innerHTML = "";

  // 10 independent champagne-gold drift particles
  const count = 10;
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < count; i++) {
    const dot = document.createElement("span");
    dot.className = "balloon-drift-particle";
    const top = Math.random() * 80 + 10;
    const left = Math.random() * 86 + 7;
    const dur = Math.random() * 5 + 9; // 9–14s
    const delay = -(Math.random() * 8); // pre-animated
    const driftX = (Math.random() - 0.5) * 26;

    dot.style.top = `${top.toFixed(1)}%`;
    dot.style.left = `${left.toFixed(1)}%`;
    dot.style.setProperty("--drift-dur", `${dur.toFixed(1)}s`);
    dot.style.setProperty("--drift-delay", `${delay.toFixed(1)}s`);
    dot.style.setProperty("--drift-x", `${driftX.toFixed(1)}px`);
    fragment.appendChild(dot);
  }

  container.appendChild(fragment);
}


/* Storybook Section Index (01 / 07) */
function setupStoryIndicator() {
  const sections = document.querySelectorAll("section[data-section-index]");
  if (!sections.length || !DOM.storyIdx) return;

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = entry.target.getAttribute("data-section-index");
          if (idx && DOM.storyIdx) {
            DOM.storyIdx.textContent = idx;
          }
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach((sec) => sectionObserver.observe(sec));
}

/* Subtle Curved Scroll Star Trail */
function setupScrollStarTracker() {
  if (!DOM.starTracker || state.reducedMotion) return;

  let ticking = false;

  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? scrollTop / docHeight : 0;

        // Subtle curved path offset
        const sway = Math.sin(progress * Math.PI * 4) * 8;
        DOM.starTracker.style.transform = `translate3d(${sway}px, -50%, 0)`;

        ticking = false;
      });
    },
    { passive: true }
  );
}


/* ----------------------------------------------------------
   11. FINAL SURPRISE GIFT BOX
---------------------------------------------------------- */

function setupFinalSurprise() {
  if (!DOM.giftBox) return;

  let opened = false;

  function openGift() {
    if (opened) return;
    opened = true;

    DOM.giftBox.classList.add("opened");
    createSparkleBurstAt(DOM.giftBox);

    window.setTimeout(() => {
      if (DOM.surpriseRevealCard) {
        DOM.surpriseRevealCard.classList.add("visible");
      }
    }, 600);
  }

  DOM.giftBox.addEventListener("click", openGift);
  DOM.giftBox.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openGift();
    }
  });
}


/* ----------------------------------------------------------
   12. INTERACTIVE PARTICLES & SPARKLE CANVAS
---------------------------------------------------------- */

const sparkles = [];
let _startSparkleLoop = null;

function setupSparkleCanvas() {
  if (!DOM.sparkleCanvas || state.reducedMotion) return;

  const canvas = DOM.sparkleCanvas;
  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Desktop subtle cursor trailing
  let lastMove = 0;
  window.addEventListener(
    "pointermove",
    (e) => {
      if (e.pointerType === "touch") return; // Touch uses tap ripples
      const now = performance.now();
      if (now - lastMove < 70) return; // Limit generation
      lastMove = now;

      if (sparkles.length < 20) {
        sparkles.push({
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8 - 0.4,
          alpha: 0.65,
          decay: 0.02,
          radius: Math.random() * 1.6 + 0.6
        });
        startSparkleLoop();
      }
    },
    { passive: true }
  );

  // Mobile subtle touch ripple
  window.addEventListener(
    "touchstart",
    (e) => {
      if (!e.touches.length) return;
      const t = e.touches[0];
      for (let i = 0; i < 5; i++) {
        sparkles.push({
          x: t.clientX,
          y: t.clientY,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          alpha: 0.75,
          decay: 0.025,
          radius: Math.random() * 1.8 + 0.8
        });
      }
      startSparkleLoop();
    },
    { passive: true }
  );

  let sparkleLoopActive = false;

  function startSparkleLoop() {
    if (sparkleLoopActive) return;
    sparkleLoopActive = true;
    requestAnimationFrame(loop);
  }

  _startSparkleLoop = startSparkleLoop;

  function loop() {
    ctx.clearRect(0, 0, width, height);

    for (let i = sparkles.length - 1; i >= 0; i--) {
      const p = sparkles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        sparkles.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(240, 217, 154, ${p.alpha})`;
      ctx.shadowColor = "rgba(214, 179, 106, 0.6)";
      ctx.shadowBlur = 4;
      ctx.fill();
    }

    // Stop the loop when there are no sparkles — saves CPU/battery
    if (sparkles.length > 0) {
      requestAnimationFrame(loop);
    } else {
      sparkleLoopActive = false;
    }
  }
}

function createSparkleBurstAt(element) {
  if (!element || state.reducedMotion) return;

  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  for (let i = 0; i < 16; i++) {
    const angle = (Math.PI * 2 * i) / 16 + (Math.random() - 0.5) * 0.4;
    const speed = Math.random() * 2.2 + 1.2;

    sparkles.push({
      x: centerX,
      y: centerY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      alpha: 0.85,
      decay: 0.022,
      radius: Math.random() * 2 + 1
    });
  }

  // Restart the render loop if it was idle
  if (_startSparkleLoop) _startSparkleLoop();
}


/* ----------------------------------------------------------
   13. SMOOTH ANCHORS
---------------------------------------------------------- */

function setupSmoothAnchors() {
  const anchors = document.querySelectorAll('a[href^="#"]');

  anchors.forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  });
}


/* ----------------------------------------------------------
   14. DEVELOPER API
---------------------------------------------------------- */

window.VowelleBirthday = {
  getConfig() {
    return { ...CONFIG };
  },

  setName(name) {
    if (!name) return;
    CONFIG.birthdayName = name;
    personalizeInvitation();
  },

  setAge(age) {
    if (!age) return;
    CONFIG.age = age;
    personalizeInvitation();
  },

  setDate(dateString) {
    if (!dateString) return;
    CONFIG.birthdayDate = dateString;
    celebrationDate = new Date(dateString).getTime();
    updateCountdown();
  }
};

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


/* ==========================================================
   15. REUSABLE FAMILY LETTER SECTION COMPONENT
   Vowelle Luxury Editorial Stationery Experience
   Configurable for future birthday invitations
   ========================================================== */

const FamilyLetterSection = {
  options: {
    eyebrow: "FROM GAUTAM'S FAMILY",
    heading: "A LITTLE NOTE FROM OUR HEARTS",
    paragraphs: [
      "To our dearest family and friends,",
      "Two years ago, a little boy named Gautam came into our lives and filled our world with a kind of joy we never knew we were missing.",
      "From his very first smile to his tiny footsteps, curious eyes, and countless little adventures, every moment with him has become a memory we hold close to our hearts.",
      "As he turns two, we find ourselves celebrating more than just another year. We are celebrating two beautiful years of laughter, love, learning, and all the precious moments that have made our journey so special.",
      "And what could make this day more meaningful than sharing it with the people who have been a part of our lives and have showered Gautam with so much love and affection?",
      "So, come with your smiles, your blessings, and your warmest wishes, and celebrate our little one's special day with us.",
      "We can't wait to make another beautiful memory together."
    ],
    signoff: "With all our love,",
    signature: "Gautam's Family",
    accentColor: "#d6b36a",
    paperColor: ""
  },

  elements: {
    section: null,
    card: null,
    glow: null,
    dustField: null,
    body: null,
    header: null,
    signatureBlock: null,
    star: null,
    photoCompanion: null,
    bgStars: []
  },

  initialized: false,
  revealed: false,

  init(customOptions = {}) {
    if (customOptions && typeof customOptions === "object") {
      this.options = { ...this.options, ...customOptions };
    }

    this.elements.section = document.getElementById("familyLetter");
    if (!this.elements.section) return;

    this.elements.card = document.getElementById("letterCard");
    this.elements.photoCompanion = document.getElementById("familyPhotoWrap");
    this.elements.dustField = document.getElementById("letterDustField");
    this.elements.body = document.getElementById("letterBody");
    this.elements.header = document.getElementById("letterHeader");
    this.elements.signatureBlock = document.getElementById("letterSignatureBlock");
    this.elements.star = document.getElementById("letterSettleStar");
    this.elements.bgStars = Array.from(
      this.elements.section.querySelectorAll(".letter-bg-star")
    );

    this.createFloatingDust();
    this.setupIntersectionObserver();
    this.setupParallax();
    this.applyThemeColors();

    this.initialized = true;
  },

  configure(newOptions = {}) {
    this.options = { ...this.options, ...newOptions };
    if (this.initialized) {
      this.render();
      this.applyThemeColors();
    }
  },

  applyThemeColors() {
    if (!this.elements.section) return;
    if (this.options.paperColor && this.elements.card) {
      this.elements.card.style.background = this.options.paperColor;
    }
    if (this.options.accentColor) {
      this.elements.section.style.setProperty("--letter-accent", this.options.accentColor);
    }
  },

  render() {
    if (!this.elements.section) return;

    // Eyebrow
    const eyebrowEl = this.elements.section.querySelector(".letter-eyebrow");
    if (eyebrowEl && this.options.eyebrow) {
      eyebrowEl.textContent = this.options.eyebrow;
    }

    // Heading
    const headingEl = this.elements.section.querySelector(".letter-heading");
    if (headingEl && this.options.heading) {
      headingEl.textContent = this.options.heading;
    }

    // Body Paragraphs
    if (this.elements.body && Array.isArray(this.options.paragraphs)) {
      this.elements.body.innerHTML = this.options.paragraphs
        .map((para, idx) => `<p class="letter-para p-${idx + 1}">${escapeHTML(para)}</p>`)
        .join("");
    }

    // Signoff & Signature
    const signoffEl = this.elements.section.querySelector(".letter-signoff");
    if (signoffEl && this.options.signoff) {
      signoffEl.textContent = this.options.signoff;
    }

    const signatureEl = this.elements.section.querySelector(".letter-signature-name");
    if (signatureEl && this.options.signature) {
      signatureEl.textContent = this.options.signature;
    }
  },

  createFloatingDust() {
    if (!this.elements.dustField || state.reducedMotion) return;
    this.elements.dustField.innerHTML = "";

    // 16 curated champagne-gold dust particles with random subtle drift
    const count = 16;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < count; i++) {
      const dot = document.createElement("span");
      dot.className = "letter-dust-dot";
      const top = Math.random() * 88 + 6;
      const left = Math.random() * 90 + 5;
      const dur = Math.random() * 8 + 14; // 14-22s
      const delay = Math.random() * 5;
      const driftX = (Math.random() - 0.5) * 32;
      const baseOp = Math.random() * 0.14 + 0.08; // 0.08 - 0.22 opacity

      dot.style.top = `${top}%`;
      dot.style.left = `${left}%`;
      dot.style.setProperty("--dust-dur", `${dur.toFixed(1)}s`);
      dot.style.setProperty("--dust-delay", `${delay.toFixed(1)}s`);
      dot.style.setProperty("--drift-x", `${driftX.toFixed(1)}px`);
      dot.style.setProperty("--base-op", baseOp.toFixed(3));

      fragment.appendChild(dot);
    }

    this.elements.dustField.appendChild(fragment);
  },

  setupIntersectionObserver() {
    if (!this.elements.section) return;

    if (state.reducedMotion || !("IntersectionObserver" in window)) {
      this.triggerReveal();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.revealed) {
            this.revealed = true;
            this.triggerReveal();
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    observer.observe(this.elements.section);
  },

  triggerReveal() {
    if (!this.elements.section) return;

    // Step 1: Background becomes slightly warmer
    this.elements.section.classList.add("revealed");

    // Step 2: Ivory letter card appears first
    if (this.elements.card) {
      this.elements.card.classList.add("card-revealed");
    }

    // Step 3: Family photograph reveals second, sliding gently from one side
    if (this.elements.photoCompanion) {
      if (state.reducedMotion) {
        this.elements.photoCompanion.classList.add("photo-revealed");
        const frame = this.elements.photoCompanion.querySelector(".premium-photo-frame");
        if (frame) {
          frame.classList.add("revealed");
          frame.classList.add("settled");
        }
      } else {
        window.setTimeout(() => {
          this.elements.photoCompanion.classList.add("photo-revealed");
          const frame = this.elements.photoCompanion.querySelector(".premium-photo-frame");
          if (frame) {
            frame.classList.add("revealed");
            window.setTimeout(() => {
              frame.classList.add("settled");
            }, 1100);
          }
        }, 340);
      }
    }

    // Micro sparkle burst at top ornament on initial entrance
    if (!state.reducedMotion && this.elements.header) {
      window.setTimeout(() => {
        const topStar = this.elements.header.querySelector(".letter-top-star");
        if (topStar && typeof createSparkleBurstAt === "function") {
          createSparkleBurstAt(topStar);
        }
      }, 700);
    }
  },

  setupParallax() {
    if (state.reducedMotion || !this.elements.section) return;

    let ticking = false;

    window.addEventListener(
      "scroll",
      () => {
        if (ticking) return;
        window.requestAnimationFrame(() => {
          const rect = this.elements.section.getBoundingClientRect();
          const viewH = window.innerHeight;

          // Only calculate if section is in or near viewport
          if (rect.bottom >= -100 && rect.top <= viewH + 100) {
            const progress = (viewH - rect.top) / (viewH + rect.height);
            const offset = (progress - 0.5) * 40;

            // Background particles move slightly slower
            if (this.elements.dustField) {
              this.elements.dustField.style.transform = `translate3d(0, ${offset * 0.35}px, 0)`;
            }

            // Background stars move slightly differently
            if (this.elements.bgStars.length) {
              this.elements.bgStars.forEach((star, idx) => {
                const factor = idx % 2 === 0 ? 0.6 : -0.45;
                star.style.transform = `translate3d(0, ${offset * factor}px, 0)`;
              });
            }
          }

          ticking = false;
        });
        ticking = true;
      },
      { passive: true }
    );
  }
};

window.FamilyLetterSection = FamilyLetterSection;


/* ==========================================================
   16. REUSABLE PREMIUM IMAGE REVEAL COMPONENT
   Vowelle Luxury Editorial Photo Storytelling System
   Supports variants: portrait, editorial, family, floating
   Clip-path mask reveal + settle slow zoom + desktop parallax
   ========================================================== */

const PremiumRevealImage = {
  options: {
    revealThreshold: 0.1,
    rootMargin: "0px 0px -10px 0px"
  },

  observer: null,

  init() {
    // Select standalone photo frames (portrait & editorial story moments)
    const frames = Array.from(
      document.querySelectorAll(".premium-photo-frame:not(.variant-family)")
    );
    if (!frames.length) return;

    if (state.reducedMotion || !("IntersectionObserver" in window)) {
      frames.forEach((frame) => {
        frame.classList.add("revealed");
        frame.classList.add("settled");
      });
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const frame = entry.target;
            this.reveal(frame);
            this.observer.unobserve(frame);
          }
        });
      },
      {
        threshold: this.options.revealThreshold,
        rootMargin: this.options.rootMargin
      }
    );

    frames.forEach((frame) => {
      this.observer.observe(frame);
    });

    this.setupDesktopParallax();
  },

  reveal(frame) {
    if (!frame) return;

    // 1. Trigger clip-path reveal and translateY glide
    frame.classList.add("revealed");

    // 2. Settle into position then initiate slow zoom (scale 1.00 -> 1.035)
    window.setTimeout(() => {
      frame.classList.add("settled");
    }, 1150);
  },

  setupDesktopParallax() {
    if (state.reducedMotion) return;

    const frames = document.querySelectorAll(
      ".premium-photo-frame:not(.variant-family)"
    );
    if (!frames.length) return;

    let ticking = false;

    window.addEventListener(
      "scroll",
      () => {
        if (ticking) return;
        window.requestAnimationFrame(() => {
          // Desktop editorial parallax only (>= 768px viewport width)
          if (window.innerWidth >= 768) {
            const viewH = window.innerHeight;
            frames.forEach((frame) => {
              const rect = frame.getBoundingClientRect();
              if (rect.bottom >= -100 && rect.top <= viewH + 100) {
                // Subtle 8-15px slower offset
                const progress = (viewH - rect.top) / (viewH + rect.height) - 0.5;
                const parallaxY = progress * 14;
                const canvas = frame.querySelector(".photo-inner-canvas");
                if (canvas) {
                  canvas.style.transform = `translate3d(0, ${parallaxY.toFixed(1)}px, 0)`;
                }
              }
            });
          }
          ticking = false;
        });
        ticking = true;
      },
      { passive: true }
    );
  },

  /* Reusable factory function for programmatic creation */
  create({
    src,
    alt = "",
    position = "center 25%",
    caption = "",
    variant = "portrait",
    container = null
  } = {}) {
    if (!src) return null;

    const frame = document.createElement("div");
    const safeVariant = String(variant).replace(/[^a-zA-Z0-9-_]/g, '');
    frame.className = `premium-photo-frame variant-${safeVariant}`;
    frame.setAttribute("data-photo-variant", variant);

    const aspectClass =
      variant === "family"
        ? "img-family"
        : variant === "editorial"
          ? "img-moment"
          : "img-portrait";

    frame.innerHTML = `
      <div class="photo-clip-stage">
        <div class="photo-inner-canvas">
          <img 
            src="${escapeHTML(src)}" 
            alt="${escapeHTML(alt)}" 
            class="editorial-img ${aspectClass}"
            style="object-position: ${escapeHTML(position)};"
            loading="lazy" 
            decoding="async" 
          />
          <div class="photo-warm-sheen" aria-hidden="true"></div>
        </div>
      </div>
      ${caption
        ? `<div class="photo-caption-bar ${variant === 'family' ? 'family-caption-bar' : ''}">
              <span class="caption-star">✦</span>
              <span class="photo-caption-text">${escapeHTML(caption)}</span>
              <span class="caption-star">✦</span>
            </div>`
        : ""
      }
    `;

    if (container) {
      container.appendChild(frame);
      if (this.observer) {
        this.observer.observe(frame);
      }
    }

    return frame;
  }
};

window.PremiumRevealImage = PremiumRevealImage;


