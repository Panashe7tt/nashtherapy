/* ============================================
   Nash Therapy - Login helper (demo only)
   Accounts live in this browser's localStorage.
   Every user's photo and booking is saved under their own email.
   ============================================ */
window.NashAuth = {
  users: function () {
    try { return JSON.parse(localStorage.getItem("nash-users")) || {}; } catch (e) { return {}; }
  },
  saveUsers: function (u) { localStorage.setItem("nash-users", JSON.stringify(u)); },
  clean: function (email) { return (email || "").trim().toLowerCase(); },
  current: function () {
    if (localStorage.getItem("nash-logged-in") !== "true") return null;
    var email = localStorage.getItem("nash-current-user");
    return email && this.users()[email] ? email : null;
  },
  currentUser: function () { var e = this.current(); return e ? this.users()[e] : null; },
  login: function (email) {
    localStorage.setItem("nash-current-user", email);
    localStorage.setItem("nash-logged-in", "true");
  },
  logout: function () {
    localStorage.removeItem("nash-current-user");
    localStorage.setItem("nash-logged-in", "false");
  },
  key: function (base) { return base + ":" + (this.current() || "guest"); }
};

/* ============================================
   Nash Therapy - Interactions & Theme
   ============================================ */

(function () {
  "use strict";

  /* ---------- Dark / Light Mode ---------- */
  const themeToggle = document.getElementById("theme-toggle");
  const html = document.documentElement;

  // Load saved preference or system preference
  function getPreferredTheme() {
    const saved = localStorage.getItem("nash-theme");
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function setTheme(theme) {
    html.setAttribute("data-theme", theme);
    localStorage.setItem("nash-theme", theme);
  }

  // Apply on load
  setTheme(getPreferredTheme());

  // Toggle on click
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const current = html.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";
      setTheme(next);
    });
  }

  // Listen for system preference changes
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", function (e) {
      if (!localStorage.getItem("nash-theme")) {
        setTheme(e.matches ? "dark" : "light");
      }
    });

  /* ---------- Scroll Animations ---------- */
  const animatedElements = document.querySelectorAll(".animate-on-scroll");

  function checkVisibility() {
    const triggerBottom = window.innerHeight * 0.88;

    animatedElements.forEach(function (el) {
      const rect = el.getBoundingClientRect();
      if (rect.top < triggerBottom) {
        el.classList.add("visible");
      }
    });
  }

  // Run on load and scroll
  window.addEventListener("scroll", checkVisibility, { passive: true });
  window.addEventListener("load", checkVisibility);
  checkVisibility();

  /* ---------- Smooth Active Nav Link ---------- */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  function updateActiveNav() {
    const scrollY = window.scrollY + 120;

    sections.forEach(function (section) {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(function (link) {
          link.classList.remove("active");
          if (link.getAttribute("href") === "#" + id) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", updateActiveNav, { passive: true });

  /* ---------- Button Micro-interactions ---------- */
  document.querySelectorAll(".btn").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      // Simple ripple-like feedback via scale
      btn.style.transform = "scale(0.97)";
      setTimeout(function () {
        btn.style.transform = "";
      }, 150);
    });
  });

  /* ---------- Therapist Book buttons (demo feedback) ---------- */
  document.querySelectorAll(".therapist-actions .btn-primary").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const original = btn.textContent;
      btn.textContent = "Booking...";
      btn.disabled = true;

      setTimeout(function () {
        btn.textContent = "Booked ✓";
        btn.style.background = "#2A9D8F";

        setTimeout(function () {
          btn.textContent = original;
          btn.disabled = false;
          btn.style.background = "";
        }, 2000);
      }, 800);
    });
  });

  console.log("Nash Therapy loaded successfully.");
})();

