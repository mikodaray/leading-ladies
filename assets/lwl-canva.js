/* Ladies Who Launch landing page (lwl-canva-* sections): scroll reveal, and buttons that play their click
   animation before the link opens. Every section loads this file; the first run does the work and later
   runs just look for new elements (sections added in the theme editor). */
(function () {
  if (window.lwlcInit) {
    window.lwlcInit();
    return;
  }

  var reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var observer = null;

  if ('IntersectionObserver' in window && !reduceMotion) {
    observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -5% 0px' }
    );
  }

  function bindReveals() {
    var items = document.querySelectorAll('.lwlc [data-lwlc-reveal]:not([data-lwlc-bound])');
    Array.prototype.forEach.call(items, function (el) {
      el.setAttribute('data-lwlc-bound', '');
      if (observer) observer.observe(el);
      else el.classList.add('is-visible');
    });
  }

  function bindButtons() {
    var links = document.querySelectorAll('.lwlc [data-lwlc-cta]:not([data-lwlc-bound])');
    Array.prototype.forEach.call(links, function (link) {
      link.setAttribute('data-lwlc-bound', '');
      link.addEventListener('click', function (event) {
        // let new-tab / modified clicks behave like a normal link
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        if (link.target === '_blank' || reduceMotion) return;

        event.preventDefault();
        if (link.hasAttribute('data-lwlc-clicked')) return;
        link.setAttribute('data-lwlc-clicked', '');
        link.classList.add('is-clicked');

        var opened = false;
        function openLink() {
          if (opened) return;
          opened = true;
          window.location.href = link.href;
        }
        link.addEventListener('animationend', openLink, { once: true });
        window.setTimeout(openLink, 1000); // safety net if animationend never fires
      });
    });
  }

  function init() {
    window.lwlcBound = true;
    bindReveals();
    bindButtons();
  }

  window.lwlcInit = init;
  init();
  document.addEventListener('shopify:section:load', init);

  // a bfcache restore (Back button) should not leave a button mid-animation
  window.addEventListener('pageshow', function (event) {
    if (!event.persisted) return;
    Array.prototype.forEach.call(document.querySelectorAll('.lwlc [data-lwlc-cta]'), function (link) {
      link.classList.remove('is-clicked');
      link.removeAttribute('data-lwlc-clicked');
    });
  });
})();
