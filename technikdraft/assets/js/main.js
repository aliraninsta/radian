/**
 * TechnikNet – page behaviour.
 *
 * The animation part is the design's own script (technikLAN), unchanged in
 * values and timings. Differences: click handlers are attached here instead
 * of inline, the language switch is a real link to /de/ or /en/, and the two
 * forms send real e-mails.
 */
(function () {
  'use strict';

  var TN = window.TN || { strings: {}, stats: {} };
  var S = TN.strings;
  var $ = function (id) { return document.getElementById(id); };
  var hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  var isHome = !!$('home');

  /* ------------------------------------------------------------------ */
  /* Toast                                                               */
  /* ------------------------------------------------------------------ */
  var toastTimer = null;
  function showToast(message) {
    var toast = $('toast-notif');
    if (!toast) { return; }
    $('toast-text').innerText = message;
    toast.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
    toast.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
      toast.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
    }, 3500);
  }

  /* ------------------------------------------------------------------ */
  /* Header: logo swap + back to top (design: early swap at 20px)        */
  /* ------------------------------------------------------------------ */
  var navbar = $('navbar');
  var backToTopBtn = $('backToTop');
  var navContainer = $('nav-container');
  var navLogo = $('nav-logo');
  var logoIsSignet = false;

  function swapLogo(toSignet) {
    if (toSignet === logoIsSignet) { return; }
    logoIsSignet = toSignet;
    var apply = function () {
      if (toSignet) {
        navLogo.src = TN.signet;
        navLogo.classList.remove('h-6', 'sm:h-7', 'md:h-8', 'tng-logo-halo');
        navLogo.classList.add('h-7', 'sm:h-8', 'md:h-9');
        navLogo.style.filter = 'none';
      } else {
        navLogo.src = TN.logo;
        navLogo.classList.remove('h-7', 'sm:h-8', 'md:h-9');
        navLogo.classList.add('h-6', 'sm:h-7', 'md:h-8', 'tng-logo-halo');
        navLogo.style.filter = '';
      }
    };
    if (hasGsap) {
      gsap.to(navLogo, { opacity: 0, scale: 0.8, duration: 0.12, onComplete: function () {
        apply();
        gsap.to(navLogo, { opacity: 1, scale: 1, duration: 0.18 });
      } });
    } else {
      apply();
    }
  }

  function onScrollHeader() {
    if (window.scrollY > 20) {
      navbar.classList.add('bg-white/90', 'backdrop-blur-md', 'border-slate-200', 'shadow-md');
      navbar.classList.remove('border-transparent');
      navContainer.classList.remove('h-20');
      navContainer.classList.add('h-14');
      swapLogo(true);
    } else {
      navbar.classList.remove('bg-white/90', 'backdrop-blur-md', 'border-slate-200', 'shadow-md');
      navbar.classList.add('border-transparent');
      navContainer.classList.remove('h-14');
      navContainer.classList.add('h-20');
      swapLogo(false);
    }

    if (window.scrollY > 400) {
      backToTopBtn.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
      backToTopBtn.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');
    } else {
      backToTopBtn.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
      backToTopBtn.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
    }
  }

  if (navbar && navContainer && navLogo) {
    // Preload the signet so the swap is instant.
    var pre = new Image(); pre.src = TN.signet;
    window.addEventListener('scroll', onScrollHeader, { passive: true });
    onScrollHeader();
  }

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  var brand = $('nav-brand');
  if (brand && isHome) {
    brand.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Navigation active state + scroll spy                                */
  /* ------------------------------------------------------------------ */
  function setActiveNav(selectedEl) {
    document.querySelectorAll('#nav-links .nav-item').forEach(function (item) {
      item.classList.remove('text-[#0099CC]', 'font-bold');
      item.classList.add('text-slate-700');
      item.removeAttribute('aria-current');
      var ind = item.querySelector('.nav-indicator');
      if (ind) { ind.classList.remove('w-full'); ind.classList.add('w-0'); }
    });
    if (selectedEl) {
      selectedEl.classList.remove('text-slate-700');
      selectedEl.classList.add('text-[#0099CC]', 'font-bold');
      selectedEl.setAttribute('aria-current', 'true');
      var activeInd = selectedEl.querySelector('.nav-indicator');
      if (activeInd) { activeInd.classList.remove('w-0'); activeInd.classList.add('w-full'); }
    }
  }

  function setActiveNavMobile(selectedEl) {
    document.querySelectorAll('.mobile-nav-item').forEach(function (item) {
      item.classList.remove('text-[#0099CC]', 'font-bold');
      item.classList.add('text-slate-700', 'font-semibold');
    });
    if (selectedEl) {
      selectedEl.classList.remove('text-slate-700', 'font-semibold');
      selectedEl.classList.add('text-[#0099CC]', 'font-bold');
    }
  }

  function toggleMobileMenu() {
    var menu = $('mobile-menu');
    var open = menu.classList.contains('hidden');
    menu.classList.toggle('hidden', !open);
    $('menu-icon-hamburger').classList.toggle('hidden', open);
    $('menu-icon-close').classList.toggle('hidden', !open);
    $('mobile-menu-btn').setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  if ($('mobile-menu-btn')) {
    $('mobile-menu-btn').addEventListener('click', toggleMobileMenu);
  }
  function jumpTo(id) {
    var el = $(id);
    if (!el) { return false; }
    window.scrollTo(0, el.getBoundingClientRect().top + window.pageYOffset);
    return true;
  }
  document.querySelectorAll('#nav-links .nav-item').forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (isHome && a.getAttribute('data-anchor') === '1' && jumpTo(a.getAttribute('data-section'))) {
        e.preventDefault(); setActiveNav(a);
      }
    });
  });
  document.querySelectorAll('.mobile-nav-item').forEach(function (a) {
    a.addEventListener('click', function (e) {
      toggleMobileMenu();
      if (isHome && a.getAttribute('data-anchor') === '1' && jumpTo(a.getAttribute('data-section'))) {
        e.preventDefault(); setActiveNavMobile(a);
      }
    });
  });

  var sectionIds = ['home', 'services', 'stats', 'career', 'estimator'];
  function updateScrollSpy() {
    var scrollY = window.pageYOffset;
    sectionIds.forEach(function (id) {
      var el = $(id);
      if (!el) { return; }
      var top = el.offsetTop - 140;
      var height = el.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        var d = document.querySelector('#nav-links a[data-section="' + id + '"]');
        var m = document.querySelector('#mobile-menu a[data-section="' + id + '"]');
        // Sections without a menu item (e.g. Metriken) clear the highlight.
        var anyActive = function (sel) { return [].some.call(document.querySelectorAll(sel), function (x) { return x.classList.contains('text-[#0099CC]'); }); };
        if (!d) { if (anyActive('#nav-links .nav-item')) { setActiveNav(null); } }
        else if (!d.classList.contains('text-[#0099CC]')) { setActiveNav(d); }
        if (!m) { if (anyActive('.mobile-nav-item')) { setActiveNavMobile(null); } }
        else if (!m.classList.contains('text-[#0099CC]')) { setActiveNavMobile(m); }
      }
    });
  }

  if (isHome) {
    window.addEventListener('scroll', updateScrollSpy, { passive: true });
    $('hero-scroll-indicator').addEventListener('click', function (e) {
      e.preventDefault();
      $('services').scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* CTA: smooth scroll when it points to a section on the same page. */
  var cta = $('cta-btn');
  if (cta && cta.getAttribute('href').charAt(0) === '#' && $(cta.getAttribute('href').slice(1))) {
    cta.addEventListener('click', function (e) {
      e.preventDefault();
      $(cta.getAttribute('href').slice(1)).scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Scroll animations (values and timings from the design)              */
  /* ------------------------------------------------------------------ */
  var regionalStats = TN.stats;
  var first = regionalStats.de || { fiber: 0, homes: 0, crews: 0, satisfaction: 0 };
  var statsState = { fiber: first.fiber, homes: first.homes, crews: first.crews, satisfaction: first.satisfaction };

  function renderStats() {
    $('stat-fiber-km').innerText = Math.floor(statsState.fiber).toLocaleString() + '+';
    $('stat-homes').innerText = Math.floor(statsState.homes).toLocaleString();
    $('stat-crews').innerText = Math.floor(statsState.crews).toLocaleString();
    $('stat-satisfaction').innerText = statsState.satisfaction.toFixed(1) + '%';
  }

  function animateStatsTransition(targetData) {
    if (!hasGsap) {
      statsState = Object.assign({}, targetData);
      renderStats();
      return;
    }
    gsap.to(statsState, {
      fiber: targetData.fiber,
      homes: targetData.homes,
      crews: targetData.crews,
      satisfaction: targetData.satisfaction,
      duration: 1.2,
      ease: 'power2.out',
      onUpdate: renderStats
    });
  }

  if ($('region-selector')) $('region-selector').addEventListener('change', function () {
    if (regionalStats[this.value]) { animateStatsTransition(regionalStats[this.value]); }
  });

  if (hasGsap) {
    gsap.registerPlugin(ScrollTrigger);

    var hasTimeline = !!$('timeline-container');
    // Dynamic brand color transition on scroll
    if (hasTimeline) gsap.to(':root', {
      '--c-primary': '#0284C7',
      '--c-primary-rgb': '2, 132, 199',
      '--c-light': '#38BDF8',
      '--c-glow': 'rgba(0, 153, 204, 0.45)',
      '--c-bg': '#F1F5F9',
      ease: 'none',
      scrollTrigger: { trigger: '#timeline-container', start: 'top 80%', end: 'bottom 50%', scrub: 1 }
    });

    if (isHome) {
    // Scroll floating & scaling for the hero logo
    gsap.to('#hero-logo-img', {
      scale: 0.95, ease: 'power1.out',
      scrollTrigger: { trigger: '#home', start: 'top top', end: 'bottom top', scrub: 0.6 }
    });
    gsap.to('#hero-logo-wrapper', {
      y: -65, rotation: 0.8, ease: 'power1.out',
      scrollTrigger: { trigger: '#home', start: 'top top', end: 'bottom top', scrub: 0.8 }
    });
    gsap.to('#hero-sub', {
      letterSpacing: '0.035em', ease: 'power1.out',
      scrollTrigger: { trigger: '#home', start: 'top top', end: 'bottom top', scrub: 0.6 }
    });
    gsap.to('#hero-sub-wrapper', {
      y: -42, rotation: -0.6, ease: 'power1.out',
      scrollTrigger: { trigger: '#home', start: 'top top', end: 'bottom top', scrub: 0.8 }
    });

    // Mouse scroll indicator
    gsap.to('#hero-scroll-indicator', {
      opacity: 0, y: -35, scale: 0.8, ease: 'power2.out',
      scrollTrigger: { trigger: '#service-block-ne3', start: 'top 85%', end: 'center 55%', scrub: true }
    });

    }

    // Vertical laser line growth
    if ($('verticalLine')) gsap.to('#verticalLine', {
      height: '100%', ease: 'none',
      scrollTrigger: { trigger: '#timeline-container', start: 'top 60%', end: 'bottom 72%', scrub: 0.5 }
    });

    // Edge-to-edge horizontal split
    if (hasTimeline) gsap.to(['#bottomHorizontalLeft', '#bottomHorizontalRight'], {
      width: '50%', ease: 'power2.out',
      scrollTrigger: { trigger: '#timeline-container', start: 'bottom 72%', toggleActions: 'play none none reverse' }
    });

    // Service blocks
    document.querySelectorAll('.service-block').forEach(function (block, index) {
      var node = block.querySelector('.node');
      var contents = block.querySelectorAll('.content-block');
      if (node) {
        gsap.fromTo(node, { scale: 0.5, opacity: 0.4 }, {
          scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.5)',
          scrollTrigger: { trigger: block, start: 'top 75%', toggleActions: 'play none none reverse' }
        });
      }
      contents.forEach(function (content, idx) {
        var xOffset = (index % 2 === 0) ? (idx === 0 ? -30 : 30) : (idx === 0 ? 30 : -30);
        gsap.fromTo(content, { opacity: 0, x: xOffset, y: 15 }, {
          opacity: 1, x: 0, y: 0, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: block, start: 'top 75%', toggleActions: 'play none none reverse' }
        });
      });
    });

    // Fibre line under the head of inner pages lights up once
    document.querySelectorAll('.tn-head-line').forEach(function (line) {
      gsap.to(line, { width: '100%', duration: 1.4, ease: 'power2.out', delay: 0.15 });
    });
    document.querySelectorAll('.tn-head-node').forEach(function (n) {
      gsap.fromTo(n, { scale: 0.5, opacity: 0.4 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.5)' });
    });

    // Stats
    var countersInitiated = false;
    if ($('stats')) ScrollTrigger.create({
      trigger: '#stats', start: 'top 80%',
      onEnter: function () {
        if (!countersInitiated) { countersInitiated = true; animateStatsTransition(regionalStats.de); }
      }
    });

    window.addEventListener('load', function () { ScrollTrigger.refresh(); updateScrollSpy(); });
  } else {
    // Without GSAP the lines are shown complete.
    if ($('verticalLine')) {
      $('verticalLine').style.height = '100%';
      $('bottomHorizontalLeft').style.width = '50%';
      $('bottomHorizontalRight').style.width = '50%';
    }
    document.querySelectorAll('.tn-head-line').forEach(function (l) { l.style.width = '100%'; });
  }
  if (isHome) { updateScrollSpy(); }

  /* ------------------------------------------------------------------ */
  /* Anti-spam token (fetched fresh when a form is opened)               */
  /* ------------------------------------------------------------------ */
  var token = null;
  function getToken() {
    if (token) { return Promise.resolve(token); }
    return fetch(TN.ajax + '?action=tn_token', { credentials: 'same-origin' })
      .then(function (r) { return r.json(); })
      .then(function (d) { token = d.token; return token; })
      .catch(function () { return ''; });
  }

  function send(action, formData) {
    return getToken().then(function (t) {
      formData.append('action', action);
      formData.append('token', t);
      formData.append('lang', TN.lang);
      return fetch(TN.ajax, { method: 'POST', body: formData, credentials: 'same-origin' });
    }).then(function (r) { return r.json(); })
      .catch(function () { return { ok: false, message: S.msgError }; });
  }

  /* ------------------------------------------------------------------ */
  /* Project wizard                                                      */
  /* ------------------------------------------------------------------ */
  var currentStep = 1;
  var selectedLevel = null;
  var busy = false;
  var nextBtn = $('wizard-next-btn');
  if (nextBtn) (function () {
  var prevBtn = $('wizard-prev');
  var levels = document.querySelectorAll('#step-1 [data-level]');

  function selectLevel(level) {
    selectedLevel = level;
    levels.forEach(function (el) {
      el.classList.remove('border-[#0099CC]', 'bg-sky-50/40');
      el.classList.add('border-slate-200', 'bg-slate-50/50');
      el.setAttribute('aria-checked', 'false');
    });
    var sel = $('level-' + level);
    sel.classList.add('border-[#0099CC]', 'bg-sky-50/40');
    sel.classList.remove('border-slate-200', 'bg-slate-50/50');
    sel.setAttribute('aria-checked', 'true');
  }
  levels.forEach(function (el) {
    el.addEventListener('click', function () { selectLevel(el.getAttribute('data-level')); });
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectLevel(el.getAttribute('data-level')); }
    });
  });

  function updateRangeVal(val) { $('range-val').innerText = val + '+'; }
  $('project-scope-range').addEventListener('input', function () { updateRangeVal(this.value); });

  function transitionWizard(from, to) {
    var done = function () {
      $('step-' + from).classList.add('hidden');
      $('step-' + to).classList.remove('hidden');
      if (hasGsap) { gsap.fromTo('#step-' + to, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3 }); }
    };
    if (hasGsap) { gsap.to('#step-' + from, { opacity: 0, y: -10, duration: 0.2, onComplete: done }); } else { done(); }
  }

  function updateProgress(percentage) {
    $('wizard-progress-bar').style.width = percentage + '%';
    var node2 = $('step-node-2');
    var node3 = $('step-node-3');
    node2.classList.toggle('bg-[#0099CC]', percentage >= 50);
    node2.classList.toggle('text-white', percentage >= 50);
    node2.classList.toggle('bg-slate-100', percentage < 50);
    node2.classList.toggle('text-slate-400', percentage < 50);
    node3.classList.toggle('bg-[#0099CC]', percentage >= 100);
    node3.classList.toggle('text-white', percentage >= 100);
    node3.classList.toggle('bg-slate-100', percentage < 100);
    node3.classList.toggle('text-slate-400', percentage < 100);
  }

  function resetWizard() {
    $('estimator-form').reset();
    selectedLevel = null;
    levels.forEach(function (el) {
      el.classList.remove('border-[#0099CC]', 'bg-sky-50/40');
      el.classList.add('border-slate-200', 'bg-slate-50/50');
      el.setAttribute('aria-checked', 'false');
    });
    $('project-scope-range').value = 50;
    updateRangeVal(50);
    transitionWizard(3, 1);
    currentStep = 1;
    prevBtn.classList.add('invisible');
    nextBtn.innerText = S.btnNext;
    updateProgress(0);
  }

  function submitEstimator() {
    if (busy) { return; }
    busy = true;
    nextBtn.innerText = S.msgSending;
    var form = $('estimator-form');
    var fd = new FormData(form);
    fd.append('level', selectedLevel || '');
    fd.append('scope', $('project-scope-range').value);
    send('tn_inquiry', fd).then(function (res) {
      busy = false;
      if (res && res.ok) {
        showToast(res.message || S.msgInquiryOk);
        token = null;
        resetWizard();
      } else {
        nextBtn.innerText = S.btnSend;
        showToast((res && res.message) || S.msgError);
      }
    });
  }

  nextBtn.addEventListener('click', function () {
    if (currentStep === 1) {
      if (!selectedLevel) { showToast(S.msgPickLevel); return; }
      transitionWizard(1, 2);
      currentStep = 2;
      prevBtn.classList.remove('invisible');
      updateProgress(50);
    } else if (currentStep === 2) {
      transitionWizard(2, 3);
      currentStep = 3;
      nextBtn.innerText = S.btnSend;
      updateProgress(100);
      getToken();
    } else if (currentStep === 3) {
      var form = $('estimator-form');
      if (form.checkValidity()) { submitEstimator(); } else { form.reportValidity(); }
    }
  });

  $('estimator-form').addEventListener('submit', function (e) {
    e.preventDefault();
    if (currentStep === 3 && this.checkValidity()) { submitEstimator(); }
  });

  prevBtn.addEventListener('click', function () {
    if (currentStep === 2) {
      transitionWizard(2, 1);
      currentStep = 1;
      prevBtn.classList.add('invisible');
      updateProgress(0);
    } else if (currentStep === 3) {
      transitionWizard(3, 2);
      currentStep = 2;
      nextBtn.innerText = S.btnNext;
      updateProgress(50);
    }
  });

  // Level chosen on a service page (…/contact/?level=ne4)
  var pre = /[?&]level=(ne[345])/.exec(window.location.search);
  if (pre && $('level-' + pre[1])) { selectLevel(pre[1]); }
  })();

  /* NE3/NE4/NE5 sliding pill tab (templates/service.php): the indicator's
     true position is already correct on load (server-rendered, matches
     the current page — these are real page links, not an in-page switch).
     This only adds a hover preview, sliding the pill to whichever tab the
     pointer is over and snapping back to the real active tab on mouseleave.
     Placed here, before the apply-modal's early `return` below (which
     exits this whole IIFE on any page without that modal, e.g. Services) —
     don't move this after that guard again. */
  var neTabs = document.getElementById('ne-tabs');
  var neIndicator = document.getElementById('ne-tab-indicator');
  if (neTabs && neIndicator) {
    var neLinks = neTabs.querySelectorAll('[data-ne-tab]');
    var neActiveIndex = 0;
    neLinks.forEach(function (a, i) { if (a.getAttribute('aria-current') === 'page') { neActiveIndex = i; } });
    var neSetHighlight = function (i) {
      neIndicator.style.transform = 'translateX(' + (i * 100) + '%)';
      neLinks.forEach(function (a, j) {
        a.classList.toggle('text-white', j === i);
        a.classList.toggle('text-[#333333]', j !== i);
      });
    };
    neLinks.forEach(function (a, i) {
      a.addEventListener('mouseenter', function () { neSetHighlight(i); });
    });
    neTabs.addEventListener('mouseleave', function () { neSetHighlight(neActiveIndex); });
  }

  /* ------------------------------------------------------------------ */
  /* Apply modal                                                         */
  /* ------------------------------------------------------------------ */
  var modal = $('apply-modal');
  var applyForm = $('apply-form');
  var lastFocus = null;
  if (!modal) { return; }

  function openApplyModal(jobTitle) {
    lastFocus = document.activeElement;
    $('modal-job-title').innerText = jobTitle;
    $('apply-job').value = jobTitle;
    modal.classList.remove('opacity-0', 'pointer-events-none');
    modal.setAttribute('aria-hidden', 'false');
    if (hasGsap) { gsap.fromTo(modal.querySelector('.bg-white'), { scale: 0.9, y: 20 }, { scale: 1, y: 0, duration: 0.3 }); }
    getToken();
    setTimeout(function () { $('apply-name').focus(); }, 50);
  }

  function closeApplyModal() {
    var finish = function () {
      modal.classList.add('opacity-0', 'pointer-events-none');
      modal.setAttribute('aria-hidden', 'true');
      applyForm.reset();
      if (lastFocus) { lastFocus.focus(); }
    };
    if (hasGsap) { gsap.to(modal.querySelector('.bg-white'), { scale: 0.9, y: 20, duration: 0.2, onComplete: finish }); } else { finish(); }
  }

  document.querySelectorAll('[data-apply]').forEach(function (btn) {
    btn.addEventListener('click', function () { openApplyModal(btn.getAttribute('data-apply')); });
  });
  $('apply-close').addEventListener('click', closeApplyModal);
  modal.addEventListener('click', function (e) { if (e.target === modal) { closeApplyModal(); } });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') { closeApplyModal(); }
  });

  applyForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!applyForm.checkValidity()) { applyForm.reportValidity(); return; }
    var file = $('apply-cv').files[0];
    if (file && (file.size > 5 * 1024 * 1024 || !/\.pdf$/i.test(file.name))) { showToast(S.msgPdf); return; }
    var btn = applyForm.querySelector('button[type="submit"]');
    var label = btn.innerText;
    btn.disabled = true;
    btn.innerText = S.msgSending;
    send('tn_apply', new FormData(applyForm)).then(function (res) {
      btn.disabled = false;
      btn.innerText = label;
      if (res && res.ok) {
        token = null;
        closeApplyModal();
        showToast(res.message || S.msgApplyOk);
      } else {
        showToast((res && res.message) || S.msgError);
      }
    });
  });
})();
