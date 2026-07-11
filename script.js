    var fanartData = window.fanartData || [];

    function getAvatarUrl(item) {
      if (item.avatar) return item.avatar;
      if (!item.handle) return '';
      return 'https://unavatar.io/x/' + item.handle.replace(/^@/, '');
    }

    function createUserIcon(item) {
      var icon = document.createElement('span');
      icon.className = 'user-icon';

      var fallback = document.createElement('span');
      fallback.className = 'user-icon-fallback';
      fallback.textContent = (item.author || '?').charAt(0);

      var avatarUrl = getAvatarUrl(item);
      if (!avatarUrl) {
        icon.appendChild(fallback);
        return icon;
      }

      var avatar = document.createElement('img');
      avatar.src = avatarUrl;
      avatar.alt = '';
      avatar.loading = 'lazy';
      avatar.referrerPolicy = 'no-referrer';
      avatar.addEventListener('error', function () {
        avatar.remove();
        icon.appendChild(fallback);
      }, { once: true });

      icon.appendChild(avatar);
      return icon;
    }

    // ---- Render grid ----
    (function () {
      var grid = document.getElementById('fanart-grid');

      fanartData.forEach(function (item, i) {
        var thumb = document.createElement('div');
        thumb.className = 'fanart-thumb animate-in';
        thumb.style.animationDelay = (0.65 + i * 0.04) + 's';
        thumb.setAttribute('role', 'button');
        thumb.setAttribute('tabindex', '0');
        thumb.setAttribute('aria-label', item.author + 'さんのファンアートを見る');

        if (item.img) {
          var img = document.createElement('img');
          img.src = item.img;
          img.alt = item.caption || (item.author + 'のファンアート');
          img.loading = 'lazy';
          thumb.appendChild(img);
        } else {
          var ph = document.createElement('div');
          ph.className = 'placeholder-icon';
          ph.textContent = item.icon || '🎨';
          thumb.appendChild(ph);
        }

        var credit = document.createElement('div');
        credit.className = 'thumb-credit';
        credit.appendChild(createUserIcon(item));
        var creditName = document.createElement('span');
        creditName.className = 'thumb-credit-name';
        creditName.textContent = item.author;
        credit.appendChild(creditName);
        thumb.appendChild(credit);

        thumb.addEventListener('click', function () { openLightbox(i); });
        thumb.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(i); }
        });

        grid.appendChild(thumb);
      });
    })();

    // ---- Lightbox ----
    (function () {
      var overlay = document.getElementById('lightbox-overlay');
      var imageWrap = document.getElementById('lightbox-image-wrap');
      var creditEl = document.getElementById('lightbox-credit');
      var dateEl = document.getElementById('lightbox-date');
      var linkEl = document.getElementById('lightbox-link');
      var closeBtn = document.getElementById('lightbox-close');

      window.openLightbox = function (index) {
        var item = fanartData[index];
        imageWrap.innerHTML = '';
        if (item.img) {
          var img = document.createElement('img');
          img.src = item.img;
          img.alt = item.caption || (item.author + 'のファンアート');
          imageWrap.appendChild(img);
        } else {
          var ph = document.createElement('div');
          ph.className = 'placeholder-icon';
          ph.textContent = item.icon || '🎨';
          imageWrap.appendChild(ph);
        }
        creditEl.innerHTML = '';
        creditEl.appendChild(createUserIcon(item));
        var creditText = document.createElement('span');
        creditText.className = 'lightbox-credit-text';
        creditText.textContent = item.author + ' (' + item.handle + ')' + (item.caption ? ' — ' + item.caption : '');
        creditEl.appendChild(creditText);
        dateEl.textContent = item.date;
        dateEl.style.display = item.date ? '' : 'none';
        linkEl.href = item.url;

        overlay.classList.add('open');
      };

      function closeLightbox() {
        overlay.classList.remove('open');
      }

      closeBtn.addEventListener('click', closeLightbox);
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closeLightbox();
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeLightbox();
      });
    })();

    // ---- Animate-in stagger on scroll / IntersectionObserver ----
    (function () {
      var els = document.querySelectorAll('.animate-in');
      if ('IntersectionObserver' in window) {
        var obs = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.style.animationPlayState = 'running';
              obs.unobserve(entry.target);
            }
          });
        }, { threshold: 0.1 });
        els.forEach(function (el) {
          el.style.animationPlayState = 'paused';
          obs.observe(el);
        });
      } else {
        els.forEach(function (el) { el.style.opacity = 1; });
      }
    })();