/* ---------- Nash Therapy shared support, accessibility and therapist tools ---------- */
(function () {
  'use strict';
  // Emergency support panel is available from every page.
  var helpButton = document.createElement('button');
  helpButton.className = 'help-now-button'; helpButton.type = 'button'; helpButton.textContent = '🆘 Need help now?';
  helpButton.setAttribute('aria-haspopup', 'dialog');
  var helpModal = document.createElement('div'); helpModal.className = 'modal-backdrop'; helpModal.id = 'emergency-modal'; helpModal.hidden = true;
  helpModal.innerHTML = '<section class="feature-modal emergency-modal" role="dialog" aria-modal="true" aria-labelledby="emergency-title"><button class="modal-close" aria-label="Close">×</button><h2 id="emergency-title">You do not have to face this alone</h2><p>If you are in immediate danger, call emergency services or go to the nearest emergency department.</p><div class="help-contact"><strong>SADAG Suicide Crisis Helpline · 24/7</strong><a href="tel:0800567567">0800 567 567</a></div><div class="help-contact"><strong>Cipla Mental Health Helpline · 24/7</strong><a href="tel:0800456789">0800 456 789</a></div><div class="help-contact"><strong>Emergency services · cellphone</strong><a href="tel:112">112</a></div><div class="help-contact"><strong>Ambulance</strong><a href="tel:10177">10177</a></div><p class="muted">If a line does not connect, try another or seek in-person emergency care. Nash Therapy is not an emergency service.</p><p><a href="https://www.sadag.org/" target="_blank" rel="noopener">Visit SADAG for more support</a></p></section>';
  document.body.append(helpButton, helpModal);
  function closeHelp(){helpModal.hidden=true;}
  helpButton.addEventListener('click',function(){helpModal.hidden=false;helpModal.querySelector('.modal-close').focus();});
  helpModal.querySelector('.modal-close').addEventListener('click',closeHelp);
  helpModal.addEventListener('click',function(e){if(e.target===helpModal)closeHelp();});

  // Accessibility controls (saved on this device).
  var access = document.createElement('div'); access.className='accessibility-tools';
  access.innerHTML='<button type="button" id="text-size-toggle" aria-pressed="false">A+ Text</button><button type="button" id="contrast-toggle" aria-pressed="false">High contrast</button>';
  var navActions=document.querySelector('.nav-actions'); (navActions||document.body).appendChild(access);
  if(localStorage.getItem('nash-large-text')==='true'){document.documentElement.classList.add('large-text');}
  if(localStorage.getItem('nash-high-contrast')==='true'){document.documentElement.classList.add('high-contrast');}
  var textBtn=document.getElementById('text-size-toggle'), contrastBtn=document.getElementById('contrast-toggle');
  textBtn.setAttribute('aria-pressed',String(document.documentElement.classList.contains('large-text')));
  contrastBtn.setAttribute('aria-pressed',String(document.documentElement.classList.contains('high-contrast')));
  textBtn.addEventListener('click',function(){var on=document.documentElement.classList.toggle('large-text');localStorage.setItem('nash-large-text',on);textBtn.setAttribute('aria-pressed',String(on));});
  contrastBtn.addEventListener('click',function(){var on=document.documentElement.classList.toggle('high-contrast');localStorage.setItem('nash-high-contrast',on);contrastBtn.setAttribute('aria-pressed',String(on));});

  // Therapist search and dropdown filters.
  var search=document.getElementById('therapist-search'), spec=document.getElementById('speciality-filter'), gender=document.getElementById('gender-filter');
  if(search&&spec&&gender){var cards=Array.from(document.querySelectorAll('.therapist-card')), count=document.getElementById('therapist-count');function applyFilters(){var q=search.value.trim().toLowerCase(),s=spec.value.toLowerCase(),g=gender.value.toLowerCase(),shown=0;cards.forEach(function(card){var text=card.textContent.toLowerCase(), id=(card.querySelector('a[href*=\"?t=\"]')||{}).href, therapistId=id?new URL(id).searchParams.get('t'):null, profile=(window.NASH_THERAPISTS||{})[therapistId], genderText=profile?profile.tags.join(' ').toLowerCase():'';var matches=(!q||text.includes(q))&&(!s||text.includes(s)||(s==='academic stress'&&text.includes('student stress')))&&(!g||genderText.includes(g));card.hidden=!matches;if(matches)shown++;});count.textContent=shown+' therapist'+(shown===1?'':'s')+' found';} [search,spec,gender].forEach(function(el){el.addEventListener('input',applyFilters);el.addEventListener('change',applyFilters);});applyFilters();}

  // Three-question recommendation quiz.
  var quizForm=document.getElementById('quiz-form'); if(quizForm){var modal=document.getElementById('quiz-modal');document.getElementById('open-quiz').addEventListener('click',function(){modal.hidden=false;});document.getElementById('close-quiz').addEventListener('click',function(){modal.hidden=true;});modal.addEventListener('click',function(e){if(e.target===modal)modal.hidden=true;});quizForm.addEventListener('submit',function(e){e.preventDefault();var focus=document.getElementById('quiz-focus').value, pref=document.getElementById('quiz-gender').value, style=document.getElementById('quiz-style').value;var data=window.NASH_THERAPISTS||{}, ranked=Object.keys(data).map(function(id){var t=data[id],tags=t.tags.join(' ').toLowerCase(),score=(tags.includes(focus.toLowerCase())?4:0)+(pref==='Any'||tags.includes(pref.toLowerCase())?2:0)+(style==='Student support'&&t.cred.toLowerCase().includes('year')?1:0)+(style==='Practical tools'&&/practical|mindfulness/i.test(t.about)?1:0)+(style==='Warm approach'&&/warm|compassion/i.test(t.about)?1:0);return{id:id,t:t,score:score};}).sort(function(a,b){return b.score-a.score;});var best=ranked[0];var result=document.getElementById('quiz-result');result.innerHTML='';var heading=document.createElement('h3');heading.textContent='A therapist to explore';var para=document.createElement('p');para.textContent=best.t.name+' may be a good starting point based on your answers. This is only a suggestion; you can view other profiles too.';var link=document.createElement('a');link.className='btn btn-primary';link.href='therapist-profile.html?t='+best.id;link.textContent='View '+best.t.first+"'s profile";result.append(heading,para,link);});}
})();
