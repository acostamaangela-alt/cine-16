// Cine 16 Studio
// Scroll-triggered fade and rise

(function () {
  'use strict';

  // Selectors that get the reveal treatment.
  // Mix of headings, paragraphs, image grids, and content blocks.
  var selectors = [
    '.intro-text',
    '.section-head',
    '.work-card',
    '.work-footer',
    '.service',
    '.services-also',
    '.about-content > p',
    '.founders-tagline',
    '.founder',
    '.contact-statement',
    '.contact-info',
    '.contact-info-block',
    '.portfolio-project',
    '.video-block',
    '.projects-tile',
    '.contact-form',
    '.contact-info-col',
    '.page-404 > div',
    '.page-404 .num',
    '.projects-hero h1',
    '.projects-hero .subtitle',
    '.projects-hero .hero-num',
    '.contact-page-hero',
    '.portfolio-images .img-wrap'
  ].join(', ');

  var elements = document.querySelectorAll(selectors);

  // Mark all targets with the reveal class
  elements.forEach(function (el) { el.classList.add('reveal'); });

  // Stagger items inside grids so they cascade in
  document.querySelectorAll('.work-grid').forEach(function (grid) {
    grid.querySelectorAll('.work-card').forEach(function (card, i) {
      card.style.setProperty('--reveal-delay', (i * 100) + 'ms');
    });
  });

  document.querySelectorAll('.portfolio-images').forEach(function (grid) {
    grid.querySelectorAll('.img-wrap').forEach(function (item, i) {
      item.style.setProperty('--reveal-delay', (i * 70) + 'ms');
    });
  });

  document.querySelectorAll('.projects-tiles').forEach(function (grid) {
    grid.querySelectorAll('.projects-tile').forEach(function (tile, i) {
      tile.style.setProperty('--reveal-delay', (i * 120) + 'ms');
    });
  });

  document.querySelectorAll('.founders-grid').forEach(function (grid) {
    grid.querySelectorAll('.founder').forEach(function (founder, i) {
      founder.style.setProperty('--reveal-delay', (i * 150) + 'ms');
    });
  });

  // Fallback if IntersectionObserver isn't available
  if (!('IntersectionObserver' in window)) {
    elements.forEach(function (el) { el.classList.add('in-view'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -60px 0px'
  });

  elements.forEach(function (el) { observer.observe(el); });

  // Lightbox for photography page
  (function () {
    var images = Array.prototype.slice.call(document.querySelectorAll('.portfolio-images .img-wrap img'));
    if (!images.length) return;

    var box = document.createElement('div');
    box.className = 'lightbox';
    box.innerHTML = '<button class="lightbox-close" aria-label="Close">&times;</button>' +
      '<button class="lightbox-prev" aria-label="Previous">&larr;</button>' +
      '<button class="lightbox-next" aria-label="Next">&rarr;</button>' +
      '<img class="lightbox-img" alt="">' +
      '<span class="lightbox-counter"></span>';
    document.body.appendChild(box);

    var imgEl = box.querySelector('.lightbox-img');
    var counter = box.querySelector('.lightbox-counter');
    var idx = 0;

    function show(i) {
      idx = (i + images.length) % images.length;
      var src = images[idx].getAttribute('src');
      var alt = images[idx].getAttribute('alt') || '';
      imgEl.src = src;
      imgEl.alt = alt;
      counter.textContent = String(idx + 1).padStart(2, '0') + ' / ' + String(images.length).padStart(2, '0');
    }

    function open(i) {
      show(i);
      box.classList.add('open');
      document.body.classList.add('lightbox-open');
    }

    function close() {
      box.classList.remove('open');
      document.body.classList.remove('lightbox-open');
    }

    images.forEach(function (img, i) {
      img.parentElement.addEventListener('click', function (e) {
        e.preventDefault();
        open(i);
      });
    });

    box.querySelector('.lightbox-close').addEventListener('click', close);
    box.querySelector('.lightbox-prev').addEventListener('click', function (e) {
      e.stopPropagation(); show(idx - 1);
    });
    box.querySelector('.lightbox-next').addEventListener('click', function (e) {
      e.stopPropagation(); show(idx + 1);
    });
    box.addEventListener('click', function (e) {
      if (e.target === box || e.target === imgEl) close();
    });
    document.addEventListener('keydown', function (e) {
      if (!box.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
  })();

  // Contact form: build a mailto link from the fields and open the email client.
  // Bypasses Chrome's "not secure" warning that fires on native HTTPS-to-mailto form submission.
  var form = document.getElementById('inquiry-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var name = (data.get('name') || '').trim();
      var fromEmail = (data.get('email') || '').trim();
      var projectType = (data.get('project-type') || 'Inquiry').trim();
      var timeline = (data.get('timeline') || 'Not specified').trim();
      var message = (data.get('message') || '').trim();

      var subject = 'Inquiry: ' + projectType + ' / ' + (name || 'Cine 16 Studio');
      var body = [
        'Name: ' + name,
        'Email: ' + fromEmail,
        'Project Type: ' + projectType,
        'Timeline: ' + timeline,
        '',
        'Brief:',
        message
      ].join('\n');

      var url = 'mailto:hello@cine16studio.com'
        + '?subject=' + encodeURIComponent(subject)
        + '&body=' + encodeURIComponent(body);

      window.location.href = url;
    });
  }
})();
