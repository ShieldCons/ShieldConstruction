/**
 * Shield Construction LLC — Main JavaScript
 * Shared components, forms, popup, gallery, carousel
 */

(function () {
  'use strict';

  const PHONE_DISPLAY = '(770) 558-5151';
  const PHONE_TEL = '7705585151';
  const LOGO_SRC = 'assets/images/Shield_Logo.png';
  const LOGO_ALT = 'Shield Construction LLC';
  const FORM_COOLDOWN_MS = 60 * 1000;
  const FORM_COOLDOWN_KEY_PREFIX = 'shield_form_submit_';

  const SERVICE_AREAS = [
    'Duluth', 'Johns Creek', 'Alpharetta', 'Suwanee', 'Cumming', 'Lawrenceville',
    'Buford', 'Dacula', 'Norcross', 'Peachtree Corners', 'Roswell', 'Sandy Springs',
    'Gwinnett County', 'Fulton County', 'Forsyth County', 'Hall County'
  ];

  const SERVICE_COUNTIES = [
    'Gwinnett County', 'Fulton County', 'Forsyth County', 'Hall County'
  ];

  const SERVICE_OFFERINGS = [
    'Water Damage Restoration',
    'Emergency Water Extraction',
    'Structural Drying',
    'Mold Remediation',
    'Storm Damage Repair',
    'Roof Tarping',
    'Reconstruction & Repairs',
    'Insurance Claim Assistance'
  ];

  const NAV_ITEMS = [
    { href: 'index.html', label: 'Home' },
    { href: 'about.html', label: 'About Us' },
    { href: 'services.html', label: 'Services' },
    { href: 'insurance-claims.html', label: 'Insurance Claims' },
    { href: 'gallery.html', label: 'Gallery' },
    { href: 'contact.html', label: 'Contact' }
  ];

  /* ── Gallery image slots — upload files to assets/images/gallery/ ── */
  const GALLERY_BASE = 'assets/images/gallery';
  const GALLERY_SIZES = {
    homeThumb: { w: 600, h: 450 },
    gridThumb: { w: 600, h: 450 },
    gridFull: { w: 1200, h: 900 },
    beforeAfter: { w: 400, h: 300 }
  };

  const GALLERY_HOME_ITEMS = [
    { file: 'home/01.jpg', full: 'water/01-full.jpg', label: 'Water Damage', alt: 'Water damage restoration', position: 'center' },
    { file: 'home/02.jpg', full: 'drying/01-full.jpg', label: 'Drying Equipment', alt: 'Structural drying equipment', position: 'center' },
    { file: 'home/03.jpg', full: 'mold/01-full.jpg', label: 'Mold Remediation', alt: 'Mold remediation project', position: 'center' },
    { file: 'home/04.jpg', full: 'reconstruction/01-full.jpg', label: 'Reconstruction', alt: 'Reconstruction project', position: 'center' }
  ];

  const GALLERY_ITEMS = [
    {
      category: 'water',
      label: 'Water Damage — Duluth',
      alt: 'Water damage restoration',
      beforeAfter: true,
      before: 'water/01-before.jpg',
      after: 'water/01-after.jpg',
      full: 'water/01-full.jpg',
      position: 'center'
    },
    {
      category: 'drying',
      label: 'Drying Equipment',
      alt: 'Structural drying setup',
      thumb: 'drying/01-thumb.jpg',
      full: 'drying/01-full.jpg',
      position: 'center top'
    },
    {
      category: 'mold',
      label: 'Mold Remediation — Johns Creek',
      alt: 'Mold remediation project',
      thumb: 'mold/01-thumb.jpg',
      full: 'mold/01-full.jpg',
      position: 'center'
    },
    {
      category: 'reconstruction',
      label: 'Reconstruction — Alpharetta',
      alt: 'Reconstruction project',
      thumb: 'reconstruction/01-thumb.jpg',
      full: 'reconstruction/01-full.jpg',
      position: 'center'
    },
    {
      category: 'storm',
      label: 'Storm Damage — Suwanee',
      alt: 'Storm damage repair',
      thumb: 'storm/01-thumb.jpg',
      full: 'storm/01-full.jpg',
      position: 'center'
    },
    {
      category: 'water',
      label: 'Water Mitigation — Cumming',
      alt: 'Water mitigation project',
      thumb: 'water/02-thumb.jpg',
      full: 'water/02-full.jpg',
      position: 'center'
    }
  ];

  function gallerySrc(path) {
    return GALLERY_BASE + '/' + path;
  }

  function buildGalleryMedia(path, alt, size, position) {
    const pos = position || 'center';
    return (
      '<div class="gallery-media">' +
        '<img src="' + gallerySrc(path) + '" alt="' + alt + '" class="gallery-img" width="' + size.w + '" height="' + size.h + '" loading="lazy" style="object-position:' + pos + ';" data-upload="' + path + '">' +
        '<span class="gallery-media__placeholder">' +
          '<strong>Upload photo</strong>' +
          '<span>' + path + '</span>' +
          '<span>' + size.w + ' × ' + size.h + ' px</span>' +
        '</span>' +
      '</div>'
    );
  }

  function renderGalleryPreview() {
    return GALLERY_HOME_ITEMS.map(function (item) {
      return (
        '<div class="gallery-card" data-lightbox="' + gallerySrc(item.full) + '" data-alt="' + item.alt + '">' +
          buildGalleryMedia(item.file, item.alt, GALLERY_SIZES.homeThumb, item.position) +
          '<div class="gallery-card__overlay">' + item.label + '</div>' +
        '</div>'
      );
    }).join('');
  }

  function renderGalleryFull() {
    return GALLERY_ITEMS.map(function (item) {
      if (item.beforeAfter) {
        return (
          '<div class="gallery-item" data-category="' + item.category + '" data-lightbox="' + gallerySrc(item.full) + '" data-alt="' + item.alt + '">' +
            '<div class="before-after">' +
              '<div class="before-after__cell">' +
                buildGalleryMedia(item.before, 'Before — ' + item.alt, GALLERY_SIZES.beforeAfter, item.position) +
                '<span>Before</span>' +
              '</div>' +
              '<div class="before-after__cell">' +
                buildGalleryMedia(item.after, 'After — ' + item.alt, GALLERY_SIZES.beforeAfter, item.position) +
                '<span>After</span>' +
              '</div>' +
            '</div>' +
            '<div class="gallery-item__label">' + item.label + '</div>' +
          '</div>'
        );
      }

      return (
        '<div class="gallery-item" data-category="' + item.category + '" data-lightbox="' + gallerySrc(item.full) + '" data-alt="' + item.alt + '">' +
          buildGalleryMedia(item.thumb, item.alt, GALLERY_SIZES.gridThumb, item.position) +
          '<div class="gallery-item__label">' + item.label + '</div>' +
        '</div>'
      );
    }).join('');
  }

  function injectGallery() {
    const previewSlot = document.getElementById('gallery-preview');
    const fullSlot = document.getElementById('gallery-full');
    if (previewSlot) previewSlot.innerHTML = renderGalleryPreview();
    if (fullSlot) fullSlot.innerHTML = renderGalleryFull();
  }

  function initGalleryImages() {
    document.querySelectorAll('.gallery-media').forEach(function (wrap) {
      const img = wrap.querySelector('img');
      if (!img) return;

      function markMissing() {
        wrap.classList.add('is-missing');
      }

      img.addEventListener('error', markMissing);
      if (img.complete && !img.naturalWidth) markMissing();
    });
  }

  /* ── Google Sheets Lead Capture ── */
  function getGoogleScriptUrl() {
    const config = window.SITE_CONFIG || {};
    return (config.GOOGLE_SCRIPT_URL || '').trim();
  }

  function isGoogleSheetsConfigured() {
    return getGoogleScriptUrl().length > 0 && getGoogleScriptUrl().indexOf('script.google.com') !== -1;
  }

  /**
   * Submit form data to Google Sheets via Apps Script Web App.
   * Configure GOOGLE_SCRIPT_URL in js/config.js — see scripts/setup-google-sheets.md
   */
  async function submitToGoogleSheet(formData) {
    const scriptUrl = getGoogleScriptUrl();

    if (!isGoogleSheetsConfigured()) {
      console.warn('[Shield Construction] Google Apps Script URL not configured. Set js/config.js');
      await new Promise(function (r) { setTimeout(r, 800); });
      return { ok: true, demo: true };
    }

    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(formData)
    });

    const text = await response.text();
    var result = { ok: true };
    try {
      result = JSON.parse(text);
    } catch (parseErr) {
      if (!response.ok) {
        throw new Error('Submission failed');
      }
    }

    if (!result.ok) {
      return result;
    }

    return { ok: true };
  }

  function getFormCooldownKey(formId) {
    return FORM_COOLDOWN_KEY_PREFIX + formId;
  }

  function getFormCooldownRemaining(formId) {
    const raw = localStorage.getItem(getFormCooldownKey(formId));
    if (!raw) return 0;
    const remaining = parseInt(raw, 10) - Date.now();
    return remaining > 0 ? remaining : 0;
  }

  function setFormCooldown(formId) {
    localStorage.setItem(getFormCooldownKey(formId), String(Date.now() + FORM_COOLDOWN_MS));
  }

  function isHoneypotFilled(form) {
    const field = form.querySelector('[data-hp]');
    return field && field.value.trim().length > 0;
  }

  function setSubmitButtonDisabled(form, disabled) {
    const btn = form.querySelector('button[type="submit"]');
    if (!btn) return;
    btn.disabled = disabled;
    if (!btn.dataset.defaultLabel) {
      btn.dataset.defaultLabel = btn.textContent;
    }
    btn.textContent = disabled ? 'Please wait...' : btn.dataset.defaultLabel;
  }

  function getCurrentPage() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    return path === '' ? 'index.html' : path;
  }

  function renderServiceAreaMap(compact) {
    const markers = [
      { name: 'Cumming', x: 248, y: 72 },
      { name: 'Alpharetta', x: 268, y: 98 },
      { name: 'Roswell', x: 228, y: 118 },
      { name: 'Johns Creek', x: 318, y: 102 },
      { name: 'Duluth', x: 292, y: 128, hub: true },
      { name: 'Suwanee', x: 338, y: 138 },
      { name: 'Buford', x: 388, y: 108 },
      { name: 'Lawrenceville', x: 372, y: 158 },
      { name: 'Norcross', x: 278, y: 152 },
      { name: 'Peachtree Corners', x: 302, y: 168 },
      { name: 'Sandy Springs', x: 208, y: 158 },
      { name: 'Dacula', x: 408, y: 132 }
    ];

    const markerSvg = markers.map(function (m) {
      const r = m.hub ? 7 : 5;
      const fill = m.hub ? '#FF6B00' : '#0B4F8C';
      const pulse = m.hub
        ? '<circle cx="' + m.x + '" cy="' + m.y + '" r="14" fill="#FF6B00" opacity="0.2"><animate attributeName="r" values="10;18;10" dur="2.5s" repeatCount="indefinite"/></circle>'
        : '';
      const label = compact ? '' : '<text x="' + m.x + '" y="' + (m.y - 10) + '" text-anchor="middle" class="service-area-map__label">' + m.name + '</text>';
      return pulse +
        '<circle cx="' + m.x + '" cy="' + m.y + '" r="' + r + '" fill="' + fill + '" stroke="#fff" stroke-width="2"/>' +
        label;
    }).join('');

    const countyTags = SERVICE_COUNTIES.map(function (name) {
      return '<span class="service-area-map__county">' + name.replace(' County', '') + ' Co.</span>';
    }).join('');

    const compactClass = compact ? ' service-area-map--compact' : '';

    return (
      '<div class="service-area-map' + compactClass + '" role="img" aria-label="Shield Construction service area covering Metro Atlanta and North Georgia counties">' +
        '<div class="service-area-map__visual">' +
          '<svg viewBox="0 0 520 220" class="service-area-map__svg" aria-hidden="true">' +
            '<defs>' +
              '<linearGradient id="area-bg" x1="0%" y1="0%" x2="100%" y2="100%">' +
                '<stop offset="0%" stop-color="#e8f2fb"/>' +
                '<stop offset="100%" stop-color="#d4e6f7"/>' +
              '</linearGradient>' +
              '<radialGradient id="area-glow" cx="50%" cy="50%" r="50%">' +
                '<stop offset="0%" stop-color="#1E73BE" stop-opacity="0.35"/>' +
                '<stop offset="100%" stop-color="#1E73BE" stop-opacity="0"/>' +
              '</radialGradient>' +
            '</defs>' +
            '<rect width="520" height="220" fill="url(#area-bg)" rx="12"/>' +
            '<ellipse cx="300" cy="118" rx="205" ry="88" fill="url(#area-glow)"/>' +
            '<ellipse cx="300" cy="118" rx="205" ry="88" fill="none" stroke="#1E73BE" stroke-width="1.5" stroke-dasharray="6 5" opacity="0.45"/>' +
            '<ellipse cx="300" cy="118" rx="145" ry="62" fill="none" stroke="#0B4F8C" stroke-width="1" opacity="0.25"/>' +
            '<text x="390" y="52" class="service-area-map__region">Hall</text>' +
            '<text x="400" y="112" class="service-area-map__region">Gwinnett</text>' +
            '<text x="148" y="112" class="service-area-map__region">Fulton</text>' +
            '<text x="248" y="42" class="service-area-map__region">Forsyth</text>' +
            '<text x="300" y="198" class="service-area-map__region service-area-map__region--title">Metro Atlanta Service Area</text>' +
            markerSvg +
          '</svg>' +
        '</div>' +
        '<div class="service-area-map__info">' +
          '<p class="service-area-map__lead">Professional water, mold &amp; storm restoration across North Metro Atlanta.</p>' +
          '<div class="service-area-map__counties">' + countyTags + '</div>' +
          '<p class="service-area-map__note">Don&rsquo;t see your city listed? Call <a href="tel:' + PHONE_TEL + '">' + PHONE_DISPLAY + '</a> &mdash; we may still serve your neighborhood.</p>' +
        '</div>' +
      '</div>'
    );
  }

  function initHeroServiceStrip() {
    const slot = document.getElementById('hero-service-strip');
    if (slot) {
      slot.innerHTML = renderScrollingTicker({
        variant: 'hero',
        label: 'Our Services:',
        items: SERVICE_OFFERINGS,
        ariaLabel: 'Restoration services we offer'
      });
    }
  }

  function initServiceAreaMaps() {
    document.querySelectorAll('[data-service-area-map]').forEach(function (el) {
      el.innerHTML = renderServiceAreaMap(el.hasAttribute('data-compact'));
    });
  }

  function renderScrollingTicker(config) {
    const wrapClass = config.variant === 'hero' ? 'hero-service-ticker' : 'service-area-ticker';
    const items = config.items.map(function (label) {
      return '<span class="' + wrapClass + '__item">' + label + '</span>';
    }).join('');
    return (
      '<div class="' + wrapClass + '" aria-label="' + config.ariaLabel + '">' +
        '<span class="' + wrapClass + '__label">' + config.label + '</span>' +
        '<div class="' + wrapClass + '__viewport">' +
          '<div class="' + wrapClass + '__track">' + items + items + '</div>' +
        '</div>' +
      '</div>'
    );
  }

  function renderTopBar() {
    return (
      '<div class="emergency-bar site-top-bar" role="banner">' +
        '<div class="container emergency-bar__inner">' +
          '<div class="emergency-bar__message">' +
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>' +
            '<span>Licensed Restoration Contractor &mdash; Metro Atlanta</span>' +
          '</div>' +
          '<a class="emergency-bar__phone" href="tel:' + PHONE_TEL + '">' + PHONE_DISPLAY + '</a>' +
          '<div class="emergency-bar__actions">' +
            '<a href="tel:' + PHONE_TEL + '" class="btn btn-accent btn-sm">Call Now</a>' +
            '<a href="contact.html" class="btn btn-outline-white btn-sm">Request Inspection</a>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  function renderHeader() {
    const current = getCurrentPage();
    const navLinks = NAV_ITEMS.map(function (item) {
      const active = item.href === current ? ' active' : '';
      return '<li><a href="' + item.href + '" class="' + active.trim() + '">' + item.label + '</a></li>';
    }).join('');

    return (
      '<header class="site-header" role="navigation">' +
        '<div class="container site-header__inner">' +
          '<button class="nav-toggle" aria-label="Toggle navigation" aria-expanded="false">' +
            '<span></span><span></span><span></span>' +
          '</button>' +
          '<div class="main-nav" id="main-nav">' +
            '<ul class="nav-links">' + navLinks + '</ul>' +
            '<div class="header-ctas">' +
              '<a href="contact.html" class="btn btn-accent btn-sm">Request Inspection</a>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</header>'
    );
  }

  function buildSiteTopWrapper() {
    const emergencySlot = document.getElementById('emergency-bar');
    const headerSlot = document.getElementById('site-header');
    if (!emergencySlot || !headerSlot || document.getElementById('site-top')) return;

    const wrapper = document.createElement('div');
    wrapper.id = 'site-top';
    wrapper.className = 'site-top';

    const logoCol = document.createElement('div');
    logoCol.className = 'site-top__logo';
    logoCol.innerHTML =
      '<a href="index.html" class="logo logo--site-top" aria-label="Shield Construction LLC Home">' +
        '<img src="' + LOGO_SRC + '" alt="' + LOGO_ALT + '" class="logo__img logo__img--site-top">' +
      '</a>';

    const mainCol = document.createElement('div');
    mainCol.className = 'site-top__main';

    const parent = emergencySlot.parentNode;
    parent.insertBefore(wrapper, emergencySlot);
    wrapper.appendChild(logoCol);
    wrapper.appendChild(mainCol);
    emergencySlot.hidden = false;
    mainCol.appendChild(emergencySlot);
    mainCol.appendChild(headerSlot);
  }

  function syncSiteTopLogoSplit() {
    const logoCol = document.querySelector('.site-top__logo');
    const topBar = document.querySelector('.site-top-bar');
    const siteTop = document.querySelector('.site-top');
    if (!logoCol || !topBar || !siteTop) return;

    const totalH = siteTop.offsetHeight;
    const topBarH = topBar.offsetHeight;

    if (totalH > 0) {
      logoCol.style.setProperty('--logo-split', ((topBarH / totalH) * 100).toFixed(2) + '%');
      logoCol.style.setProperty('--logo-column-height', totalH + 'px');
    }
  }

  function initSiteTopLogoSplit() {
    function sync() {
      syncSiteTopLogoSplit();
    }

    sync();

    window.addEventListener('resize', sync);

    const siteTop = document.querySelector('.site-top');
    if (siteTop && typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(sync);
      observer.observe(siteTop);
      const topBar = document.querySelector('.site-top-bar');
      if (topBar) observer.observe(topBar);
      const siteHeader = document.querySelector('.site-header');
      if (siteHeader) observer.observe(siteHeader);
    }
  }

  function renderFooter() {
    const year = new Date().getFullYear();
    const areaLinks = SERVICE_AREAS.slice(0, 8).map(function (a) {
      return '<li><a href="contact.html">' + a + '</a></li>';
    }).join('');

    return (
      '<footer class="site-footer">' +
        '<div class="container footer-grid">' +
          '<div class="footer-brand">' +
            '<a href="index.html" class="logo">' +
              '<img src="' + LOGO_SRC + '" alt="' + LOGO_ALT + '" class="logo__img logo__img--footer" width="260" height="96">' +
            '</a>' +
            '<p>Georgia licensed restoration and reconstruction contractor serving Metro Atlanta. Professional water, mold, and storm damage restoration.</p>' +
            '<div class="footer-emergency">' +
              '<strong>Phone</strong>' +
              '<a href="tel:' + PHONE_TEL + '">' + PHONE_DISPLAY + '</a>' +
            '</div>' +
          '</div>' +
          '<div class="footer-col">' +
            '<h4>Quick Links</h4>' +
            '<ul>' +
              NAV_ITEMS.map(function (i) { return '<li><a href="' + i.href + '">' + i.label + '</a></li>'; }).join('') +
            '</ul>' +
          '</div>' +
          '<div class="footer-col">' +
            '<h4>Services</h4>' +
            '<ul>' +
              '<li><a href="services.html#water-damage">Water Damage Restoration</a></li>' +
              '<li><a href="services.html#mold-remediation">Mold Remediation</a></li>' +
              '<li><a href="services.html#storm-damage">Storm Damage Repair</a></li>' +
              '<li><a href="insurance-claims.html">Insurance Claim Assistance</a></li>' +
            '</ul>' +
          '</div>' +
          '<div class="footer-col">' +
            '<h4>Service Areas</h4>' +
            '<ul>' + areaLinks + '</ul>' +
          '</div>' +
        '</div>' +
        '<div class="container footer-bottom">' +
          '<span>&copy; ' + year + ' Shield Construction LLC. All rights reserved.</span>' +
          '<div class="footer-legal">' +
            '<a href="#">Privacy Policy</a>' +
            '<a href="#">Terms of Service</a>' +
          '</div>' +
        '</div>' +
      '</footer>'
    );
  }

  function injectLayout() {
    const emergencySlot = document.getElementById('emergency-bar');
    const headerSlot = document.getElementById('site-header');
    const footerSlot = document.getElementById('site-footer');
    const floatSlot = document.getElementById('floating-emergency');
    const modalSlot = document.getElementById('emergency-modal-root');

    if (emergencySlot) emergencySlot.innerHTML = renderTopBar();
    if (headerSlot) headerSlot.innerHTML = renderHeader();
    buildSiteTopWrapper();
    if (footerSlot) footerSlot.innerHTML = renderFooter();
    if (floatSlot) floatSlot.innerHTML = '';
    if (modalSlot) modalSlot.innerHTML = '';
  }

  function initMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.getElementById('main-nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function validateForm(form) {
    const required = form.querySelectorAll('[required]');
    let valid = true;

    required.forEach(function (field) {
      if (!field.value.trim()) {
        valid = false;
        field.style.borderColor = '#ef4444';
      } else {
        field.style.borderColor = '';
      }
    });

    const emailField = form.querySelector('input[type="email"]');
    if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
      valid = false;
      emailField.style.borderColor = '#ef4444';
    }

    const phoneField = form.querySelector('input[type="tel"]');
    if (phoneField && phoneField.value && phoneField.hasAttribute('required')) {
      const digits = phoneField.value.replace(/\D/g, '');
      if (digits.length < 10) {
        valid = false;
        phoneField.style.borderColor = '#ef4444';
      }
    }

    return valid;
  }

  function showFormMessage(el, type, text) {
    if (!el) return;
    el.className = 'form-message ' + type;
    el.textContent = text;
    el.style.display = 'block';
  }

  function handleFormSubmit(form, messageEl, extraData, callbacks) {
    callbacks = callbacks || {};

    function runOnSuccess() {
      if (typeof callbacks.onSuccess === 'function') {
        callbacks.onSuccess();
      }
    }

    function successMessage() {
      return 'Thank you! Your inspection request has been received. We will contact you shortly.';
    }

    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const cooldownMs = getFormCooldownRemaining(form.id);
      if (cooldownMs > 0) {
        const seconds = Math.ceil(cooldownMs / 1000);
        showFormMessage(messageEl, 'error', 'Please wait ' + seconds + ' seconds before submitting again.');
        return;
      }

      if (isHoneypotFilled(form)) {
        showFormMessage(messageEl, 'success', 'Thank you! Your request has been received. We will contact you shortly.');
        form.reset();
        runOnSuccess();
        return;
      }

      if (!validateForm(form)) {
        showFormMessage(messageEl, 'error', 'Please fill in all required fields correctly.');
        return;
      }

      form.classList.add('form-loading');
      setSubmitButtonDisabled(form, true);
      showFormMessage(messageEl, '', '');

      const data = Object.assign({}, extraData || {});
      new FormData(form).forEach(function (value, key) {
        if (key === 'website') return;
        data[key] = value;
      });
      data.timestamp = new Date().toISOString();
      data.source = data.source || window.location.pathname;
      data.formType = data.formType || form.id;

      try {
        const result = await submitToGoogleSheet(data);
        if (result.demo) {
          showFormMessage(messageEl, 'success', 'Thank you! Your request has been received. We will contact you shortly. (Demo mode — add your Google Apps Script URL in js/config.js.)');
          setFormCooldown(form.id);
          form.reset();
          runOnSuccess();
        } else if (result.error === 'rate_limit') {
          showFormMessage(messageEl, 'error', result.message || 'Please wait before submitting again.');
        } else if (!result.ok) {
          console.error('[Shield Construction] Form submission error:', result.error || result);
          showFormMessage(messageEl, 'error', 'Something went wrong. Please call us at ' + PHONE_DISPLAY + ' for immediate assistance.');
        } else {
          showFormMessage(messageEl, 'success', successMessage());
          setFormCooldown(form.id);
          form.reset();
          runOnSuccess();
        }
      } catch (err) {
        showFormMessage(messageEl, 'error', 'Something went wrong. Please call us at ' + PHONE_DISPLAY + ' for immediate assistance.');
        console.error(err);
      } finally {
        form.classList.remove('form-loading');
        setTimeout(function () {
          setSubmitButtonDisabled(form, getFormCooldownRemaining(form.id) > 0);
        }, 100);
      }
    });
  }

  function initForms() {
    const contactForm = document.getElementById('contact-form');
    const contactMsg = document.getElementById('contact-form-message');
    if (contactForm) {
      handleFormSubmit(contactForm, contactMsg, { formType: 'request-inspection' });
    }
  }

  function initTestimonialCarousel() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    if (!slides.length) return;

    let current = 0;

    function show(index) {
      slides.forEach(function (s, i) { s.classList.toggle('active', i === index); });
      dots.forEach(function (d, i) { d.classList.toggle('active', i === index); });
      current = index;
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { show(i); });
    });

    setInterval(function () {
      show((current + 1) % slides.length);
    }, 6000);
  }

  function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const item = btn.closest('.faq-item');
        const wasOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(function (i) { i.classList.remove('open'); });
        if (!wasOpen) item.classList.add('open');
      });
    });
  }

  function initGalleryFilter() {
    const filters = document.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll('.gallery-item');
    if (!filters.length) return;

    filters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const cat = btn.dataset.filter;
        filters.forEach(function (b) { b.classList.toggle('active', b === btn); });
        items.forEach(function (item) {
          if (cat === 'all' || item.dataset.category === cat) {
            item.classList.remove('hidden');
          } else {
            item.classList.add('hidden');
          }
        });
      });
    });
  }

  function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    if (!lightbox) return;

    document.querySelectorAll('[data-lightbox]').forEach(function (el) {
      el.addEventListener('click', function () {
        lightboxImg.src = el.dataset.lightbox || el.querySelector('img')?.src || '';
        lightboxImg.alt = el.dataset.alt || '';
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    lightbox.querySelector('.lightbox__close')?.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    injectLayout();
    initSiteTopLogoSplit();
    initHeroServiceStrip();
    initServiceAreaMaps();
    injectGallery();
    initGalleryImages();
    initMobileNav();
    initForms();
    initTestimonialCarousel();
    initFAQ();
    initGalleryFilter();
    initLightbox();
  });

  window.submitToGoogleSheet = submitToGoogleSheet;
})();
